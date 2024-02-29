<template>
    <div class="apps-list">
        <t-row v-bind:gap="cardsGap">
            <t-col
                v-for="app in apps"
                v-bind:key="app.id"
                v-bind:cols="6"
                v-bind:tablet="tabletCols"
                v-bind:mobile="12">
                <ui-link
                    class="router-link__no-style apps-list__card-link"
                    v-bind:to="{
                        name: 'app',
                        params: {
                            category: getCategoryBySlug(app.categorySlug, true),
                            app: app.slug,
                        },
                    }">
                    <app-card
                        class="apps-list__card"
                        v-bind:title="app.title"
                        v-bind:descriptions="app.descriptions"
                        v-bind:icon="app.icon"
                        v-bind:is-ads="app.isAds"
                        v-bind:is-trending="app.isTrending"
                        v-bind:is-new="app.isNew"
                        v-bind:is-verified="app.isVerified"/>
                </ui-link>
            </t-col>
        </t-row>
    </div>
</template>

<script>
import AppCard from '~/components/apps/List/AppCard.vue';

export default {
    name: 'AppsList',

    props: {
        apps: {
            type: Array,
        },
    },

    inject: ['getCategoryBySlug'],

    computed: {
        cardsGap() {
            return this.isTablet ? 16 : 20;
        },

        tabletCols() {
            return 6;
        },
    },

    components: {
        AppCard,
    },
};
</script>

<style lang="scss">
.apps-list {
    &__card {
        margin-bottom: 20px;
        color: inherit;
    }

    &__filter-selector {
        display: flex;
        align-items: center;
    }

    &__not-found {
        height: 50vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

@media screen and (max-width: 480px) {
    .t-col:first-child .apps-list__card-link .apps-list__card {
        border-top: 1px solid var(--card-border-color);
    }

    .t-col .apps-list__card-link .apps-list__card {
        border-top: none;
    }

    .apps-list {
        margin-top: 12px;
    }

    .apps-list__card {
        margin: 0 -16px;
        border-radius: 0;
        border-top: none;
        border-right: none;
        border-left: none;
    }
}
</style>
