<template>
    <section class="app">
        <app-header
            v-bind:loading="loading"
            v-bind:is-verified="isVerified"
            v-bind:short-description="shortDescription"
            v-bind:link="linkFull"
            v-bind:icon="icon"
            v-bind:title="title"/>

        <template v-if="isMobile">
            <div class="app__open-btn--wide">
                <t-skeleton-loader v-if="loading" type="button" height="40px" width="100%"/>

                <a v-else v-bind:href="linkFull" target="_blank" style="text-decoration: none">
                    <t-btn block color="blue" v-bind:to="link">
                        {{$t('apps.app.open_app')}}
                    </t-btn>
                </a>
            </div>
        </template>

        <t-delimiter class="app__delimiter" v-if="loading || !!description"/>

        <app-description
            v-bind:description="description"
            v-bind:loading="loading"/>

        <!-- Show only during load and if there are screenshots: -->
        <t-delimiter class="app__delimiter" v-if="loading || (screenshots || []).length > 0"/>

        <!-- Using key so that the old screenhots don't remain on screen until the new ones
             load after navigating to another app: -->
        <app-screenshots
            v-bind:screenshots="screenshots"
            v-bind:key="`app_screenshots_${id}`"/>

        <t-delimiter class="app__delimiter"/>

        <app-info
            v-bind:loading="loading"
            v-bind:link="linkFull"
            v-bind:categorySlug="categorySlug"
            v-bind:address="tonAddress"/>
    </section>
</template>

<script>
import AppDescription from '~/components/apps/App/AppDescription.vue';
import AppHeader from '~/components/apps/App/AppHeader.vue';
import AppScreenshots from '~/components/apps/App/AppScreenshots.vue';
import AppInfo from '~/components/apps/App/AppInfo.vue';

export default {
    name: 'App',

    inject: [
        'getCategories',
    ],

    metaInfo() {
        return {
            title: `TON Explorer :: ${this.title || this.$t('apps.title')}`,
        };
    },

    props: {
        id: String,
        loading: Boolean,
        title: String,
        icon: String,
        fullDescriptions: Map,
        descriptions: Map,
        screenshots: Array,
        categorySlug: String,
        link: String,
        linkFull: String,
        tonAddress: String,
        isVerified: Boolean,
    },

    computed: {
        categories() {
            return this.getCategories();
        },

        description() {
            return this.fullDescriptions?.get(this.$i18n.locale);
        },

        shortDescription() {
            return this.descriptions?.get(this.$i18n.locale);
        },
    },

    components: {
        AppInfo,
        AppScreenshots,
        AppHeader,
        AppDescription,
    },
};
</script>

<style lang="scss" scoped>

$app-page-padding-x: 25px;
$app-page-padding-y: 25px;

.app {
    padding:
        $app-page-padding-y
        $app-page-padding-x
        0
        $app-page-padding-x;
    background: var(--card-background);
    border: 1px solid var(--card-border-color);
    border-radius: 13px;
    margin-top: 16px;
    position: relative;
    overflow-y: hidden;
    overflow-x: auto;

    &__delimiter {
        margin: 32px (-$app-page-padding-x) 0 (-$app-page-padding-x);
    }

    &__info {
        margin: 32px 0;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        padding-right: 40px;
        gap: 50px;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__open-btn--wide {
        margin-top: 24px;
        margin-bottom: 20px;

        & button {
            text-transform: uppercase;
        }
    }
}

@media screen and (max-width: 480px) {
    $app-page-mobile-padding-x: 16px;
    $app-page-mobile-padding-y: 24px;

    .app {
        padding:
            $app-page-mobile-padding-y
            $app-page-mobile-padding-x
            0
            $app-page-mobile-padding-x;
        border: none;
        border-radius: 0;
        margin-left: -$app-page-mobile-padding-x;
        margin-top: 12px;
        width: 100%;
        border-top: 1px solid var(--card-border-color);
        border-bottom: 1px solid var(--card-border-color);

        &__delimiter {
            margin: $app-page-mobile-padding-y -16px $app-page-mobile-padding-y -16px;
        }

        &__screenshots {
            padding-right: 16px;
        }
    }
}
</style>
