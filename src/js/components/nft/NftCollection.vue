<template>
    <section>
        <div class="card nft-collection-card">
            <div class="nft-collection-cover-container">
                <img v-if="image.original" class="nft-collection-cover"
                    v-bind:src="image.w320"
                    v-bind:style="{ backgroundImage: `url(${image.i})` }"
                    v-bind:srcset="`${image.w120} 120w, ${image.w320} 320w, ${image.w640} 640w, ${image.w960} 960w`"
                    sizes="(max-width: 600px) 240px, 120px">

                <div v-else class="nft-collection-cover skeleton"/>
            </div>

            <div class="nft-collection-info">
                <h2 class="nft-collection-title">
                    <span v-if="name === undefined" class="skeleton skeleton--inline">Some cool NFTs 2599</span>
                    <template v-else-if="!name">No name</template>
                    <template v-else>{{name}}</template>
                </h2>

                <div class="nft-collection-description">
                    <!-- External JSON is loaded, description is not set: -->
                    <span class="muted"
                        v-if="description === null || description === ''"
                        v-text="$t('common.no_description')"/>

                    <!-- Data is loading: -->
                    <span v-else-if="!description" class="skeleton skeleton--inline">Some cool NFTs pretty long description text</span>

                    <!-- Everything is loaded, description is set: -->
                    <template v-else>{{description}}</template>
                </div>

                <div class="nft-collection-meta">
                    <span v-if="itemCount === undefined" class="skeleton">100 items</span>

                    <div v-else class="nft-link">
                        <icon-items/> {{$tc('nft.collection.item_count', Math.max(0, itemCount))}}
                    </div>

                    <span class="nft-link" v-if="ownerAddress">
                        <icon-owner/> <ui-address v-bind:address="ownerAddress"/>
                    </span>

                    <span v-if="royalty" class="nft-link">
                        <icon-royalty/> {{royalty}}%
                    </span>

                    <a class="nft-link" v-if="externalLink" v-bind:href="externalLink">
                        <icon-link/> {{externalLink}}
                    </a>
                </div>
            </div>
        </div>

        <template v-if="items.length === 0">
            <div v-if="isLoading" class="nft-items-container">
                <div class="nft-preview nft-preview--loading" v-for="item in skeletonCount" v-bind:key="`skeleton_${item}`">
                    <div class="nft-preview__image skeleton"></div>
                    <div class="nft-preview__title">
                        <span class="skeleton">Some title</span>
                    </div>
                    <div class="nft-preview__meta">
                        <span class="skeleton skeleton--inline">Item 69 of 228</span>
                    </div>
                </div>
            </div>

            <div v-else class="nft-collection-error-message">
                <template v-if="itemCount === -1">
                    <h2 class="nft-collection-error-message__title" v-text="$t('nft.collection.nonseq_collection_header')"/>
                    <div class="nft-collection-error-message__message">
                        <i18n path="nft.collection.nonseq_collection_text">
                            <ui-link v-text="$t('nft.collection.nonseq_collection_text_account_link')" v-bind:to="{
                                name: 'address',
                                params: { address },
                            }"/>
                        </i18n>
                    </div>
                </template>

                <template v-else>
                    <h2 class="nft-collection-error-message__title" v-text="$t('nft.collection.empty_collection_header')"/>
                    <div class="nft-collection-error-message__message">
                        <i18n path="nft.collection.empty_collection_text">
                            <ui-link v-text="$t('nft.collection.empty_collection_text_account_link')" v-bind:to="{
                                name: 'address',
                                params: { address },
                            }"/>
                        </i18n>
                    </div>
                </template>
            </div>
        </template>

        <div v-else class="nft-items-container">
            <nft-item-preview-card v-for="item in items"
                v-bind:key="item.item_address"
                v-bind:address="item.item_address"
                v-bind:index="item.index"
                v-bind:invalid="item.incomplete"
                v-bind:itemCount="itemCount"
                v-bind:name="item.metadata && item.metadata.name ? item.metadata.name : undefined"
                v-bind:images="item.metadata && item.metadata.image ? item.metadata.image : {}"
                v-bind:isReloading="item.isReloading"
                v-on:reload="handleReload"/>
        </div>

        <footer class="nft-items-container__loader">
            <mugen-scroll class="mugen-scroll" v-bind:should-handle="shouldHandleScroll" v-bind:handler="loadMore">
                <div class="mugen-scroll__button" v-show="showPreloader" v-on:click="loadMore">
                    <template v-if="isLoading">{{$t('common.loading')}}</template>
                    <template v-else>{{$t('common.load_more')}}</template>
                </div>
            </mugen-scroll>
        </footer>
    </section>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll';
import IconItems from '@primer/octicons/build/svg/versions-16.svg?inline';
import IconOwner from '@primer/octicons/build/svg/person-16.svg?inline';
import IconLink from '@primer/octicons/build/svg/link-16.svg?inline';
import IconRoyalty from '@primer/octicons/build/svg/ruby-16.svg?inline';
import { getNftCollectionItems, getNftItemByCollectionIndex } from '~/api';
import NftItemPreviewCard from './NftItemPreviewCard.vue';

const PER_PAGE = 12;

export default {
    props: {
        address: String,
        itemCount: Number,
        ownerAddress: String,
        name: String,
        description: String,
        image: {
            type: Object,
            default: () => ({}),
        },
        externalLink: String,
        royalty: Number,
    },

    data() {
        return {
            items: [],
            isLoading: true,
        };
    },

    computed: {
        skeletonCount() {
            return Math.max(Math.min(this.itemCount || PER_PAGE, PER_PAGE), 0);
        },

        hasMoreItems() {
            return this.items.length < this.itemCount;
        },

        showPreloader() {
            return this.items.length > 0 && this.hasMoreItems;
        },

        shouldHandleScroll() {
            return !this.isLoading
                && this.hasMoreItems
                && this.items.length > 0;
        },
    },

    watch: {
        itemCount: {
            immediate: true,
            handler(count) {
                // shows item skeletons until we load the collection info and have item count:
                return Number.isInteger(count) && this.loadItems();
            },
        },
    },

    methods: {
        async loadItems(limit, offset) {
            limit = limit || Math.min(this.itemCount, PER_PAGE);
            offset = offset || 0;

            // Some collections have -1 as item count (like DNS collection):
            if (limit > 0) {
                this.isLoading = true;
                const response = await getNftCollectionItems(this.address, { limit, offset });

                this.items = this.items.concat(response.items.map(item => ({ ...item, isReloading: false })));
            }

            this.isLoading = false;
        },

        loadMore() {
            const total = this.itemCount;
            const offset = this.items.length;

            let limit = PER_PAGE;

            if ((limit + offset) > total) {
                limit = total - offset;
            }

            this.loadItems(limit, offset);
        },

        handleReload(index) {
            const idx = this.items.findIndex(item => item.index === index);

            this.items[idx].isReloading = true;

            getNftItemByCollectionIndex(this.address, index + 1).then((item) => {
                this.items.splice(idx, 1, item);
            });
        },
    },

    components: {
        MugenScroll, NftItemPreviewCard, IconItems, IconOwner, IconLink, IconRoyalty,
    },
};
</script>

<style lang="scss">
.nft-collection-error-message {
    display: block;
    text-align: center;
    padding: 16px;
    max-width: 480px;
    margin: 100px auto;
    &__title {
        font-size: 36px;
        font-weight: 500;
        line-height: 40px;
        letter-spacing: -1px;
        margin: 0;
        padding: 0;
    }
    &__message {
        color: #909097;
        margin-top: 10px;
        font-size: 16px;
        line-height: 1.5;
    }
}
</style>
