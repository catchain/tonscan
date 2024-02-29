<template>
    <section class="apps-list">
        <app-list v-bind:apps="apps"/>

        <app-list-skeleton
            v-show="loadingMoreApps"
            v-bind:count="appsPerPage"/>

        <!-- Add infinite scroller after all apps are rendered, so that it rechecks viewport height right away: -->
        <template v-if="apps.length > 0">
            <ui-mugen-scroll
                v-bind:handler="loadMoreApps"
                v-bind:shouldHandle="!loadingMoreApps && !reachedEnd"
                v-bind:showButton="!reachedEnd"
            />
        </template>

        <search-not-found class="app-list__not-found"
            v-if="!loadingMoreApps && apps.length === 0"/>
    </section>
</template>

<script>
import { searchApps } from '~/components/apps/index.js';
import SearchNotFound from '~/components/apps/Navigation/SearchNotFound.vue';
import AppListSkeleton from '~/components/apps/List/ListSkeleton.vue';
import AppList from '~/components/apps/List/AppList.vue';

export default {
    name: 'ListWrapper',

    inject: [
        'getCurrentCategory',
        'getCurrentFilter',
        'setCurrentFilter',
        'getCategories',
    ],

    props: {
        searchValue: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            appsPerPage: 30,
            loadingMoreApps: true,
            page: 1,
            apps: [],
            found: 0,
        };
    },

    computed: {
        categories() {
            return this.getCategories();
        },

        currentFilter() {
            return this.getCurrentFilter();
        },

        currentCategory() {
            return this.getCurrentCategory();
        },

        reachedEnd() {
            return this.found === this.apps.length;
        },
    },

    watch: {
        async searchValue() {
            await this.resetApps();
        },

        async currentCategory() {
            await this.resetApps();
        },

        async currentFilter(filter) {
            await this.updateFilter(filter);
        },
    },

    async beforeMount() {
        await this.resetApps();
    },

    methods: {
        async updateFilter(filter) {
            this.setCurrentFilter(filter);
            await this.resetApps();
        },

        async getAppsWithCategoryAndFilter() {
            // Default request params
            const paramsObj = {
                per_page: this.appsPerPage,
                query_by: 'name,tags,category_slug',
                page: this.page,
                filter: 'weight:>0',
                q: '*',
            };

            const sortBy = this.getCurrentFilter();

            if (sortBy === 'popular') {
                paramsObj.sort_by = 'weight:DESC';
            } else if (sortBy === 'newest') {
                paramsObj.sort_by = 'created_at:DESC';
            }

            // If search value not empty - search in all categories:
            if (this.searchValue) {
                return this.getApps({ ...paramsObj,
                    q: this.searchValue,
                });
            }

            // If category is selected - get apps by category:
            if (this.currentCategory) {
                const categorySlug = this.currentCategory;

                return this.getApps({ ...paramsObj,
                    filter_by: `category_slug:${categorySlug} && weight:>0`,
                    query_by: 'category_slug',
                });
            }

            // If category not selected - get all apps
            return this.getApps(paramsObj);
        },

        async resetApps() {
            this.apps = [];
            this.page = 1;
            this.loadingMoreApps = true;

            this.apps = await this.getAppsWithCategoryAndFilter();
            this.page += 1;
            this.loadingMoreApps = false;
        },

        async loadMoreApps() {
            this.loadingMoreApps = true;

            await this.getAppsWithCategoryAndFilter().then((apps) => {
                this.apps = this.apps.concat(apps);
                this.page += 1;
            });

            this.$nextTick(() => {
                this.loadingMoreApps = false;
            });
        },

        async getApps(params) {
            const { found, hits } = await searchApps(params);
            this.found = found;
            return hits;
        },
    },

    components: {
        SearchNotFound,
        AppListSkeleton,
        AppList,
    },
};
</script>
