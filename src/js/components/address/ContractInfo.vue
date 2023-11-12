<template>
    <div class="page-address-contract-info">
        <ui-link v-if="routerParams.name" v-bind:to="routerParams" class="page-address-contract-info__link">
            <ui-round-image v-if="image !== false" size="tiny" v-bind:src="image"/>
            {{$t(`address.contract_type.${type}`)}}
        </ui-link>

        <!-- Special case: NFT sale: -->
        <template v-else-if="contractInfo.type === 'nft_sale'">
            <ui-round-image v-if="image !== false" size="tiny" v-bind:src="image"/>

            <span class="page-address-contract-info__block">
                <a v-on:click.prevent="widgetModalVisible = true" v-text="$t('address.contract_type.nft_sale')"/>
            </span>

            <!-- TODO: support standalone collections: -->
            <span class="page-address-contract-info__block"
                v-if="contractInfo.nft_item && contractInfo.nft_item.collection_address && contractInfo.sale.is_closed === false">

                <i18n v-if="contractInfo.sale.is_closed === false"
                    path="address.contract_type.sale.sale_info"
                    tag="span" class="muted">
                    <a target="_blank" ref="nofollow"
                        v-bind:href="`https://getgems.io/collection/${contractInfo.nft_item.collection_address}/${contractInfo.nft_item.item_address}`">
                        <template v-if="contractInfo.flavor === 'getgems_auction'">
                            {{$t('address.contract_type.sale.on_auction')}}
                        </template>
                        <template v-else>
                            {{$t('address.contract_type.sale.on_sale')}}
                        </template>
                    </a>
                    <template>{{$ton(contractInfo.sale.price)}} TON</template>
                </i18n>
            </span>
        </template>

        <!-- Special case: domain -->
        <contract-info-domain
            v-else-if="contractInfo.type === 'dns_domain'"
            v-bind="contractInfo.domain"
            v-bind:auction="contractInfo.domain.auction"/>

        <!-- Special case: Telegram Anonymous Number -->
        <template v-else-if="contractInfo.type === 'telegram_number'">
            <span class="page-address-contract-info__block" v-text="$t('address.contract_type.telegram_number')"/>
            <span class="page-address-contract-info__block">
                <ui-copy-button v-bind:copy="contractInfo.telegram_number.phone_number">
                    {{contractInfo.telegram_number.phone_number_formatted}}
                </ui-copy-button>
            </span>
        </template>

        <!-- Special case: telegram username -->
        <template v-else-if="contractInfo.type === 'telegram_username'">
            <span class="page-address-contract-info__block" v-text="$t('address.contract_type.telegram_username')"/>
            <span class="page-address-contract-info__block">
                @{{contractInfo.telegram_username.username}}
            </span>
        </template>

        <!-- Special case: subscription -->
        <template v-else-if="contractInfo.type === 'subscription'">
            <a v-on:click.prevent="widgetModalVisible = true" v-text="$t('address.contract_type.subscription')"/>
        </template>

        <!-- Special case: NFT offer -->
        <template v-else-if="contractInfo.type === 'nft_offer'">
            {{$t('address.contract_type.nft_offer')}}
        </template>

        <!-- Special case: Storage Provider -->
        <template v-else-if="contractInfo.type === 'storage_provider'">
            <contract-info-storage-provider
                v-bind:acceptsNewContracts="contractInfo.storage_provider.accepts_new_contracts"
                v-bind:dailyRatePerMegabyte="contractInfo.storage_provider.rate_per_mb_day"
                v-bind:minFileSize="contractInfo.storage_provider.min_file_size"
                v-bind:maxFileSize="contractInfo.storage_provider.max_file_size"/>
        </template>

        <!-- Special case: Locker -->
        <ui-link v-else-if="contractInfo.type === 'locker'">
            {{ $t('address.contract_type.locker') }}
        </ui-link>

        <!-- Special case: Vesting -->
        <ui-link v-else-if="contractInfo.type === 'vesting_wallet'">
            {{ $t('address.contract_type.vesting_wallet') }}
        </ui-link>

        <!-- Special case: Single nominator pool -->
        <ui-link v-else-if="contractInfo.type === 'nominator_pool_single'">
            {{ $t('address.contract_type.nominator_pool_single') }}
        </ui-link>

        <!-- Everything else is unknown: -->
        <template v-else>
            {{$t('address.contract_type.unknown')}}
        </template>


        <!-- All modals have the same parent container, only the inner content differs: -->
        <ui-modal v-bind:isOpen.sync="widgetModalVisible">
            <!-- Subscription info component -->
            <template v-if="contractInfo.type === 'subscription'">
                <template slot="header">
                    {{$t('address.contract_type.subscription_modal_header')}}
                </template>
                <contract-widget-subscription v-bind="contractInfo.subscription"/>
            </template>

            <!-- NFT Sale info component -->
            <template v-else-if="contractInfo.type === 'nft_sale'">
                <template slot="header">
                    {{$t('address.contract_type.nft_sale_modal_header')}}
                </template>
                <contract-widget-nft-sale v-bind="contractInfo"/>
            </template>
        </ui-modal>
    </div>
</template>

<script>
import ContractInfoStorageProvider from './ContractInfoStorageProvider.vue';
import ContractWidgetSubscription from './ContractWidgetSubscription.vue';
import ContractWidgetNftSale from './ContractWidgetNftSale.vue';
import ContractInfoDomain from './ContractInfoDomain.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        contractInfo: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            widgetModalVisible: false,
        };
    },

    computed: {
        routerParams() {
            let name = undefined;
            let skeletonHint = this.type;
            const address = this.address;

            switch (this.type) {
                case 'nft_collection':
                case 'nft_item':
                    name = 'nft';
                    skeletonHint = this.type.replace('nft_', '');
                    break;

                case 'jetton':
                case 'jetton_wallet':
                    name = 'jetton';
                    break;

                case 'nominator_pool':
                    name = 'nominator';
                    break;

                case 'locker':
                    name = 'locker';
                    break;
                    
                case 'vesting_wallet':
                    name = 'vesting';
                    break;

                case 'nominator_pool_single':
                    name = 'single_nominator';
                    break;
            };

            return { name, params: { address, skeletonHint }};
        },

        image() {
            switch (this.type) {
                case 'jetton':
                case 'jetton_wallet':
                    return this.contractInfo.jetton?.metadata?.image?.w72 || this.contractInfo.jetton?.metadata?.image_data;
                    break;

                case 'nft_item':
                case 'nft_sale':
                    return this.contractInfo.nft_item?.metadata?.image?.w320;
                    break;

                case 'nft_collection':
                    return this.contractInfo.nft_collection?.metadata?.image?.w120;
                    break;

                case 'nominator_pool':
                    return false;
                    break;

                case 'locker':
                    return false;
                    break;

                case 'vesting_wallet':
                    return false;
                    break;

                case 'nominator_pool_single':
                    return false;
                    break;

                default:
                    return undefined;
                    break;
            };
        },
    },

    components: {
        ContractInfoDomain, ContractWidgetSubscription, ContractWidgetNftSale, ContractInfoStorageProvider,
    },
};
</script>

<style lang="scss">
.page-address-contract-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &__link {
        display: flex;
        align-items: center;
    }
    .ui-round-image {
        margin: -8px 6px -8px 0;
        width: 20px;
        height: 20px;
        color: inherit;
    }
    &__block {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        &::after {
            content: '•';
            padding: 0 6px;
            color: var(--body-muted-text-color);
        }
        &:last-child::after {
            display: none;
        }
    }
}
</style>
