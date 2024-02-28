<template>
    <t-row class="page-apps">
        <t-col v-bind:cols="3" mobile="hidden" tablet="hidden">
            <navigation v-if="!isMobile && !isTablet"/>
        </t-col>

        <t-col v-bind:cols="9" v-bind:tablet="12" v-bind:mobile="12">
            <div class="page-apps__content">
                <banner v-if="isCategoryPage || is404"/>

                <!-- Search field is always shown on every page: -->
                <div class="page-apps__search-filter-wrapper">
                    <search-field class="apps__search"
                        v-model="searchValue"
                        v-bind:showSuggestions="isAppPage || is404"
                        v-bind:style="{
                            'margin-bottom': is404 || isAppPage || isMobile || isTablet ? '0' : '20px',
                        }"/>

                    <t-selector height="inherit"
                        v-if="!is404 && isCategoryPage && (!isMobile && !isTablet)"
                        v-bind:selected-item="currentFilter"
                        v-bind:items="appsFilters"
                        v-on:select="updateFilter"/>
                </div>

                <!-- Show info under the search if invalid category is requested: -->
                <not-found v-if="is404"/>

                <!-- Category page: showing category selector and sorting switcher: -->
                <template v-else-if="isCategoryPage">
                    <navigation-mobile v-if="isMobile || isTablet">
                        <template slot="filters">
                            <t-selector
                                v-bind:items="appsFilters"
                                v-bind:selectedItem="currentFilter"
                                v-on:select="updateFilter"/>
                        </template>
                    </navigation-mobile>

                    <list-wrapper
                        v-bind:search-value.sync="searchValue"
                        v-on:clear="clearSearchValue"/>
                </template>

                <!-- App view page: -->
                <router-view v-else/>
            </div>
        </t-col>
    </t-row>
</template>

<script>
import { clearSearchCache } from '~/components/apps/index.js';
import IconAppsWallets from '@img/icons/tonscan/apps/wallets.svg?vue';
import IconAppsExchanges from '@img/icons/tonscan/apps/exchanges.svg?vue';
import IconAppsMarketplaces from '@img/icons/tonscan/apps/marketplaces.svg?vue';
import IconAppsGames from '@img/icons/tonscan/apps/games.svg?vue';
import IconAppsStaking from '@img/icons/tonscan/apps/staking.svg?vue';
import IconAppsSocial from '@img/icons/tonscan/apps/social.svg?vue';
import IconAppsTools from '@img/icons/tonscan/apps/tools.svg?vue';
import IconAppsOther from '@img/icons/tonscan/apps/other.svg?vue';
import IconAppsAll from '@img/icons/tonscan/apps/all.svg?vue';
import SearchField from '~/components/apps/Navigation/SearchField.vue';
import NavigationMobile from '~/components/apps/Navigation/NavigationMobile.vue';
import Navigation from '~/components/apps/Navigation/Navigation.vue';
import ListWrapper from '~/components/apps/List/ListWrapper.vue';
import Banner from '~/components/apps/PageAppsBanner.vue';
import NotFound from '~/components/apps/Navigation/SearchNotFound.vue';

export default {
    name: 'PageApps',

    metaInfo() {
        const category = this.categories.find(({ slug }) => slug === this.currentCategory);

        return {
            title: `TON Explorer :: ${category?.name}`,
        };
    },

    provide() {
        return {
            getCurrentAppSlug: () => this.$route.params.app,

            getCurrentCategory: () => this.currentCategory,

            // Filters and categories can be set only in PageApps component.
            // No need to mutate them from child components
            getAppsFilters: () => this.appsFilters,
            getCategories: () => this.categories,

            getCurrentFilter: () => this.currentFilter,
            setCurrentFilter: (filter) => {
                this.currentFilter = filter;
            },

            getCategoryBySlug: this.getCategoryBySlug,
            getToByCategory: this.getToByCategory,
        };
    },

    data() {
        return {
            currentFilter: null,
            searchValue: '',
        };
    },

    computed: {
        isAppPage() {
            return this.$route.name === 'app';
        },

        isCategoryPage() {
            return !this.isAppPage;
        },

        is404() {
            return !this.categories.some(({ slug }) => slug === this.currentCategory);
        },

        // Filters and categories are computed properties
        // because names must reactively change on language change
        appsFilters() {
            return [{
                name: this.$t('apps.filters.top'),
                value: 'popular',
            }, {
                name: this.$t('apps.filters.newest'),
                value: 'newest',
            }];
        },

        categories() {
            return [{
                name: this.$t('apps.categories.all'),
                slug: undefined,
                icon: IconAppsAll,
            }, {
                name: this.$t('apps.categories.wallets'),
                slug: 'wallets',
                icon: IconAppsWallets,
            }, {
                name: this.$t('apps.categories.exchanges'),
                slug: 'exchanges',
                icon: IconAppsExchanges,
            }, {
                name: this.$t('apps.categories.marketplaces'),
                slug: 'marketplaces',
                icon: IconAppsMarketplaces,
            }, {
                name: this.$t('apps.categories.games'),
                slug: 'games',
                icon: IconAppsGames,
            }, {
                name: this.$t('apps.categories.staking'),
                slug: 'staking',
                icon: IconAppsStaking,
            }, {
                name: this.$t('apps.categories.social'),
                slug: 'social',
                icon: IconAppsSocial,
            }, {
                name: this.$t('apps.categories.tools'),
                slug: 'tools',
                icon: IconAppsTools,
            }, {
                name: this.$t('apps.categories.other'),
                slug: 'other',
                icon: IconAppsOther,
            }];
        },

        currentCategory() {
            return this.$route.params.category;
        },
    },

    watch: {
        $route() {
            this.searchValue = '';
        },
    },

    beforeMount() {
        this.currentFilter = this.appsFilters[0].value;
    },

    beforeDestroy() {
        clearSearchCache();
    },

    methods: {
        updateFilter(filter) {
            this.currentFilter = filter;
        },

        clearSearchValue() {
            this.searchValue = '';
        },

        getCategoryBySlug(slug, nav = false) {
            const matched = this.categories.find(category => category.slug === slug);

            if (matched) {
                return nav
                    ? matched.slug
                    : matched.name;
            }

            console.error(`category ${slug} not found`);
            return undefined;
        },

        getToByCategory(category, isSlug = false) {
            if (isSlug) {
                category = this.categories.find(item => item.slug === category)?.slug; // eslint-disable-line no-param-reassign
            }

            return !category
                ? { name: 'apps' }
                : { name: 'apps-category', params: { category } };
        },
    },

    components: {
        ListWrapper,
        Navigation,
        NavigationMobile,
        SearchField,
        Banner,
        NotFound,
    },

};
</script>

<style lang="scss">
.page-apps {
    margin-top: 6px;

    &__content {
        padding-left: 20px;
    }

    &__search-filter-wrapper {
        display: flex;
        gap: 15px;
    }

    &__search {
        margin-bottom: 20px;
    }
}

@media screen and (max-width: 1240px) {
    .page-apps {
        &__content {
            padding: 0 8px;
            border-radius: 0;
        }
    }
}

@media screen and (max-width: 480px) {
    .page-apps {
        &__content {
            padding: 0;
            margin: 0 -7px;
        }
    }
}
</style>
