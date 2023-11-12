<template>
    <section>
        <section v-if="wallet.invalid">
            <div class="alert" v-text="$t('error.invalid_address')"/>
        </section>

        <section v-show="!wallet.invalid">
            <div class="card">
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.address')"/>
                    <div class="card-row__value">
                        <span v-if="isScam" class="card-main-address-badge card-main-address-badge--scam">SCAM</span>
                        <ui-copy-button class="card-main-address"
                            v-bind:successMessage="$t('address.info.copy_success')"
                            v-bind:copy="address">
                            {{address}}
                        </ui-copy-button>

                        <span class="card-main-qr-button" v-on:click="qrModalVisible = true">
                            <svg v-pre class="card-main-qr-button__icon" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd"><path d="M0 0h14v14H0z"/><path d="M8.6 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm0 3.8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm3.8 0h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm-1.9-1.9h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6ZM12.4 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Z" fill="currentColor"/><path d="M2.15.65h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm0 7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm7.5-7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" stroke-width="1.3"/></g>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.balance')"/>
                    <div class="card-row__value" v-if="wallet.balance == '0' || wallet.balance">
                        {{$ton(wallet.balance)}}
                        <span v-text="addressMeta.tonIcon || 'TON'" title="TON"/>

                        <template v-if="wallet.balance != '0'">
                            <span v-if="$store.state.exchangeRate" style="color: #717579">
                                ≈ <ui-fiat v-bind:tonValue="wallet.balance"/>
                            </span>
                        </template>
                    </div>
                    <div v-else class="card-row__value">
                        <span class="skeleton">00000 TON ≈ 00000 USD</span>
                    </div>
                </div>

                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.last_activity')"/>
                    <div class="card-row__value">
                        <span v-if="lastActivity === undefined" class="skeleton">99 minutes ago</span>
                        <span v-else-if="!lastActivity" v-text="this.$t('address.info.no_activity')"/>
                        <ui-timeago v-else v-bind:timestamp="lastActivity"/>
                    </div>
                </div>

                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.state')"/>
                    <div class="card-row__value">
                        <span v-if="wallet.is_active === undefined || isSuspended === undefined" class="skeleton">Inactive</span>

                        <span v-else-if="wallet.is_frozen" class="card-row-wallet-activity card-row-wallet-activity--frozen"
                            v-text="$t('address.info.type_frozen')"/>

                        <span v-else-if="isSuspended" class="card-row-wallet-activity card-row-wallet-activity--suspended"
                            v-text="$t('address.info.type_suspended')"/>

                        <span v-else-if="wallet.is_active" class="card-row-wallet-activity card-row-wallet-activity--active"
                            v-text="$t('address.info.type_active')"/>

                        <span v-else class="card-row-wallet-activity card-row-wallet-activity--passive"
                            v-text="$t('address.info.type_inactive')"/>
                    </div>
                </div>

                <div v-if="isSuspended" class="card-row">
                    <div class="card-row__name" v-text="$t('common.about')"/>

                    <i18n tag="div" class="card-row__value" path="suspended.about">
                        <router-link v-bind:to="{ name: 'suspended' }" v-text="$t('suspended.about_address_count')"/>
                    </i18n>
                </div>

                <div v-if="contractTypeVisible" class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.contract_type')"/>
                    <div v-if="!contractExtendedInfo || wallet.wallet_type" class="card-row__value">
                        <span v-if="wallet.wallet_type" v-text="wallet.wallet_type"/>
                        <span v-else class="skeleton">wallet v123</span>
                    </div>
                    <div v-else class="card-row__value">
                        <contract-info class="page-address-contract-info"
                            v-bind:address="addressCanonical"
                            v-bind:type="contractExtendedInfo.type"
                            v-bind:contractInfo="contractExtendedInfo"/>
                    </div>
                </div>
            </div>

            <address-tabs
                v-bind:address="addressCanonical"
                v-bind:isActive="isActive"
                v-on:lastActivityUpdate="handleLastActivityUpdate"/>
        </section>

        <ui-modal class="qr-modal" v-bind:isOpen.sync="qrModalVisible">
            <ui-qr show-logo v-bind:value="`ton://transfer/${addressCanonical}`" v-bind:size="300"/>
        </ui-modal>

        <div style="display: none">
            <a ref="devExplorerLink" target="_blank" v-bind:href="devExplorerUrl">View in Toncoin Explorer</a>
        </div>
    </section>
</template>

<script>
import { DEV_EXPLORER_ADDRESS } from '~/config.js';
import { getAddressInfo, checkAddress } from '~/api';
import { canonizeAddress } from '~/tonweb.js';
import ContractInfo from './ContractInfo.vue';
import AddressTabs from './AddressTabs.vue'
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
            addressCanonical: undefined,
            contractTypeVisible: true,
            wallet: {},
            lastActivity: undefined,
            qrModalVisible: false,
            contractExtendedInfo: undefined,
        };
    },

    computed: {
        addressMeta() {
            return this.$store.getters.getAddressMeta(this.address);
        },

        isScam() {
            return this.addressMeta.isScam || this.contractExtendedInfo?.meta?.is_scam;
        },

        isSuspended() {
            return this.contractExtendedInfo?.meta?.is_suspended;
        },

        devExplorerUrl() {
            return `${DEV_EXPLORER_ADDRESS}/account?account=${this.address}`;
        },

        isActive() {
            if (this.wallet.is_active === undefined) {
                return undefined; // keep loading state
            }

            return this.wallet.is_active;
        },
    },

    watch: {
        $route() {
            this.loadData();
        },

        address: {
            immediate: true,
            handler: 'canonizeAddress',
        },
    },

    created() {
        this.loadData();
        this.$bus.$on('ctrl-alt-z', this.goToDevExplorer);
    },

    beforeDestroy() {
        this.$bus.$off('ctrl-alt-z', this.goToDevExplorer);
    },

    methods: {
        reset() {
            this.wallet = {};
            this.lastActivity = undefined;
            this.qrModalVisible = false;
            this.contractExtendedInfo = undefined;
        },

        canonizeAddress() {
            this.addressCanonical = canonizeAddress(this.address);
        },

        async loadData() {
            this.reset();

            this.wallet = await getAddressInfo(this.address);

            if (this.wallet.invalid) {
                return;
            } else if (this.address == 'EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2'){
                // Force redirect to locker component
                this.$router.push({
                    name: 'locker',
                    params: {
                        address: this.address,
                        lang: this.$i18n.locale,
                    },
                });
            }

            this.contractTypeVisible = this.wallet.is_active;

            checkAddress(this.address)
                .then((info) => this.contractExtendedInfo = Object.freeze(info))
                .catch(e => void e);
        },

        handleLastActivityUpdate(timestamp) {
            this.lastActivity = timestamp;
        },

        goToDevExplorer() {
            this.$refs.devExplorerLink.click();
        },
    },

    metaInfo() {
        return {
            title: this.$t('address.meta.title', { address: this.addressCanonical }),
            meta: [{
                property: 'description',
                content: this.$t('address.meta.description', { address: this.addressCanonical }),
            }],
        };
    },

    components: {
        UiQr, AddressTabs, ContractInfo,
    },
};
</script>
