<template>
    <section>
        <template v-if="items.length === 0">
            <div v-if="isLoading" class="user-nfts">
                <template v-for="_ in 12">
                    <div v-pre class="user-nft user-nft--skeleton">
                        <div class="user-nft__image">
                            <div class="user-nft__image__img"></div>
                        </div>
                        <footer class="user-nft__footer">
                            <h4 class="user-nft__collection">
                                <span class="user-nft__collection__text skeleton">NFT collection name</span>
                            </h4>
                            <h3 class="user-nft__name">
                                <span class="skeleton">NFT name</span>
                            </h3>
                        </footer>
                    </div>
                </template>
            </div>

            <div v-else class="user-nfts-empty-panel" v-text="$t('address.nfts.no_nfts')"/>
        </template>

        <section v-else class="user-nfts">
            <ui-link class="user-nft"
                v-for="item, idx in items"
                v-bind:key="item.id"
                v-bind:to="{
                    name: item.kind === 'DnsItem' ? 'address' : 'nft',
                    params: {
                        address: item.address,
                        skeletonHint: 'item',
                    },
                }">

                <div v-once class="user-nft__image">
                    <template v-if="item.image">
                        <img class="user-nft__image__img" decoding="async"
                            v-if="item.image.type === 'NftContentImage' && item.image.thumb && item.image.thumb.sized"
                            v-bind:src="item.image.thumb.sized"
                            v-bind:loading="idx > 4 ? 'lazy' : 'eager'"
                            v-bind:alt="item.name">

                        <img class="user-nft__image__img" decoding="async"
                            v-else-if="item.image.type === 'NftContentLottie' && item.image.preview && item.image.preview.sized"
                            v-bind:src="item.image.preview.sized"
                            v-bind:loading="idx > 4 ? 'lazy' : 'eager'"
                            v-bind:alt="item.name">

                        <img class="user-nft__image__img" decoding="async"
                            v-else-if="item.image.type === 'NftContentVideo' && item.image.cover"
                            v-bind:src="item.image.cover"
                            v-bind:loading="idx > 4 ? 'lazy' : 'eager'"
                            v-bind:alt="item.name">
                    </template>
                </div>

                <footer v-once class="user-nft__footer">
                    <ui-link class="user-nft__collection"
                        v-if="item.collection"
                        v-bind:to="{
                            name: 'nft',
                            params: {
                                address: item.collection.address,
                                skeletonHint: 'collection',
                            },
                        }">
                        <span class="user-nft__collection__text" v-text="item.collection.name"/>
                        <icon-verified class="user-nft__collection__icon" v-if="item.collection.isVerified" viewBox="0 0 16 16"/>
                    </ui-link>

                    <span v-else class="user-nft__collection" v-text="$t('address.nfts.no_collection')"/>

                    <h3 class="user-nft__name" v-text="item.name"/>
                </footer>
            </ui-link>
        </section>

        <mugen-scroll class="mugen-scroll" v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll" style="margin-bottom: 6px;">
            <div ref="infiniteLoader" class="mugen-scroll__button" v-show="showPreloader" v-on:click="loadMore">
                <template v-if="isLoading">{{$t('common.loading')}}</template>
                <template v-else>{{$t('common.load_more')}}</template>
            </div>
        </mugen-scroll>
    </section>
</template>

<script>
import IconVerified from '@primer/octicons/build/svg/verified-16.svg?inline';
import { nftItemsByOwner } from '~/api/getgems.js';
import MugenScroll from 'vue-mugen-scroll';

export default {
    props: {
        address: String,
    },

    data() {
        return {
            items: [],
            isLoading: true,
            cursor: undefined,
        };
    },

    computed: {
        shouldHandleScroll() {
            return !this.isLoading
                && this.address
                && this.hasMore
                && this.items.length > 0;
        },

        showPreloader() {
            return this.address
                && this.items.length > 0
                && this.hasMore;
        },

        hasMore() {
            return this.cursor !== null;
        },
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            this.isLoading = true;

            nftItemsByOwner(this.address, 24, this.cursor).then(({ cursor, items }) => {
                this.items =  this.items.concat(items.map(Object.freeze));
                this.cursor = cursor;
            }).finally(() => {
                this.isLoading = false;
            });
        },

        loadMore() {
            return this.cursor && this.loadData();
        },
    },

    components: {
        IconVerified, MugenScroll,
    },
};
</script>

<style lang="scss">
.user-nfts {
    padding: 24px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 24px;
    grid-row-gap: 24px;
    @media all and (max-width: 1200px) {
        & {
            padding: 18px;
            grid-column-gap: 18px;
            grid-row-gap: 18px;
        }
    }
    @media all and (max-width: 900px) {
        & { grid-template-columns: 1fr 1fr 1fr; }
    }
    @media all and (max-width: 600px) {
        & { grid-template-columns: 1fr 1fr; }
    }
    @media all and (max-width: 480px) {
        & {
            padding: 14px;
            grid-column-gap: 14px;
            grid-row-gap: 14px;
        }
    }
}
.user-nfts-empty-panel {
    padding: 30px 24px 24px;
    font-weight: 500;
    text-align: center;
}
.user-nft {
    position: relative;
    color: inherit;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    background: var(--user-nft-list-item-background);
    box-shadow: 1px 1px var(--user-nft-list-item-box-shadow-blur) rgba(0, 0, 0, 0.19);
    border-radius: 8px;
    overflow: hidden;
    transition: .2s background ease;
    &:hover {
        text-decoration: none;
    }
    @media (hover: hover) {
        &:hover {
            background: var(--user-nft-list-item-hover-background);
            .user-nft__image__img {
                transform: scale(1.08);
            }
        }
    }
    &--skeleton {
        pointer-events: none;
        user-select: none;
    }
    &__image {
        font-size: 0;
        width: 100%;
        overflow: hidden;
        display: block;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        aspect-ratio: 1 / 1;
        &__img {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: none;
            transition: .2s transform ease;
        }
    }
    &__footer {
        padding: 12px 12px 10px;
    }
    &__name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        font-weight: 500;
        font-size: 16px;
    }
    &__collection {
        padding: 4px 4px 8px 4px;
        margin: -4px;
        font-weight: normal;
        font-size: 13px;
        color: var(--user-nft-list-item-text-muted-color);
        display: flex;
        align-items: center;
        white-space: nowrap;
        &__text {
            overflow: hidden;
            text-overflow: ellipsis;
        }
        &__icon {
            flex-shrink: 0;
            width: 1em;
            height: 1em;
            margin-left: 0.3em;
            fill: var(--blue-bright);
        }
    }
}
@media all and (max-width: 480px) {
    .user-nft {
        &__footer {
            padding: 10px;
        }
        &__name {
            font-size: 14px;
        }
        &__collection {
            font-size: 11px;
        }
    }
}
</style>
