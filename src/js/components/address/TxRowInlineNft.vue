<template>
    <ui-link class="ui-inline-nft" v-bind:to="routerParams" >
        <div class="ui-inline-nft__left">
            <div class="ui-inline-nft-image">
                <img class="ui-inline-nft-image__img" v-bind:src="imageSrc" v-show="!hasError" v-on:error="hasError = true" alt="">
                <icon-nft class="ui-inline-nft-image__svg"/>
            </div>
        </div>
        <div class="ui-inline-nft__title" v-text="$t('common.nft_item')"/>
    </ui-link>
</template>

<script>
import { getNftItemPreviewUrl } from '~/api/extenderContracts.js';
import IconNft from '@img/icons/tonscan/nft-14.svg?inline';

export default {
    props: {
        address: String,
    },

    data() {
        return {
            hasError: false,
        };
    },

    computed: {
        routerParams() {
            return {
                name: 'nft',
                params: {
                    address: this.address,
                    skeletonHint: 'item',
                },
            };
        },

        imageSrc() {
            return getNftItemPreviewUrl(this.address);
        },
    },

    components: {
        IconNft,
    },
};
</script>

<style lang="scss">
.ui-inline-nft {
    display: flex;
    align-items: center;
    background: var(--nft-preview-background);
    border-radius: 4px;
    margin: -4px 0;
    color: inherit;
    transition: .2s;

    &__left {
        width: 26px;
        height: 26px;
        border-radius: 3px 0 0 3px;
        overflow: hidden;
    }

    &__title {
        padding: 5px 10px;
        font-size: 13px;
    }
}

.ui-inline-nft:hover {
    background: var(--nft-preview-hover-background);
    color: var(--nft-preview-hover-color);
    text-decoration: none;
    
}

.ui-inline-nft-image {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-border-color);
    color: var(--body-text-color);

    &__img {
        object-fit: cover;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

    &__svg {
        width: 14px;
        height: 14px;
        opacity: 0.8;
        z-index: 100;
    }
}
</style>
