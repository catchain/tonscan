<template>
    <section>
        <div class="card">
            <div class="card-title">
                {{ $t('single_nominator.pool') }}
                <a class="card-title__link" v-bind:href="$t('single_nominator.title_help_link')" target="_blank"
                    style="margin-left: auto;">
                    <icon-title-help class="card-title__icon" style="width: auto; height: auto;" /> {{
                        $t('common.what_is_this') }}
                </a>
            </div>

            <div style="flex-grow: 1;">
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('common.address')" />
                    <div class="card-row__value">
                        <ui-copy-button v-bind:copy="address" v-bind:successMessage="$t('address.info.copy_success')">
                            {{ address }}
                        </ui-copy-button>

                        <span class="card-main-qr-button" v-on:click="qrModalVisible = true">
                            <svg v-pre class="card-main-qr-button__icon" width="14" height="14" viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h14v14H0z" />
                                    <path
                                        d="M8.6 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm0 3.8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm3.8 0h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm-1.9-1.9h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6ZM12.4 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Z"
                                        fill="currentColor" />
                                    <path
                                        d="M2.15.65h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm0 7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm7.5-7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Z"
                                        stroke="currentColor" stroke-width="1.3" />
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.balance')" />
                    <div class="card-row__value" v-if="wallet.balance == '0' || wallet.balance">
                        {{ $ton(wallet.balance) }} TON

                        <template v-if="wallet.balance != '0'">
                            <span v-if="$store.state.exchangeRate" style="color: #717579">
                                ≈ <ui-fiat v-bind:tonValue="wallet.balance" />
                            </span>
                        </template>
                    </div>
                    <div v-else class="card-row__value">
                        <span class="skeleton">00000 TON ≈ 00000 USD</span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('single_nominator.owner')" />
                    <div class="card-row__value">
                        <ui-address v-if="poolInfo.owner_address" v-bind:address="poolInfo.owner_address" />
                        <span v-else class="skeleton">EQDCH6....Loh</span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('nominator_pool.validator')" />
                    <div class="card-row__value" style="display: flex; align-items: center;">
                        <template v-if="poolInfo.validator_address">
                            <ui-address v-bind:address="poolInfo.validator_address" />
                        </template>

                        <span v-else class="skeleton">EQDCH6....Loh</span>
                    </div>
                </div>
            </div>
        </div>

        <ui-modal class="qr-modal" v-bind:isOpen.sync="qrModalVisible">
            <ui-qr show-logo v-bind:value="`ton://transfer/${addressCanonical}`" v-bind:size="300" />
        </ui-modal>

        <address-tabs v-bind:address="addressCanonical" v-bind:isActive="isActive"
            v-on:lastActivityUpdate="handleLastActivityUpdate" style="margin-top: 18px;" />
    </section>
</template>

<script>
import { getSingleNominatorData, getAddressInfo } from '~/api';
import { canonizeAddress } from '~/tonweb.js';
import IconTitleHelp from '@primer/octicons/build/svg/info-16.svg?inline';
import IconDotFilled from '@primer/octicons/build/svg/dot-fill-16.svg?inline';
import AddressTabs from '../address/AddressTabs.vue';
import UiQr from '~/components/UiQr.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            poolInfo: {},
            wallet: {},
            qrModalVisible: false,
        };
    },

    watch: {
        address: {
            immediate: true,
            handler: 'canonizeAddress',
        },
    },

    computed: {
        isActive() {
            if (this.wallet.is_active === undefined) {
                return undefined; // keep loading state
            }

            return this.wallet.is_active;
        },
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData() {
            const { nominator_pool_single } = await getSingleNominatorData(this.address).catch((error) => {
                if (error.response.status === 400 || error.response.status === 500) {
                    this.$bus.$emit('showToast', this.$t('single_nominator.error.redirect_invalid'));
                    this.$router.push({
                        name: 'address',
                        params: {
                            address: this.address,
                            lang: this.$i18n.locale,
                        },
                    });
                }
            });
            this.poolInfo = nominator_pool_single;

            this.wallet = await getAddressInfo(this.address);
        },

        canonizeAddress() {
            this.addressCanonical = canonizeAddress(this.address);
        },

        handleLastActivityUpdate(timestamp) {
            this.lastActivity = timestamp;
        },
    },

    components: {
        IconTitleHelp, IconDotFilled, AddressTabs, UiQr
    },
};
</script>

<style lang="scss"></style>
