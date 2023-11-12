<template>
    <div class="search">
        <div class="search-input" v-bind:class="{ 'search-input--expanded': isExpanded }">
            <icon-loopa class="search-input__loopa" v-bind:class="{
                'search-input__loopa--hidden': !canDisplayLoopa,
            }"/>

            <input class="search-input__input" type="search" ref="search" enterkeyhint="search" spellcheck="false" autocomplete="off"
                v-bind:placeholder="placeholder"
                v-model.trim="searchValue"
                v-on:keyup.enter="handleEnterPress()"
                v-on:keyup.esc="handleEsc()"
                v-on:keydown.up="handleUp()"
                v-on:keydown.down="handleDown()"
                v-on:focus="handleFocus()"
                v-on:click="searchFieldClicked = true">

            <aside class="search-input-controls">
                <svg v-show="addressLoading" class="search-input-controls__loader" xmlns="http://www.w3.org/2000/svg">
                    <circle v-pre cx="9" cy="9" fill="none" stroke="currentColor" stroke-width="2" r="8" stroke-dasharray="34 12">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 9 9;360 9 9" keyTimes="0;1"/>
                    </circle>
                </svg>

                <icon-close class="search-input-controls__close"
                    v-show="!addressLoading && searchValue"
                    v-on:click="searchValue = null"/>

                <button class="search-input-controls__go" v-if="showGoButton" v-on:click="search()">GO</button>
            </aside>
        </div>

        <div class="search-results" v-show="isExpanded">
            <ul class="search-results__list" ref="results">
                <li class="search-results__item"
                    v-for="(suggestion, idx) in suggestionList"
                    v-bind:key="suggestion.address"
                    v-bind:class="{ 'search-results__item--selected': idx === selectedItemIdx }"
                    v-bind:data-selected="idx === selectedItemIdx"
                    v-on:mouseenter="selectedItemIdx = undefined"> <!-- prefer hover over keyboard selected item -->
                    <ui-link class="search-results__link"
                        v-bind:to="suggestion.routerParams"
                        v-on:click.native="saveSuggestionToRecents(suggestion)">

                        <!-- recent succesful searches: -->
                        <div class="search-result search-result--compact"
                            v-bind:class="{ 'search-result--offsetted': addOffsetToTinyResults }"
                            v-if="suggestion.display_type === 'recent'">

                            <main class="search-result__right">
                                <template v-if="suggestion.domain">
                                    <div class="search-results__domain">
                                        {{suggestion.domain}}
                                        <span class="search-results__domain__tld">
                                            <template v-if="suggestion.address_type === 'telegram_username'">
                                                .t.me
                                            </template>
                                            <template v-else>
                                                .ton
                                            </template>
                                        </span>
                                    </div>
                                </template>

                                <template v-else-if="suggestion.name">
                                    {{suggestion.name}}
                                </template>

                                <ui-address v-else disabled hide-name v-bind:address="suggestion.address"/>
                            </main>

                            <aside class="search-result__buttons" style="z-index: 99999; position: relative;">
                                <icon-trash class="search-result-button" v-on:click.stop.prevent="removeSuggestionFromRecents(suggestion)"/>
                            </aside>
                        </div>

                        <!-- .ton or t.me domain: -->
                        <div class="search-result search-result--compact"
                            v-bind:class="{ 'search-result--offsetted': addOffsetToTinyResults }"
                            v-else-if="suggestion.display_type === 'dns_domain'">

                            <aside class="search-result__left">
                                <div class="search-result__address-icon">
                                    <icon-ton class="search-result__address-icon__svg"/>
                                </div>
                            </aside>

                            <main class="search-result__right">
                                <div class="search-results__domain">
                                    {{suggestion.domain}}
                                    <span class="search-results__domain__tld">
                                        <template v-if="suggestion.address_type === 'telegram_username'">
                                            .t.me
                                        </template>
                                        <template v-else>
                                            .ton
                                        </template>
                                    </span>
                                </div>
                            </main>
                        </div>

                        <!-- rich address preview: -->
                        <div class="search-result" v-else>
                            <aside class="search-result__left">
                                <div class="search-result__address-icon">
                                    <icon-ton class="search-result__address-icon__svg"/>
                                </div>
                                <img v-if="suggestion.image" class="search-result__image" v-bind:src="suggestion.image">
                            </aside>

                            <main class="search-result__right">
                                <div class="search-results__name">
                                    <span class="search-results__name__title" v-text="suggestion.name"/>
                                    <span class="search-results__name__category">
                                        {{$t(`search.category.${suggestion.address_type}`)}}
                                    </span>
                                </div>
                                <div class="search-results__address">
                                    <ui-address disabled hide-name v-bind:address="suggestion.address"/>
                                </div>
                            </main>
                        </div>
                    </ui-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { matchInput, isValidDomain, isValidAddressCheap } from '~/search.js';
import { searchAddress } from '~/api/typesense.js';
import IconLoopa from  '@img/icons/material-duotone/search.svg?inline';
import IconClose from  '@img/icons/material-duotone/close.svg?inline';
import IconTon from '@img/icons/tonscan/ton-24.svg?inline';
import IconTrash from '@primer/octicons/build/svg/trash-16.svg?inline';


class Suggestion {
    static DISPLAY_TYPE_RICH_PREVIEW = 'rich_preview';
    static DISPLAY_TYPE_DOMAIN = 'dns_domain';
    static DISPLAY_TYPE_RECENT = 'recent';

    constructor({ address, address_type, name, image, domain, resolved_address }, display_type) {
        this.address = address;
        this.address_type = address_type;
        this.name = name || undefined;
        this.image = image || undefined;
        this.domain = domain || undefined;
        this.resolved_address = resolved_address || undefined;
        this.display_type = display_type || this.DISPLAY_TYPE_RECENT;
    }

    get routerParams() {
        // address param for router link:
        const address = this.resolved_address || this.address;

        switch (this.address_type) {
            case 'dns_domain':
                return Object.freeze({
                    name: 'address',
                    params: { address },
                });

            case 'nft':
                return Object.freeze({
                    name: 'nft',
                    params: {
                        address: address,
                        skeletonHint: 'collection',
                    },
                });

            case 'pool':
                return Object.freeze({
                    name: 'nominator',
                    params: { address },
                });

            default:
                return Object.freeze({
                    name: 'address',
                    params: { address },
                });
        }
    }

    serialize() {
        return Object.freeze({
            address: this.address,
            address_type: this.address_type,
            resolved_address: this.resolved_address,
            name: this.name,
            image: this.image,
            domain: this.domain,
            image: this.image,
        });
    }
}

export default {
    props: {
        showSearchButton: Boolean,
        focusOnLoad: Boolean,
        focusInputField: Boolean,
        placeholder: String,
        showLoopa: Boolean,
        maxItems: {
            type: Number,
            default: 5,
        },
    },

    data() {
        return {
            searchValue: undefined,
            addressLoading: false,
            addOffsetToTinyResults: false,
            suggestions: [],
            selectedItemIdx: undefined,
            searchFieldClicked: false,
            searchFieldFocused: false,
        };
    },

    computed: {
        isExpanded() {
            return this.suggestionList.length > 0;
        },

        canDisplayLoopa() {
            return this.showLoopa && (!this.searchValue || (!this.searchValue && this.suggestionList.length > 0));
        },

        showGoButton() {
            return this.showSearchButton
                && this.searchValue
                && (isValidDomain(this.searchValue) || isValidAddressCheap(this.searchValue));
        },

        recentAddresses() {
            return this.$store.state.searchRecentAddresses.map((suggestion) => {
                return new Suggestion(suggestion, Suggestion.DISPLAY_TYPE_RECENT);
            });
        },

        suggestionList() {
            return this.searchFieldClicked && this.searchFieldFocused && !this.searchValue
                ? this.recentAddresses
                : this.suggestions;
        },
    },

    mounted() {
        document.addEventListener('click', this.handleClick, { passive: true });

        if (this.focusOnLoad) {
            this.$nextTick(() => this.$refs.search.focus());
        }
    },

    beforeDestroy() {
        document.removeEventListener('click', this.handleClick);
    },

    watch: {
        $route() {
            this.exitSearchMode();
        },

        focusInputField(focusInput) {
            if (!focusInput) return;

            // we're showing and hiding some elements here, so we have to
            // wait for the browser to repaint all blocks and then focus the input:
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.searchFieldClicked = true;
                    this.$refs.search.focus();
                });
            });
        },

        searchValue(newValue, oldValue) {
            if (!newValue || newValue.length < 3 || newValue == oldValue) {
                return this.resetSuggestions();
            }

            this.getSuggestions();
        },
    },

    methods: {
        exitSearchMode() {
            this.resetSuggestions();

            this.searchFieldFocused = false;
            this.searchValue = null;
            this.$refs.search.blur();

            this.$emit('collapseMobileSearch');
        },

        resetSuggestions() {
            this.suggestions = [];
            this.addressLoading = false;
            this.selectedItemIdx = undefined;
        },

        async getSuggestions() {
            if (!this.searchValue || this.searchValue.length < 3) {
                return;
            }

            this.addressLoading = true;

            const values = await searchAddress(this.searchValue, {
                per_page: this.maxItems,
            });

            // Hardcoded addresses are always shown:
            const suggestions = values.addresses.map(({ document }) => {
                const displayType = Suggestion.DISPLAY_TYPE_RICH_PREVIEW;

                const suggestion = { ...document,
                    address_type: document.category,
                };

                return new Suggestion(suggestion, displayType);
            });

            this.addOffsetToTinyResults = suggestions.length > 0;

            // Append the search results with top domains if there are free slots:
            while (suggestions.length < this.maxItems && values.domains.length > 0) {
                const domain = values.domains.shift().document;
                const suggestion = new Suggestion({ ...domain, address_type: domain.type }, Suggestion.DISPLAY_TYPE_DOMAIN);

                suggestions.push(suggestion);
            }

            this.suggestions = suggestions.map(Object.freeze);
            this.addressLoading = false;
            this.selectedItemIdx = undefined;
        },

        async search() {
            this.addressLoading = true;
            const route = await matchInput(this.searchValue);
            this.addressLoading = false;

            if (route) {
                this.$router.push({ ...route, params: { ...route.params,
                    lang: this.$i18n.locale,
                }});

                // ignore transactions, blocks etc:
                if (route.params.address) {
                    const suggestion = new Suggestion({ address: route.params.address });
                    this.saveSuggestionToRecents(suggestion);
                }

                return this.exitSearchMode();
            }

            const errorMessage = isValidDomain(this.searchValue)
                ? this.$t('header.search_domain_error')
                : this.$t('header.search_address_error');

            // Otherwise alert is shown before the spinner is hidden:
            this.$nextTick(() => alert(errorMessage));
        },

        saveSuggestionToRecents(suggestion) {
            this.$store.dispatch('rememberRecentSearch', suggestion.serialize());
        },

        removeSuggestionFromRecents(suggestion) {
            this.$store.dispatch('forgetRecentSearch', suggestion.serialize());
        },

        handleEnterPress() {
            if (this.selectedItemIdx === undefined) {
                return this.search();
            }

            const suggestion = this.suggestionList[this.selectedItemIdx];
            const route = suggestion.routerParams;

            this.$router.push({ ...route, params: { ...route.params,
                lang: this.$i18n.locale,
            }});

            return this.saveSuggestionToRecents(suggestion);
        },

        handleFocus() {
            this.searchFieldFocused = true;

            // if there's already some input in the field, show suggestions:
            this.getSuggestions();
        },

        handleClick(event) {
            // this handler watches for all document clicks,
            // so we do nothing if the search is not active:
            if (!this.isExpanded) {
                return true;
            }

            const clickWasOutsideSearchBlock = !event.composedPath().includes(this.$el);

            // If clicked outside the active search box:
            //   1) close suggestion list
            //   2) blur the input field, but keep the input
            if (this.searchFieldFocused && clickWasOutsideSearchBlock) {
                this.resetSuggestions();
                this.searchFieldFocused = false;
                this.$emit('collapseMobileSearch');
            }
        },

        handleUp() {
            const reachedTop = this.selectedItemIdx === 0;

            // unset or reached top - skip to the end of the list:
            if (this.selectedItemIdx === undefined || reachedTop) {
                this.selectedItemIdx = this.suggestionList.length - 1;

            // otherwise select the previous item:
            } else {
                this.selectedItemIdx = this.selectedItemIdx - 1;
            }

            this.$nextTick(() => this.scrollSearchResults());
        },

        handleDown(e) {
            // if input field is already focused on component load
            // and user presses down button - allow showing suggestions:
            if (this.focusOnLoad && !this.searchFieldClicked) {
                this.searchFieldClicked = true;
            }

            const reachedBottom = this.selectedItemIdx >= this.suggestionList.length - 1;

            // unset or reached bottom - start from the beginning:
            if (this.selectedItemIdx === undefined || reachedBottom) {
                this.selectedItemIdx = 0;

            // otherwise select the next item:
            } else {
                this.selectedItemIdx = this.selectedItemIdx + 1;
            }

            this.$nextTick(() => this.scrollSearchResults());
        },

        handleEsc() {
            // on the first press just clear the input:
            if (this.searchValue) {
                this.searchValue = null;

            // after the field is empty, exit the search box:
            } else {
                this.exitSearchMode();
            }
        },

        scrollSearchResults() {
            try {
                this.$refs.results.querySelector('[data-selected="true"]').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });

            } catch (e) {
                // just ignore unsupported browsers
            }
        },
    },

    components: {
        IconTon, IconLoopa, IconClose, IconTrash,
    },
};
</script>

<style lang="scss">
.search-input {
    display: flex;
    align-items: stretch;
    width: 100%;
    border: none;
    color: var(--body-text-color);
    box-sizing: border-box;
    position: relative;
    z-index: 200;
    transition: .06s border-color ease;

    &--expanded {
        background: var(--indexpage-search-background-color) !important;
        border: 2px solid var(--card-border-color) !important;
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }

    &:focus-within {
        border-color: #2575ed !important;
    }

    &__loopa {
        width: 20px;
        height: 20px;
        opacity: .35;
        z-index: 100;
        align-self: center;
        flex-shrink: 0;
        transition: .1s all ease;
        overflow: hidden;
        fill: currentColor;
        &--hidden {
            width: 0;
        }
    }

    &__input {
        font-size: 1em;
        appearance: none;
        border: none;
        display: block;
        padding: 0;
        width: 100%;
        background: transparent;
        text-overflow: ellipsis;
        color: inherit;
        &::placeholder {
            color: #777;
        }
        &::-webkit-input-placeholder {
            color: #777;
        }
    }
}

.search-input-controls {
    display: flex;
    align-items: center;
    min-height: 100%;
    z-index: 1000;
    box-sizing: border-box;
    padding: 0.25em 0.65em;
    gap: 0.5em;
    &__loader {
        width: 18px;
        height: 18px;
        z-index: 900;
    }
    &__go {
        border-radius: 9px;
        background: #2575ed;
        color: #FFF;
        height: 100%;
        min-width: 64px;
        font-size: 16px;
        cursor: pointer;
        margin-right: -0.4em; // make right offset from container border the same with top and bottom offset
    }
    &__close {
        width: 1.625em;
        height: 1.625em;
        fill: currentColor;
        opacity: .7;
        padding: 8px;
        margin: -8px;
        cursor: pointer;
        transition: .1s opacity ease;
        &:hover {
            opacity: 1;
        }
    }
}

.search {
    width: 100%;
    position: relative;
}

.search-results {
    z-index: 100;
    width: 100%;
    position: absolute;
    top: 100%;
    border: 2px solid var(--card-border-color);
    border-top: none;
    box-shadow: 0 0.5rem 1.2rem var(--card-box-shadow-color);
    color: var(--body-text-color);
    box-sizing: border-box;
    font-size: 16px;
    background: var(--indexpage-search-background-color);
    border-radius: 0 0 12px 12px;
    &__list {
        overflow-y: auto;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    &__link {
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
        line-height: 1.4;
        color: inherit;
        background: transparent;
        &:hover, .search-results__item--selected & {
            background: rgba(142, 142, 142, 0.16);
            text-decoration: none;
        }
    }
    &__domain {
        font-size: 15px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        &__tld {
            font-weight: normal;
            opacity: .6;
        }
    }
    &__name {
        font-weight: 500;
        font-size: 15px;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        &__title {
            flex-shrink: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &__category {
            display: inline-flex;
            align-items: center;
            font-weight: normal;
            opacity: .45;
            font-size: 12px;
            &::before {
                opacity: .65;
                content: '·';
                padding: 0 6px;
            }
        }
    }
    &__address {
        font-size: 13px;
        opacity: .7;
    }
}

.search-result {
    display: flex;
    align-items: center;
    white-space: nowrap;
    &--compact {
        padding-left: 2px;
    }
    &__left {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        position: relative;
        .search-result--compact & {
            display: none;
        }
    }
    &__address-icon {
        width: 42px;
        height: 42px;
        border-radius: 8px;
        background: var(--card-border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        &__svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
            margin-right: -1px;
        }
        .search-result--offsetted & {
            margin: 0 9px;
        }
        .search-result--compact & {
            border-radius: 50%;
            width: 24px;
            height: 24px;
            box-shadow: 0 0 0 4px #1d1d1d;
            &__svg {
                width: 60%;
                height: 60%;
                margin-bottom: -1px;
            }
        }
    }
    &__image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    &__right {
        overflow: hidden;
        .search-result--compact & {
            display: flex;
            align-items: center;
        }
    }
    &__buttons {
        flex-grow: 0;
        display: flex;
        align-items: center;
        margin-right: -4px;
        padding-left: 18px;
        margin-left: auto;
    }
}
.search-result-button {
    fill: var(--badge-grey-color);
    padding: 8px;
    margin: -8px;
    border-radius: 50%;
    &:hover {
        fill: var(--badge-red-color);
    }
}
</style>
