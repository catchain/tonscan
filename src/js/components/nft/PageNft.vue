<template>
    <section>
        <nft-item v-if="itemInfo || skeletonHint === 'item'" v-bind="itemInfo"/>

        <nft-collection v-else-if="collectionInfo || skeletonHint === 'collection'"
            v-bind="collectionInfo"
            v-bind:address="address"/>
    </section>
</template>

<script>
import { checkAddress } from '~/nft.js';
import NftCollection from './NftCollection.vue';
import NftItem from './NftItem.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
        skeletonHint: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            itemInfo: undefined,
            collectionInfo: undefined,
        };
    },

    watch: {
        '$route': 'loadData',

        'collectionInfo.name'(newName) {
            if (newName) {
                const name = newName.substring(0, 255);
                document.title = this.$t('nft.collection.meta.title', { name });
            }
        },

        'itemInfo.name'(newName) {
            if (newName) {
                const name = newName.substring(0, 255);
                document.title = this.$t('nft.item.meta.title', { name });
            }
        },
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData(route) {
            this.collectionInfo = undefined;
            this.itemInfo = undefined;

            const data = await checkAddress(this.address);

            // This item belongs to some collection:
            if (data.type === 'item') {
                this.itemInfo = {
                    collectionAddress: data.collectionAddress,
                    ownerAddress: data.ownerAddress,
                    image: data?.content?.image,
                    name: data?.content?.name,
                    index: data.index + 1,
                    description: data?.content?.description,
                    attributes: (data?.content?.attributes || []).map(Object.freeze),
                };
            } else {
                this.collectionInfo = {
                    itemCount: data.info.nextItemIndex,
                    ownerAddress: data.info.ownerAddress,
                    name: data.info.collectionContent?.name,
                    description: data.info.collectionContent?.description,
                    image: data.info.collectionContent?.image,
                    externalLink: data.info.collectionContent?.external_link,
                    sellerFee: data.info.collectionContent?.seller_fee_basis_points,
                    feeRecepient: data.info.collectionInfo?.fee_recipient,
                    royalty: data.royalty?.royalty,
                    royaltyBase: data.royalty?.royaltyBase,
                    royaltyFactor: data.royalty?.royaltyFactor,
                    royaltyAddress: data.royalty?.royaltyAddress,
                };
            }
        },
    },

    components: {
        NftItem, NftCollection,
    },
};
</script>
