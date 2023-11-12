<template>
    <section>
        <div class="jetton-info-container">
            <ui-round-image v-if="hasExternalAvatar" class="jetton-info-image"
                v-bind:srcset="`${image.w72} 1x, ${image.w144} 2x, ${image.w216} 3x`"
                v-bind:src="image.w72"/>

            <ui-round-image v-else class="jetton-info-image" v-bind:src="image_data"/>

            <div class="jetton-info">
                <h2 class="jetton-info__name">
                    <span v-if="!hasOffchainMetadata && name === undefined" class="skeleton skeleton--inline">
                        TOKEN NAME
                    </span>
                    <span v-else-if="!name" class="muted">Name not loaded</span>
                    <template v-else>{{name}}</template>
                </h2>
                <div class="jetton-info__description">
                    <span v-if="!hasOffchainMetadata && description === undefined" class="skeleton skeleton--inline">
                        Some text describing the token
                    </span>
                    <span v-else-if="!description" class="muted" v-text="$t('common.no_description')"/>
                    <template v-else>{{description}}</template>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-row">
                <div class="card-row__name" v-text="$t('address.info.address')"/>
                <div class="card-row__value">
                    <span v-if="addressMeta.isScam" class="card-main-address-badge card-main-address-badge--scam">SCAM</span>
                    <ui-copy-button v-bind:successMessage="$t('address.info.copy_success')" v-bind:copy="address">
                        {{address}}
                    </ui-copy-button>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('jetton.admin_address')"/>
                <div class="card-row__value">
                    <span v-if="admin_address === undefined" class="skeleton">Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz</span>
                    <template v-else-if="!admin_address">
                        {{$t('jetton.admin_address_empty')}}
                        <span class="muted" v-text="$t('jetton.admin_address_empty_explanation')"/>
                    </template>
                    <ui-address v-else v-bind:address="admin_address"/>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('jetton.supply')"/>
                <div class="card-row__value">
                    <template v-if="total_supply !== undefined">
                        {{$ton(total_supply, decimals)}} {{displayedTicker}}
                    </template>
                    <span v-else class="skeleton skeleton--inline">1000000 TOKENS</span>
                </div>
            </div>
 
            <div class="card-row">
                <div class="card-row__name" v-text="$t('jetton.mutable')"/>
                <div class="card-row__value">
                    <template v-if="is_mutable != undefined">
                        {{is_mutable ? $t('common.yes') : $t('common.no')}}
                    </template>
                    <span v-else class="skeleton skeleton--inline">Maybe</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('jetton.metadata_source')"/>
                <div class="card-row__value">
                    <ui-metadata-source
                        v-bind:url="metadata_url"
                        v-bind:loader="getRawMetadata"/>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('jetton.search_wallet')"/>
                <div class="card-row__value" style="width: 100%;">
                    <input class="jetton-wallet-search" v-model.trim="myAddress" type="search"
                        v-bind:placeholder="$t('jetton.search_wallet_placeholder')"
                        v-on:keypress.enter="searchMyAddress">
                </div>
            </div>
        </div>

        <jetton-tabs
            v-bind:address="address"
            v-bind:supply="total_supply"
            v-bind:symbol="displayedTicker"
            v-bind:decimals="decimals"/>
    </section>
</template>

<script>
import JettonTabs from './JettonTabs.vue';
import UiMetadataSource from '~/components/UiMetadataSource.vue';
import { getMyJettonWallet, getJettonRawMetadata } from '~/api/extenderContracts.js';

export default {
    props: {
        address: String,
        admin_address: [String, null],
        total_supply: Number,
        is_mutable: {
            type: Boolean,
            default: undefined,
        },
        metadata_url: [String, null],
        name: String,
        description: String,
        symbol: String,
        image_data: String,
        decimals: Number,
        image: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            myAddress: undefined,
        };
    },

    computed: {
        displayedTicker() {
            if (this.symbol && this.symbol.match(/^[a-z]{2,16}$/i)) {
                return this.symbol;
            }

            return this.$t('jetton.tokens');
        },

        hasOffchainMetadata() {
            return this.metadata_url === null;
        },

        hasExternalAvatar() {
            return !!this?.image?.original;
        },

        addressMeta() {
            return this.$store.getters.getAddressMeta(this.address);
        },
    },

    methods: {
        getRawMetadata() {
            return getJettonRawMetadata(this.address);
        },

        searchMyAddress() {
            if ((this.myAddress || '').length !== 48) {
                return;
            }

            getMyJettonWallet(this.address, this.myAddress)
                .then((response) => {
                    if (response.address) {
                        return this.$router.push({
                            name: 'jetton',
                            params: {
                                address: response.address,
                                lang: this.$i18n.locale,
                            },
                        });
                    }

                    throw Error();
                })
                .catch((error) => {
                    this.$bus.$emit('showToast', 'Error');
                    this.myAddress = undefined;
                });
        },
    },

    components: {
        UiMetadataSource, JettonTabs,
    },
};
</script>

<style lang="scss">
.jetton-info-container {
    width: 100%;
    align-items: center;
    display: flex;
    flex-grow: 1;
    padding: 18px 0;
    margin-bottom: 8px;
}
.jetton-info-image {
    border-radius: 50%;
    margin: 0 14px 0 0;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    align-self: flex-start;
}
.jetton-info {
    flex-grow: 1;
    &__name {
        font-weight: 500;
        font-size: 24px;
        margin: 0 0 8px 0;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        overflow: hidden;
    }
    &__description {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        overflow: hidden;
    }
}

.jetton-wallet-search {
    appearance: none;
    border: none;
    background: var(--body-light-muted-color);
    border: 1px solid transparent;
    padding: 5px 10px;
    margin: -6px 0 !important;
    border-radius: 4px;
    font-family: inherit;
    color: inherit;
    width: 100%;
    max-width: 240px;
    box-sizing: border-box;
    transition: .2s all ease;
    &::placeholder {
        color: #939394;
    }
    &::-webkit-input-placeholder {
        color: #939394;
    }
    &:focus {
        max-width: 480px;
        border-color: #2575ed;
        background: transparent;
    }
}

@media all and (max-width: 480px) {
    .jetton-info-container {
        flex-direction: column;
        text-align: center;
        margin-bottom: 6px;
    }

    .jetton-info-image {
        margin: 0 0 12px 0;
        width: 86px;
        height: 86px;
        align-self: center;
    }

    .jetton-info {
        &__name {
            font-size: 26px;
        }
    }

    .jetton-wallet-search {
        margin: 0 !important;
        max-width: 100%;
    }
}
</style>
