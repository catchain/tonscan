<template>
    <div class="card nft-card">
        <div class="nft-image-container">
            <img v-if="image" class="nft-image"
                v-bind:src="image.w320"
                v-bind:srcset="`${image.w640} 2x, ${image.w960} 3x`"
                v-bind:style="{ backgroundImage }">
            <div v-else class="nft-image skeleton"/>
        </div>

        <div style="display: flex;flex-direction: column; flex-grow: 1;width: 100%;min-width: 150px;">
            <div class="card-container">
                <h2 class="nft-title">
                    <span v-if="!name" class="skeleton skeleton--inline">Some cool NFTs #2599</span>
                    <span v-else v-text="name"/>
                </h2>

                <div class="nft-description">
                    <span v-if="!description" class="skeleton skeleton--inline">Some cool NFTs pretty long description text</span>
                    <span v-else v-text="description"/>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('nft.item.collection')"/>
                <div class="card-row__value">
                    <router-link class="nft-card-collection" v-bind:to="{ name: 'nft', params: {
                        address: collectionAddress,
                        skeletonHint: 'collection',
                    }}">
                        <img v-if="collectionThumb" class="nft-card-collection__thumb" v-bind:src="collectionThumb">
                        <span v-else class="nft-card-collection__thumb skeleton"/>

                        <span v-if="collectionName" v-text="collectionName" class="nft-card-collection__name" />
                        <span v-else-if="collectionAddress" v-text="collectionAddress" class="nft-card-collection__name"/>
                        <span v-else class="nft-card-collection__name skeleton">Some Address</span>
                    </router-link>
                </div>
            </div>
            <div class="card-row">
                <div class="card-row__name" v-text="$t('nft.item.owner')"/>
                <div class="card-row__value">
                    <span v-if="!ownerAddress" class="skeleton">Some other Address</span>
                    <ui-address v-else v-bind:address="ownerAddress"/>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('nft.item.number')"/>
                <div class="card-row__value">
                    <span v-if="!index" class="skeleton">6969</span>
                    <span v-else v-text="index"/>

                    <span v-if="collectionItemCount">
                        / {{collectionItemCount}}
                    </span>
                </div>
            </div>

            <div class="nft-properties-container">
                <div class="nft-pill" v-on:click="propertiesVisible = true" v-bind:class="{ 'nft-pill--active': propertiesVisible }">
                    <svg v-pre class="nft-pill__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z"/>
                    </svg>
                    {{$t('nft.item.attributes')}}
                </div>

                <div v-show="propertiesVisible">
                    <div class="card-row" v-for="attribute in attributes">
                        <div class="card-row__name" v-text="attribute.trait_type"/>
                        <div class="card-row__value" v-text="attribute.value"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { checkAddress } from '~/nft.js';

export default {
    props: {
        collectionAddress: {
            type: String,
            required: true,
        },
        ownerAddress: {
            type: String,
            required: true,
        },
        image: {
            type: Object,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        attributes: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            propertiesVisible: false,
            collectionName: undefined,
            collectionThumb: undefined,
            collectionItemCount: undefined,
        };
    },

    computed: {
        backgroundImage() {
            return `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkCAEAAFoAVkokQzEAAAAASUVORK5CYII=),` +
                   `url(${this.image.i})`;
        },
    },

    watch: {
        collectionAddress: {
            immediate: true,
            handler(address) {
                address && this.getCollectionInfo();
            },
        },
    },

    methods: {
        getCollectionInfo() {
            checkAddress(this.collectionAddress)
                .then(({ info }) => {
                    this.collectionName = info.collectionContent?.name;
                    this.collectionThumb = info.collectionContent?.image?.w120;
                    this.collectionItemCount = info.nextItemIndex;
                })
                .catch((e) => {
                    this.collectionName = this.collectionAddress;
                });
        },
    },
};
</script>
