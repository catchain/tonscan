<template>
    <section>
        <div class="card">
            <header class="card-title" v-text="$t('jetton.wallet.title')"/>

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
                <div class="card-row__name" v-text="$t('jetton.wallet.owner')"/>
                <div class="card-row__value">
                    <ui-address v-if="owner_address" v-bind:address="owner_address"/>
                    <span v-else class="skeleton">SomeAddressString</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('address.info.balance')"/>
                <div class="card-row__value" v-if="balance === 0 || balance">
                    {{$ton(balance, jetton.decimals)}}
                    <ui-link v-bind:to="jettonPageLink" v-text="displayedTicker"/>
                </div>

                <div v-else class="card-row__value">
                    <span class="skeleton">100 Tokens</span>
                </div>
            </div>
        </div>

        <div class="card card--tabbed" style="margin-top: 18px;">
            <nav class="card-title-tabs">
                <div class="card-title-tab"
                    v-on:click="activeTab = 'transactions'"
                    v-bind:class="{ 'card-title-tab--active': true }">
                    <icon-list v-once class="card-title-tab__icon"/>
                    {{$t('jetton.recent_tx')}}
                </div>
            </nav>

            <tx-history v-bind:address="address"/>
        </div>
    </section>
</template>

<script>
import TxHistory from '~/components/address/TxHistory.vue';
import IconList from '@img/icons/material-duotone/list.svg?inline';

export default {
    props: {
        address: String,
        owner_address: String,
        jetton_address: String,
        balance: Number,
        jetton: {
            type: Object,
            default: () => ({ image: {}}),
        },
    },

    computed: {
        addressMeta() {
            return this.$store.getters.getAddressMeta(this.address);
        },

        displayedTicker() {
            if (this.jetton?.symbol && this.jetton.symbol.match(/^[a-z]{2,16}$/i)) {
                return this.jetton.symbol;
            }

            return this.$t('jetton.tokens');
        },

        jettonPageLink() {
            return {
                name: 'jetton',
                params: {
                    address: this.jetton_address,
                    skeletonHint: 'jetton',
                },
            };
        },
    },

    components: {
        IconList, TxHistory,
    },
};
</script>
