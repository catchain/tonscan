<template>
    <div class="page-app">
        <t-breadcrumbs v-bind:items="breadcrumbs"/>

        <template v-if="!is404">
            <app v-bind:loading="loading" v-bind="appData"/>

            <div class="page-app-block-similar">
                <div class="page-app-block-similar__title">
                    {{$t('apps.app.similar_products')}}
                </div>

                <similar-apps
                    v-bind:categorySlug="appData?.categorySlug"
                    v-bind:appSlug="appData?.slug"/>
            </div>
        </template>

        <app-error v-else/>
    </div>
</template>

<script>
import App from '~/components/apps/App/App.vue';
import { findApp } from '~/components/apps/index.js';
import AppError from '~/components/apps/Errors/appError.vue';
import SimilarApps from './AppSimilarApps.vue';

export default {
    name: 'AppsAppWrapper',

    props: {
        app: {
            type: String,
            required: true,
        },
    },

    inject: ['getCategories', 'getCurrentCategory'],

    data() {
        return {
            appData: undefined,
            is404: false,
            loading: true,
        };
    },

    computed: {
        breadcrumbs() {
            const currentCategory = this.getCategories().find(({ slug }) => { // eslint-disable-line arrow-body-style
                return slug === this.getCurrentCategory();
            });

            const crumbs = [{
                name: this.$t('apps.title'),
                to: { name: 'apps' },
            }, {
                name: currentCategory.name,
                to: {
                    name: 'apps-category',
                    params: {
                        category: currentCategory.slug,
                    },
                },
            }, {
                name: undefined,
            }];

            if (this.loading || this.appData?.title) {
                crumbs.at(-1).name = this.appData?.title;
            }

            if (this.is404) {
                crumbs.at(-1).name = '404';
            }

            return crumbs;
        },
    },

    created() {
        this.getApp();
    },

    watch: {
        $route() {
            this.getApp();
        },
    },

    methods: {
        async getApp() {
            this.loading = true;

            const app = await findApp(this.app);

            this.is404 = !app;

            this.appData = app;
            this.loading = false;
        },
    },

    components: {
        App,
        AppError,
        SimilarApps,
    },
};
</script>

<style lang="scss">
.page-app {
    padding-top: 16px;
}

.page-app-block-similar {
    margin-top: 40px;

    &__title {
        text-transform: uppercase;
        font-size: 16px;
        color: #858585;
        font-weight: 500;
        margin-bottom: 20px;
    }
}
</style>
