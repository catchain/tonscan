<template>
    <div class="page-apps-search-suggestion">
        <div class="page-apps-search-suggestion__icon">
            <img alt="App icon"
                v-show="!loading && !imageError"
                v-on:load="loading = false"
                v-bind:src="iconURL"
                v-on:error="imageError = true">

            <icon-broken-image v-if="imageError" class="broken-icon"/>

            <t-skeleton-loader v-if="imageError && !loading"
                type="rectangle"
                width="inherit"
                height="inherit"
                border-radius="inherit"/>
        </div>

        <main>
            <div class="page-apps-search-suggestion__name" v-text="title"/>
            <div class="page-apps-search-suggestion__short-description" v-text="shortDescription"/>
        </main>
    </div>
</template>

<script>
import IconBrokenImage from '@img/icons/tonscan/image-broken.svg?vue';
import { makeImageUrl } from '~/components/apps/index.js';

export default {
    name: 'SearchFieldSuggestion',

    props: {
        icon: String,
        title: String,
        descriptions: Map,
    },

    data() {
        return {
            loading: false,
            imageError: false,
        };
    },

    computed: {
        iconURL() {
            return makeImageUrl(this.icon);
        },

        shortDescription() {
            return this.descriptions.get(this.$store.state.appLocale);
        },
    },

    components: {
        IconBrokenImage,
    },
};
</script>

<style lang="scss">
.page-apps-search-suggestion {
    display: flex;
    transition: 0.1s ease-in-out;
    gap: 16px;
    cursor: pointer;
    padding: 12px 16px;
    line-height: 1.4;
    color: inherit;
    background: transparent;
    border-radius: 8px;
    margin: 4px;

    &:hover {
        background: var(--body-light-muted-color);
    }

    &__icon {
        border-radius: 16px;
        width: 38px;
        font-size: 0;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--app-icon-background);

        & img {
            width: 42px;
            height: 42px;
            border-radius: 8px;
        }

        & svg {
            color: #959a9e;
            position: absolute;
            width: 25px;
            height: 25px;
        }
    }

    &__name {
        font-weight: 500;
        font-size: 15px;
    }

    &__info {
        //
    }

    &__short-description {
        font-weight: 400;
        font-size: 13px;
        color: var(--app-card-description);

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
