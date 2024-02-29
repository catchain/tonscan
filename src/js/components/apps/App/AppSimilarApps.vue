<template>
    <t-row v-bind:gap="20">
        <t-col
            v-for="(app, index) in apps"
            v-bind:key="index"
            v-bind:cols="6"
            v-bind:tablet="6"
            v-bind:mobile="12">

            <app-card is-loading class="page-app-similar-app"
                v-if="app === undefined"/>

            <ui-link v-else
                class="router-link__no-style"
                v-bind:to="{
                    name: 'app',
                    params: { app: app.slug },
                }">
                <app-card
                    class="page-app-similar-app"
                    v-bind:title="app.title"
                    v-bind:descriptions="app.descriptions"
                    v-bind:icon="app.icon"
                    v-bind:isAds="app.isAds"
                    v-bind:isTrending="app.isTrending"
                    v-bind:isNew="app.isNew"
                    v-bind:isVerified="app.isVerified"/>
            </ui-link>
        </t-col>
    </t-row>
</template>

<script>
import { searchApps } from '~/components/apps/index.js';
import AppCard from '~/components/apps/List/AppCard.vue';

const makeSkeleton = count => Array(count).fill(undefined);

export default {
    props: {
        categorySlug: String,
        appSlug: String,
        count: {
            type: Number,
            default: 2,
        },
    },

    data() {
        return {
            apps: makeSkeleton(this.count),
            loading: true,
        };
    },

    created() {
        if (this.categorySlug && this.appSlug) {
            this.getSimilarApps();
        }
    },

    watch: {
        categorySlug(newValue) {
            if (newValue) {
                this.getSimilarApps();
            }
        },

        appSlug(newValue) {
            if (newValue) {
                this.getSimilarApps();
            }
        },
    },

    methods: {
        async getSimilarApps() {
            this.apps = makeSkeleton(this.count);

            const { hits: similarApps } = await searchApps({
                q: '*',
                per_page: 10,
                query_by: 'category_slug',
                sort_by: 'weight:DESC',
                filter_by: [
                    `category_slug:${this.categorySlug}`,
                    `slug:!=${this.appSlug}`,
                    'weight:>0',
                ].join('&&'),
            });

            const apps = [
                similarApps.shift(),
            ];

            for (let i = apps.length; i < this.count; i += 1) {
                const [randomApp] = similarApps.splice((similarApps.length * Math.random()) | 0); // eslint-disable-line no-bitwise
                apps.push(randomApp);
            }

            this.apps = apps;
        },
    },

    components: {
        AppCard,
    },
};
</script>

<style lang="scss">
@media screen and (max-width: 480px) {
    .page-app-similar-app {
        margin: 0 -16px;
        border-radius: 0 !important;
        border: 0px solid var(--card-border-color);
        border-width: 1px 0;
        margin-bottom: -1px; // collapses border between items
    }
}
</style>
