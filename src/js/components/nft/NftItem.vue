<template>
    <section>
        <section class="nft-item-container">
            <aside class="nft-image-container" v-bind:style="{ backgroundImage }">
                <nft-image-animation
                    v-if="image.animation && image.w640"
                    class="nft-image-container__image"
                    v-bind:animationUrl="image.animation"
                    v-bind:fallbackUrl="image.w640"/>

                <img v-else-if="image.w320" class="nft-image-container__image"
                    v-bind:src="image.w640"
                    v-bind:srcset="`${image.w640} 1.5x, ${image.w960} 2.2x`">

                <div v-else class="nft-image skeleton"/>
            </aside>

            <section class="nft-item-container__info">
                <header class="nft-item-header">
                    <h2 class="nft-item-header__title">
                        <span v-if="!name" class="skeleton skeleton--inline">Some cool NFTs 2599</span>
                        <span v-else v-text="name"/>
                    </h2>

                    <div class="nft-item-header__description">
                        <!-- External JSON is loaded, description is not set: -->
                        <span class="muted"
                            v-if="description === null || description === ''"
                            v-text="$t('common.no_description')"/>

                        <!-- Data is loading: -->
                        <span v-else-if="!description" class="skeleton skeleton--inline">Some cool NFTs pretty long description text</span>

                        <!-- Everything is loaded, description is set: -->
                        <template v-else>{{description}}</template>
                    </div>
                </header>

                <div class="card">
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nft.item.collection')"/>
                        <div class="card-row__value">
                            <!-- null means that all data is loaded, but the item is standalone (no collection): -->
                            <span v-if="collectionAddress === null" class="muted" v-text="$t('nft.item.no_collection')"/>

                            <!-- if either of item info or collection info is loading, show skeleton: -->
                            <template v-else-if="collectionAddress === undefined || collectionName === undefined">
                                <span class="nft-card-collection__name skeleton">Some Address</span>
                            </template>

                            <ui-link v-else class="nft-card-collection" v-bind:to="collectionRouterParams">
                                <ui-round-image size="tiny" class="nft-card-collection__thumb"
                                    v-if="collectionName"
                                    v-bind:src="collectionThumb"/>

                                <span class="nft-card-collection__name" v-text="collectionName || collectionAddress"/>
                            </ui-link>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nft.item.owner')"/>
                        <div class="card-row__value">
                            <span v-if="!ownerAddress" class="skeleton">Some other Address</span>
                            <ui-address v-else v-bind:address="ownerAddress"/>
                        </div>
                    </div>

                    <div class="card-row" v-if="collectionAddress !== null">
                        <div class="card-row__name" v-text="$t('nft.item.number')"/>
                        <div class="card-row__value" style="display: flex;">
                            <span v-if="!index" class="skeleton">6969</span>
                            <span v-else v-text="index"/>

                            <template v-if="collectionItemCount">
                                &nbsp;/&nbsp;{{collectionItemCount}}
                            </template>

                            <nav class="card-row-inline-pager" role="navigation">
                                <span class="card-row-inline-pager__arrow" tabindex="0"
                                    v-on:click="loadPrev" v-on:keyup.enter="loadPrev"
                                    v-bind:disabled="!itemAddress || index <= 1">
                                    <icon-prev class="card-row-inline-pager__arrow__svg"/>
                                </span>

                                <span class="card-row-inline-pager__arrow" tabindex="0"
                                    v-on:click="loadNext" v-on:keyup.enter="loadNext"
                                    v-bind:disabled="!itemAddress || index >= collectionItemCount">
                                    <icon-next class="card-row-inline-pager__arrow__svg"/>
                                </span>
                            </nav>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nft.item.metadata_source')"/>
                        <div class="card-row__value">
                            <ui-metadata-source v-bind:url="metadataUrl"/>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name">{{$t('nft.item.attributes')}}</div>
                        <div v-if="attributes.length > 0" class="card-row__value card-row__value--flex-row">
                            <div class="card-row" v-for="attribute in attributes">
                                <div class="card-row__name" v-text="attribute.trait_type"/>
                                <div class="card-row__value">
                                    <span v-if="attribute.value === undefined" class="skeleton">some value</span>
                                    <template v-else>
                                        {{attribute.value}}
                                    </template>
                                </div>
                            </div>
                        </div>
                        <span v-else class="muted" v-text="$t('nft.item.no_attributes')"/>
                    </div>
                </div>
            </section>
        </section>

        <section class="nft-item-transactions-container">
            <div class="card card--tabbed">
                <nav class="card-title-tabs">
                    <div class="card-title-tab"
                        v-bind:class="{ 'card-title-tab--active': true }">
                        <icon-list v-once class="card-title-tab__icon"/>
                        {{$t('nft.item.recent_tx')}}
                    </div>
                </nav>

                <tx-history v-bind:address="itemAddress"/>
            </div>
        </section>
    </section>
</template>

<script>
import { getNftCollectionInfo } from '~/api';
import IconList from '@img/icons/material-duotone/history.svg?inline';
import IconPrev from '@primer/octicons/build/svg/chevron-left-16.svg?inline';
import IconNext from '@primer/octicons/build/svg/chevron-right-16.svg?inline';
import NftImageAnimation from './NftImageAnimation.vue';
import TxHistory from '~/components/address/TxHistory.vue';
import UiMetadataSource from '~/components/UiMetadataSource.vue';

export default {
    props: {
        itemAddress: {
            type: String,
            required: true,
        },
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
            default: () => ({}),
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
        marketplace: String,
        externalUrl: String,
        metadataUrl: String,
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
            return this.image.i ? `url(${this.image.i})` : '';
        },

        collectionRouterParams() {
            return {
                name: 'nft',
                params: {
                    address: this.collectionAddress,
                    skeletonHint: 'collection',
                    lang: this.$i18n.locale,
                },
            };
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
            getNftCollectionInfo(this.collectionAddress)
                .then(({ nft_collection }) => {
                    this.collectionName = nft_collection?.metadata?.name || null;
                    this.collectionThumb = nft_collection?.metadata?.image?.w120;
                    this.collectionItemCount = nft_collection?.item_count || null;
                })
                .catch((e) => {
                    this.collectionName = this.collectionAddress;
                });
        },

        loadNext() {
            if (this.index >= this.collectionItemCount) return;

            this.$emit('loadNext', {
                collectionAddress: this.collectionAddress,
                index: this.index + 1,
            });
        },

        loadPrev() {
            if (this.index <= 1) return;

            this.$emit('loadNext', {
                collectionAddress: this.collectionAddress,
                index: this.index - 1,
            });
        },
    },

    components: {
        TxHistory, UiMetadataSource, IconList, NftImageAnimation, IconPrev, IconNext,
    },
};
</script>

<style lang="scss">
.nft-item-container {
    display: flex;
    margin-top: 32px;
    flex-direction: row;
    &__info {
        margin-top: auto;
        flex-grow: 1;
        flex-basis: 100%;
    }
}

.nft-item-transactions-container {
    margin-top: 32px;
}

.nft-image-container {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-right: 32px;
    background-color: var(--ambilight-overlay-color);
    background-size: cover;
    background-position: center;
    background-blend-mode: soft-light;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    &__image {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 60vh;
        border-radius: 16px;
        display: block;
        object-fit: contain;
        margin: auto;
        &.skeleton {
            border-radius: 8px;
            background-image: none;
            box-shadow: none;
            aspect-ratio: 1 / 1;
        }
    }
}

.nft-item-header {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    min-width: 150px;
    &__title {
        font-weight: 500;
        font-size: 30px;
        margin-bottom: 12px;
        margin-top: 12px;
    }
    &__description {
        font-size: 17px;
        margin-bottom: 18px;
        line-height: 1.4;
    }
}

.nft-card-collection {
    display: flex;
    align-items: center;
    &__thumb {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin: -8px 6px -8px 0;
    }
}

.card-row-inline-pager {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    &__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        margin: -6px;
        cursor: pointer;
        &[disabled] {
            color: #777;
            pointer-events: none;
            opacity: .5;
        }
        &:hover .card-row-inline-pager__arrow__svg {
            opacity: 1;
        }
        &__svg {
            cursor: pointer;
            fill: currentColor;
            width: 12px;
            height: 12px;
            padding: 4px;
            margin: -4px 2px;
            background: var(--card-row-separator);
            opacity: .6;
            transition: .08s opacity ease-out;
            border-radius: 4px;
        }
    }
}

@media all and (max-width: 800px) {
    .nft-item-container {
        flex-direction: column;
        margin-top: 8px;
    }

    .nft-image-container {
        max-width: unset;
        overflow: hidden;
        &__image {
            width: auto;
            height: 40vh;
            border-radius: 0;
        }
    }

    .nft-item-transactions-container {
        margin-top: 18px;
    }

    .nft-item-header {
        box-sizing: border-box;
        padding: 0 16px;
        &__title {
            margin-top: 18px;
            margin-bottom: 6px;
            font-size: 26px;
        }
        &__description {
            font-size: 16px;
            line-height: 1.4;
        }
    }

    .nft-card-collection__thumb {
        width: 20px;
        height: 20px;
    }

    .card-row-inline-pager {
        &__arrow {
            &__svg {
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
        }
    }
}
</style>
