<template>
    <ui-link class="nft-preview" v-bind:to="route">
        <div v-if="invalid" class="nft-preview-error" v-on:click.prevent.stop="$emit('reload', index)">
            <div class="nft-preview-error__image nft-preview__image">
                <div class="nft-preview-error__info">
                    <icon-broken-image class="nft-preview-error__icon"/>
                    <div class="nft-preview-error__text" v-text="$t('nft.item.preview.error_text')"/>
                </div>
            </div>

            <footer class="nft-preview-footer">
                <template v-if="isReloading">{{$t('common.loading')}}</template>
                <div v-else class="nft-preview-error__button">
                    <icon-refresh/> {{$t('nft.item.preview.error_button')}}
                </div>
            </footer>
        </div>

        <template v-else>
            <img v-if="images.original" class="nft-preview__image"
                v-bind:src="images.w320"
                v-bind:srcset="`${images.w320} 320w, ${images.w640} 640w, ${images.w960} 960w`"
                v-bind:style="{ backgroundImage: `url(${images.i})` }"
                sizes="(max-width: 480px) 220px, 280px">

            <div v-else class="nft-preview__image skeleton"/>

            <footer class="nft-preview-footer">
                <div class="nft-preview__title" v-if="name" v-text="name"/>
                <div class="nft-preview__meta" v-text="$t('nft.item.preview.index', {
                    index: index + 1,
                    total: itemCount,
                })"/>
            </footer>
        </template>
    </ui-link>
</template>

<script>
import IconBrokenImage from '@img/icons/material-duotone/broken-image.svg?inline';
import IconRefresh from '@primer/octicons/build/svg/sync-16.svg?inline';

export default {
    props: {
        address: String,
        index: Number,
        itemCount: Number,
        isReloading: Boolean,
        invalid: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            default: '¯\\_(ツ)_/¯',
        },
        images: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        route() {
            return {
                name: 'nft',
                params: {
                    address: this.address,
                    skeletonHint: 'item',
                },
            };
        },
    },

    components: {
        IconBrokenImage, IconRefresh,
    },
};
</script>

<style lang="scss">
.nft-preview-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}
.nft-preview-error {
    border-radius: 0.52rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    box-shadow: 0 0 0 1px var(--card-border-color) inset;
    background: var(--nft-preview-error-card-background);
    &__info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding-top: 12px;
        height: 100%;
    }
    &__image {
        background-color: transparent !important;
    }
    &__icon {
        width: 32px;
        margin-bottom: 16px;
        fill: currentColor;
        opacity: .8;
    }
    &__text {
        font-size: 15px;
        margin: 0 8px;
        font-weight: 500;
    }
    &__button {
        padding: 10px 12px 10px 18px;
        border-radius: 24px;
        margin-top: -1px; // optically compensate top border
        cursor: pointer;
        display: inline-flex;
        transition: .1.8s all ease;
        &:hover {
            background: rgba(0, 0, 0, 0.4);
        }
        svg {
            margin-left: -6px;
            margin-right: 6px;
            fill: currentColor;
        }
    }
}
</style>
