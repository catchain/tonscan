<template>
    <div class="page-apps-search">
        <div class="page-apps-search-input" v-bind:class="{
            'page-apps-search-input--focused': searchFocused,
            'page-apps-search-input--expanded': searchSuggestionsVisible,
        }">
            <icon-search class="page-apps-search-input__icon"/>

            <input class="page-apps-search-input__input" type="search"
                v-bind:placeholder="$t('apps.search')"
                v-on:focus="focus"
                v-on:blur="blur"
                v-on:input="searchInputChange"
                v-model="searchInputValue"/>

            <div class="page-apps-search-input__right">
                <icon-loading v-if="loading"/>
                <icon-close
                    v-else-if="(searchInputValue || '').length > 0"
                    v-on:click.native="clearSearch"/>
            </div>
        </div>

        <!-- Search suggestions under the search field: -->
        <template v-if="showSuggestions">
            <div class="page-apps-search-suggestions"
                v-show="searchSuggestionsVisible">

                <ui-link class="page-apps-search-suggestions__suggestion"
                    v-for="app in searchSuggestions"
                    v-bind:key="app.slug"
                    v-bind:to="{
                        name: 'app', params: { app: app.slug },
                    }">
                    <search-suggestion v-bind="app"/>
                </ui-link>

                <div v-if="searchEmpty" class="page-apps-search-suggestions__box-empty">
                    <span>Ничего не найдено</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import IconSearch from '@img/icons/tonscan/apps/search.svg?vue';
import IconClose from '@img/icons/material-duotone/close.svg?vue';
import IconLoading from '@img/icons/tonscan/loading.svg?vue';
import SearchSuggestion from '~/components/apps/Navigation/SearchFieldSuggestion.vue';
import { searchApps } from '~/components/apps/index.js';

export default {
    timerHandle: undefined,

    props: {
        showSuggestions: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            searchFocused: false,
            searchInputValue: '',
            searchSuggestions: [],
            searchEmpty: false,
            showSearchSuggestionsBox: false,
            loading: false,
        };
    },

    computed: {
        searchSuggestionsVisible() {
            return this.showSearchSuggestionsBox && (this.searchEmpty || this.searchSuggestions.length > 0);
        },
    },

    watch: {
        value(newValue) {
            this.searchInputValue = newValue;
        },

        $route() {
            this.clearSearch();
            this.searchFocused = false;
            this.showSearchSuggestionsBox = false;
        },
    },

    inject: ['getCurrentAppSlug'],

    methods: {
        async getSearchResults() {
            const { hits } = await searchApps({
                per_page: 5,
                query_by: 'name,tags,category_slug',
                filter_by: `slug:!=${this.getCurrentAppSlug()}`,
                q: this.searchInputValue,
            });

            return hits;
        },

        blur() {
            clearTimeout(this.$options.timerHandle);

            this.$options.timerHandle = setTimeout(() => {
                this.searchFocused = false;
                this.showSearchSuggestionsBox = false;
            }, 200);
        },

        focus() {
            this.searchFocused = true;
            this.showSearchSuggestionsBox = true;
        },

        clearSearch() {
            this.searchInputValue = '';
            this.searchFocused = false;
            this.searchEmpty = false;
            this.searchSuggestions = [];
            this.searchInputChange();
        },

        async searchInputChange() {
            clearTimeout(this.$options.timerHandle);

            if (!this.showSuggestions) {
                this.$options.timerHandle = setTimeout(() => {
                    this.$emit('input', this.searchInputValue);
                }, 350);

                return;
            }

            if (!this.searchInputValue) {
                this.searchEmpty = false;
                this.searchSuggestions = [];
                this.loading = false;
                return;
            }

            this.loading = true;

            this.$options.timerHandle = setTimeout(async () => {
                this.searchSuggestions = await this.getSearchResults();
                this.searchEmpty = this.searchSuggestions.length === 0;
                this.showSearchSuggestionsBox = true;
                this.loading = false;
            }, 350);
        },
    },

    components: {
        SearchSuggestion,
        IconSearch,
        IconLoading,
        IconClose,
    },
};
</script>

<style lang="scss">
$search-box-border-size: 2px;

.page-apps-search {
    position: relative;
    width: calc(100% - 4px);
}

.page-apps-search-input {
    display: flex;
    align-items: center;
    width: 100%;
    height: calc(46px - $search-box-border-size * 2);
    color: inherit;
    position: relative;
    border-radius: 12px;
    background: var(--indexpage-search-background-color);
    border: $search-box-border-size solid var(--card-border-color);

    &--focused {
        background: var(--indexpage-search-background-color);
        border-color: var(--app-search-field-focused-border-color) !important;
        background: var(--indexpage-search-background-color);
    }

    &--expanded {
        border-radius: 12px 12px 0 0;
    }

    &__icon {
        width: 21px;
        height: 14px;
        margin: 16px 9px 16px 16px;
        color: var(--app-search-icon);
    }

    &__input {
        flex: 1;
        border: none;
        background: transparent;
        color: inherit;
        outline: none;
        font-size: 16px;
        padding: 0;
        height: 100%;
        &::placeholder {
            color: #939394;
        }
        &::-webkit-input-placeholder {
            color: #939394;
        }
    }

    &__right {
        cursor: pointer;
        width: 24px;
        height: 24px;
        margin-right: 16px;
        fill: var(--body-text-color);
        &:empty {
            width: 0;
        }
    }
}

.page-apps-search-suggestions {
    border: 2px solid var(--card-border-color);
    border-top: none;
    position: absolute;
    background: var(--card-background);
    width: 100%;
    z-index: 10000;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 0.5rem 1.2rem var(--card-box-shadow-color);
    &__suggestion {
        text-decoration: none;
        color: inherit;
        &:hover {
            text-decoration: none;
        }
    }
    &__box-empty {
        padding: 20px;
    }
}
</style>
