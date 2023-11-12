<template>
    <div class="card">
        <div class="modal-banner">
            <aside class="modal-banner-icon">
                <icon-sale class="modal-banner-icon__svg"/>
            </aside>
            <div class="modal-banner__text" v-html="$t('nft_sale.contract_description_html')"/>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.nft_item')"/>
            <div class="card-row__value">
                <ui-link v-bind:to="{ name: 'nft', params: {
                    address: sale.nft_item_address,
                    skeletonHint: 'item',
                }}">
                    <ui-address disabled v-if="sale.nft_item_address" v-bind:address="sale.nft_item_address"/>
                </ui-link>
            </div>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.price')"/>
            <div class="card-row__value">
                {{$ton(sale.price)}} TON
            </div>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.is_active')"/>
            <div class="card-row__value">
                <span class="muted" v-if="sale.is_closed === undefined" v-text="$t('common.unknown')"/>

                <template v-else-if="sale.is_closed === true">
                    <strong v-text="$t('common.no')"/>
                    <span class="muted" v-text="$t('nft_sale.closed_help_text')"/>
                </template>

                <div v-else-if="sale.is_closed === false" class="page-address-contract-info">
                    <strong class="page-address-contract-info__block" v-text="$t('common.yes')"/>

                    <a v-if="nft_item" class="page-address-contract-info__block" target="_blank" v-on:click.stop
                        v-bind:href="`https://getgems.io/collection/${nft_item.collection_address}/${nft_item.item_address}`"
                        v-text="$t('nft_sale.purchase')"/>
                </div>
            </div>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.marketplace')"/>
            <div class="card-row__value">
                <ui-address v-if="sale.marketplace_address" v-bind:address="sale.marketplace_address"/>
            </div>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.seller')"/>
            <div class="card-row__value">
                <ui-address v-if="sale.nft_seller_address" v-bind:address="sale.nft_seller_address"/>
                <span v-else class="muted" v-text="$t('common.unknown')"/>
            </div>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('nft_sale.fees')"/>
            <div class="card-row__value card-row__value--flex-row">
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('nft_sale.marketplace_fee')"/>
                    <div class="card-row__value">
                        {{$ton(sale.marketplace_fee_amount)}} TON
                    </div>
                </div>

                <div class="card-row">
                    <div class="card-row__name" v-text="$t('nft_sale.royalty')"/>
                    <div class="card-row__value">
                        {{$ton(sale.royalty_amount)}} TON
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconSale from '@img/icons/material-duotone/shopping-cart.svg?inline';

export default {
    props: {
        sale: {
            type: Object,
            default: () => ({}),
        },
        nft_item: {
            type: Object,
            default: () => ({
                metadata: {
                    image: {},
                },
            }),
        },
    },

    components: {
        IconSale,
    },
};
</script>
