<template>
    <router-link class="ui-inline-nft" v-bind:to="routerParams" >
        <img class="ui-inline-nft__image" loading="lazy" v-bind:src="imageSrc">
        <div class="ui-inline-nft__title" v-text="$t('common.nft_item')"/>
    </router-link>
</template>

<script>
import { getNftItemPreviewUrl } from '~/api/extenderContracts.js';

export default {
    props: {
        address: String,
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
};
</script>

<style lang="scss">
.ui-inline-nft {
    display: flex;
    align-items: center;
    background: var(--body-light-muted-color);
    border-radius: 4px;
    margin: -4px 0;
    color: inherit;
    &__image {
        width: 26px;
        height: 26px;
        border-radius: 4px 0 0 4px;
        object-fit: cover;
        background: var(--card-border-color);
    }
    &__title {
        padding: 5px 10px;
        font-size: 13px;
    }
}
</style>
