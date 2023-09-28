<template>
    <section>
        <nft-item v-if="itemInfo || skeletonHint === 'item'"
            v-bind="itemInfo"
            v-on:loadNext="loadNext"/>

        <nft-collection v-else-if="collectionInfo || skeletonHint === 'collection' || !skeletonHint"
            v-bind="collectionInfo"
            v-bind:address="address"/>
    </section>
</template>

<script>
import { detectNft, getNftItemInfo, getNftCollectionInfo, getNftItemByCollectionIndex } from '~/api';
import NftCollection from './NftCollection.vue';
import NftItem from './NftItem.vue';

/**
 * Converts input object to nft-item component props object.
 * @param  {Object} response
 * @return {Object}
 */
const convertApiResponseToNftItemProps = (response) => ({
    itemAddress: response?.item_address,
    collectionAddress: response?.collection_address,
    ownerAddress: response?.owner_address,
    name: response?.metadata?.name,
    index: response?.index + 1,
    description: response?.metadata?.description || null,
    marketplace: response?.metadata?.marketplace || null,
    externalUrl: response?.metadata?.external_url || null,
    attributes: (response?.metadata?.attributes || []).map(Object.freeze),
    metadataUrl: response?.content_url,
    image: response?.metadata?.image || Object.freeze({
        i: undefined,
        w320: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        w640: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        w960: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    }),
});

/**
 * Converts input object to nft-collection component props object.
 * @param  {Object} response
 * @return {Object}
 */
const convertApiResponseToNftCollectionProps = (response) => ({
    itemCount: response?.item_count,
    ownerAddress: response?.owner_address,
    name: response?.metadata?.name,
    description: response?.metadata?.description,
    image: response?.metadata?.image,
    externalLink: response?.metadata?.external_link,
    royalty: response?.royalty?.share_percent,
});

const trim = (string) => string ? string.substring(0, 255) : null;

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
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadNext({ collectionAddress, index }) {
            Object.assign(this.itemInfo, convertApiResponseToNftItemProps(), {
                collectionAddress, index,
                // force skeleton:
                description: undefined,
                // keep only attribute title and display skeletons instead of the values:
                attributes: this.itemInfo.attributes.map(({ trait_type }) => ({ trait_type })),
            });

            await getNftItemByCollectionIndex(collectionAddress, index).then((response) => {
                Object.assign(this.itemInfo, convertApiResponseToNftItemProps(response));
            });

            this.$router.push({
                name: 'nft',
                params: {
                    address: this.itemInfo.itemAddress,
                    lang: this.$i18n.locale,
                    silent: true,
                },
            });
        },

        async loadData(route) {
            if (route?.params?.silent) {
                return;
            }

            this.collectionInfo = undefined;
            this.itemInfo = undefined;

            let apiMethod = undefined;

            switch (this.skeletonHint) {
                case 'item':
                    apiMethod = getNftItemInfo;
                    break;
                case 'collection':
                    apiMethod = getNftCollectionInfo;
                    break;
                default:
                    apiMethod = detectNft;
                    break;
            }

            const data = await apiMethod(this.address).catch(e => void e);

            switch (data?.type) {
                case 'nft_item':
                    this.itemInfo = convertApiResponseToNftItemProps(data.nft_item);
                    break;

                case 'nft_collection':
                    this.collectionInfo = convertApiResponseToNftCollectionProps(data.nft_collection);
                    break;

                default:
                    this.$bus.$emit('showToast', this.$t('nft.error.redirect_invalid'));
                    this.$router.push({
                        name: 'address',
                        params: {
                            address: this.address,
                            lang: this.$i18n.locale,
                        },
                    });
                    break;
            }
        },
    },

    metaInfo() {
        const name = trim(this.collectionInfo?.name || this.itemInfo?.name);
        const image = this.collectionInfo?.image?.w640 || this.itemInfo?.image?.w640;

        if (!name) {
            return undefined;
        }

        let title = undefined;
        let description = this.collectionInfo?.description || this.itemInfo?.description || null;

        if (this.itemInfo) {
            title = this.itemInfo?.collectionAddress === null
                ? this.$t('nft.item.meta.title_standalone', { name })
                : this.$t('nft.item.meta.title', { name, index: this.itemInfo.index })

        } else {
            title = this.$t('nft.collection.meta.title', { name });
        }

        if (this.collectionInfo && !description) {
            description = this.$t('nft.collection.meta.description', { name, count: this.itemCount });
        }

        return {
            title,
            meta: [{
                property: 'og:image',
                content: image,
            }, {
                property: 'description',
                content: description,
            }],
        };
    },

    components: {
        NftItem, NftCollection,
    },
};
</script>
