<template>
    <section>
        <div class="card nft-collection-card">
            <div class="nft-collection-cover-container">
                <img v-if="image" class="nft-collection-cover"
                    v-bind:src="image.w320"
                    v-bind:style="{ backgroundImage: `url(${image.i})` }"
                    v-bind:srcset="`${image.w120} 120w, ${image.w320} 320w, ${image.w640} 640w, ${image.w960} 960w`"
                    sizes="(max-width: 600px) 240px, 120px">

                <div v-else class="nft-collection-cover skeleton"/>
            </div>

            <div class="nft-collection-info">
                <h2 class="nft-collection-title">
                    <span v-if="!name" class="skeleton skeleton--inline">Some cool NFTs #2599</span>
                    <span v-else v-text="name"/>
                </h2>

                <div class="nft-collection-description">
                    <span v-if="!description" class="skeleton skeleton--inline">Some cool NFTs pretty long description text</span>
                    <span v-else v-text="description"/>
                </div>

                <div class="nft-collection-meta">
                    <div class="nft-link" v-if="itemCount">
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path fill-rule="evenodd" d="M7.75 14A1.75 1.75 0 016 12.25v-8.5C6 2.784 6.784 2 7.75 2h6.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14h-6.5zm-.25-1.75c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25h-6.5a.25.25 0 00-.25.25v8.5zM4.9 3.508a.75.75 0 01-.274 1.025.25.25 0 00-.126.217v6.5a.25.25 0 00.126.217.75.75 0 01-.752 1.298A1.75 1.75 0 013 11.25v-6.5c0-.649.353-1.214.874-1.516a.75.75 0 011.025.274zM1.625 5.533a.75.75 0 10-.752-1.299A1.75 1.75 0 000 5.75v4.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217v-4.5a.25.25 0 01.126-.217z"/>
                        </svg>
                        {{$tc('nft.collection.item_count', itemCount)}}
                    </div>

                    <span class="skeleton" v-else>100 items</span>

                    <span class="nft-link" v-if="ownerAddress">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h3.5a.75.75 0 010 1.5h-3.5A1.75 1.75 0 011 13.25V1.75C1 .784 1.784 0 2.75 0h8a1.75 1.75 0 011.508.862.75.75 0 11-1.289.768.25.25 0 00-.219-.13h-8z"></path><path fill-rule="evenodd" d="M8 7a4 4 0 116.49 3.13l.995 4.973a.75.75 0 01-.991.852l-2.409-.876a.25.25 0 00-.17 0l-2.409.876a.75.75 0 01-.991-.852l.994-4.973A3.993 3.993 0 018 7zm4-2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 6.5a4 4 0 001.104-.154l.649 3.243-1.155-.42c-.386-.14-.81-.14-1.196 0l-1.155.42.649-3.243A4 4 0 0012 11z"></path></svg>
                        <ui-address v-bind:address="ownerAddress"/>
                    </span>

                    <a class="nft-link" v-if="externalLink" v-bind:href="externalLink">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="margin-top: -1px;">
                            <path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
                        </svg>
                        {{externalLink}}
                    </a>
                </div>
            </div>
        </div>

        <div v-if="items.length === 0 && isLoading" class="nft-items-container">
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

        <div v-else class="nft-items-container">
            <nft-item-preview-card v-for="item in items"
                v-bind:key="item.itemAddress"
                v-bind:address="item.itemAddress"
                v-bind:index="item.index"
                v-bind:invalid="item.invalid"
                v-bind:itemCount="itemCount"
                v-bind:name="item.content && item.content.name ? item.content.name : undefined"
                v-bind:images="item.content && item.content.image ? item.content.image : {}"
                v-on:reload="handleReload"/>
        </div>

        <mugen-scroll v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll" class="nft-items-container__loader">
            <div v-on:click="loadMore" v-show="showPreloader" class="tx-table-loader-button">
                <span v-if="isLoading" v-text="$t('address.tx_table.loader_loading')"/>
                <span v-else v-text="$t('address.tx_table.loader')"/>
            </div>
        </mugen-scroll>
    </section>
</template>

<script>
import { getNftCollectionItems } from '~/nft.js';
import MugenScroll from 'vue-mugen-scroll';
import NftItemPreviewCard from './NftItemPreviewCard.vue';

const PER_PAGE = 12;

export default {
    props: {
        address: String,
        itemCount: Number,
        ownerAddress: String,
        name: String,
        description: String,
        image: Object,
        externalLink: String,
        sellerFee: Number,
        feeRecepient: String,
        royalty: Number,
        royaltyBase: Number,
        royaltyFactor: Number,
        royaltyAddress: String,
    },

    data() {
        return {
            items: [],
            isLoading: true,
        };
    },

    computed: {
        skeletonCount() {
            return Math.min(this.itemCount, PER_PAGE);
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
                return count && this.loadItems();
            },
        },
    },

    methods: {
        async loadItems() {
            const limit = Math.min(this.itemCount, PER_PAGE);
            const data = await getNftCollectionItems(this.address, { limit });

            this.items = data.map(Object.freeze);
            this.isLoading = false;
        },

        loadMore() {
            const total = this.itemCount;
            const offset = this.items.length;
            let limit = PER_PAGE;

            if ((limit + offset) > total) {
                limit = total - offset;
            }

            this.isLoading = true;
            getNftCollectionItems(this.address, { limit, offset }).then((items) => {
                this.items = this.items.concat(items.map(Object.freeze));
                this.isLoading = false;
            });
        },

        handleReload(index) {
            const idx = this.items.findIndex(item => item.index === index);

            getNftCollectionItems(this.address, { offset: index, limit: 1 }).then((item) => {
                this.items.splice(idx, 1, Object.freeze(item[0]));
            });
        },
    },

    components: {
        MugenScroll, NftItemPreviewCard,
    },
};
</script>
