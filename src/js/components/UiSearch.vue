<template>
    <div class="search">
        <icon-loopa v-if="showLoopa" v-once class="search__loopa"/>

        <input class="search__input" type="search" ref="search" enterkeyhint="search" spellcheck="false" autocomplete="off"
            v-bind:class="{ 'search__input--expanded': isExpanded }"
            v-bind:placeholder="placeholder"
            v-model.trim="searchValue"
            v-on:keyup.enter="search()"
            v-on:keyup.esc="reset()"
            v-on:blur="handleBlur">

        <aside class="search__right-ear">
            <svg v-show="addressLoading" class="search__loader" xmlns="http://www.w3.org/2000/svg">
                <circle v-pre cx="9" cy="9" fill="none" stroke="currentColor" stroke-width="2" r="8" stroke-dasharray="34 12">
                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 9 9;360 9 9" keyTimes="0;1"/>
                </circle>
            </svg>

            <icon-close class="search__close"
                v-show="!addressLoading && searchValue"
                v-on:click="searchValue = null"/>

            <button class="search__go" v-if="showGoButton" v-on:click="search()">
                GO
            </button>
        </aside>

        <div class="search-results" v-show="isExpanded">
            <ul class="search-results__list">
                <li v-for="suggestion in suggestions" class="search-results__item" v-bind:key="suggestion.address">
                    <!-- .ton domain -->
                    <router-link class="search-results__link" v-bind:to="suggestion.routerParams">
                        <div class="search-result search-result--compact"
                            v-bind:class="{ 'search-result--offsetted': addOffsetToTinyResults }"
                            v-if="suggestion.category === 'dns_domain'">

                            <aside class="search-result__left">
                                <div class="search-result__address-icon">
                                    <icon-ton class="search-result__address-icon__svg"/>
                                </div>
                            </aside>

                            <main class="search-result__right">
                                <div class="search-results__domain" v-text="suggestion.domain"/>
                            </main>
                        </div>

                        <!-- rich address preview -->
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
                                        {{$t(`search.category.${suggestion.category}`)}}
                                    </span>
                                </div>
                                <div class="search-results__address">
                                    <ui-address disabled hide-name v-bind:address="suggestion.address"/>
                                </div>
                            </main>
                        </div>
                    </router-link>
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

const getRouterParamsFromSearchResult = (document) => {
    switch (document.category) {
        case 'dns_domain':
            return Object.freeze({
                name: 'address',
                params: { address: document.resolved_address || document.address },
            });

        case 'nft':
            return Object.freeze({
                name: 'nft',
                params: {
                    address: document.address,
                    skeletonHint: 'collection',
                },
            });

        case 'pool':
            return Object.freeze({
                name: 'nominator',
                params: { address: document.address },
            });

        default:
            return Object.freeze({
                name: 'address',
                params: { address: document.address },
            });
    }
};

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
        };
    },

    computed: {
        isExpanded() {
            return this.suggestions.length > 0;
        },

        showGoButton() {
            return this.showSearchButton
                && this.searchValue
                && (isValidDomain(this.searchValue) || isValidAddressCheap(this.searchValue));
        },
    },

    mounted() {
        if (this.focusOnLoad) {
            this.$nextTick(() => this.$refs.search.focus());
        }
    },

    watch: {
        $route() {
            this.searchValue = null;
            this.$emit('collapseMobileSearch');
        },

        focusInputField(value) {
            return value && this.$nextTick(() => this.$refs.search.focus());
        },

        searchValue(newValue, oldValue) {
            if (!newValue || newValue.length < 3 || newValue == oldValue) {
                return this.resetSuggestions();
            }

            this.getSuggestions();
        },
    },

    methods: {
        resetSuggestions() {
            this.suggestions = [];
            this.addressLoading = false;
        },

        async getSuggestions() {
            this.addressLoading = true;

            const values = await searchAddress(this.searchValue, {
                per_page: this.maxItems,
            });

            const suggestions = [];

            // Hardcoded addresses are always shown:
            values.addresses.forEach(({ document }) => {
                document.routerParams = getRouterParamsFromSearchResult(document);
                suggestions.push(document);
            });

            this.addOffsetToTinyResults = suggestions.length > 0;

            // Append the search results with top domains if there are free slots:
            while (suggestions.length < this.maxItems && values.domains.length > 0) {
                const domain = values.domains.shift().document;

                domain.category = 'dns_domain';
                domain.routerParams = getRouterParamsFromSearchResult(domain);

                suggestions.push(domain);
            }

            this.suggestions = suggestions.map(Object.freeze);
            this.addressLoading = false;
        },

        async search() {
            if (!this.searchValue || this.searchValue.length < 1) {
                return;
            }

            this.addressLoading = true;
            const route = await matchInput(this.searchValue);
            this.addressLoading = false;

            if (route) {
                this.$router.push(route);
                return this.reset();
            }

            const errorMessage = isValidDomain(this.searchValue)
                ? this.$t('header.search_domain_error')
                : this.$t('header.search_address_error');

            // Otherwise alert is shown before the spinner is hidden:
            this.$nextTick(() => alert(errorMessage));
        },

        reset() {
            this.$refs.search.blur();
            this.searchValue = null;
        },

        handleBlur() {
            if ((this.searchValue || '').length === 0) {
                this.$emit('collapseMobileSearch');
            }
        },
    },

    components: {
        IconTon, IconLoopa, IconClose,
    },
};
</script>

<style lang="scss">
.search {
    width: 100%;
    position: relative;
    &__input {
        font-size: 1em;
        display: block;
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
        &:focus {
            border-color: #2575ed !important;
        }
        &::placeholder {
            color: #777;
        }
        &::-webkit-input-placeholder {
            color: #777;
        }
    }
    &__right-ear {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        z-index: 1000;
        box-sizing: border-box;
        padding: 6px;
    }
    &__go {
        padding: 0 8px;
        border-radius: 8px;
        background: #2575ed;
        color: #FFF;
        height: 100%;
        min-width: 64px;
        font-size: 16px;
        cursor: pointer;
    }
    &__loader {
        width: 18px;
        height: 18px;
        z-index: 900;
        margin-right: 8px;
    }
    &__loopa {
        left: 10px;
        width: 20px;
        height: 20px;
        top: 9px;
        opacity: .35;
        z-index: 100;
    }
    &__close {
        width: 1.625em;
        height: 1.625em;
        fill: currentColor;
        opacity: .7;
        padding: 8px;
        margin: -8px;
        margin-right: -4px;
        cursor: pointer;
        transition: .1s opacity ease;
        &:hover {
            opacity: 1;
        }
    }
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
        &:hover {
            background: rgba(142, 142, 142, 0.16);
            text-decoration: none;
        }
    }
    &__domain {
        font-size: 15px;
        font-weight: 500;
        &::after {
            content: '.ton';
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
}
</style>
