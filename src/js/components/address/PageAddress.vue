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
                        <span v-if="addressMeta.isScam" class="card-main-address-badge card-main-address-badge--scam">SCAM</span>
                        <ui-copy-button show-button class="card-main-address"
                            v-bind:successMessage="$t('address.info.copy_success')"
                            v-bind:copy="address">
                            {{address}}
                        </ui-copy-button>

                        <span class="card-main-qr-button" v-on:click="qrModalVisible = true">
                            <svg v-pre class="card-main-qr-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                <path d="M0 0v6h6V0H0zm8 0v6h6V0H8zM2 2h2v2H2V2zm8 0h2v2h-2V2zM0 8v6h6V8H0zm8 0v2h2V8H8zm2 2v2h2v-2h-2zm2 0h2V8h-2v2zm0 2v2h2v-2h-2zm-2 0H8v2h2v-2zm-8-2h2v2H2v-2z"/>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.balance')"/>
                    <div class="card-row__value" v-if="wallet.balance == '0' || wallet.balance">
                        {{$ton(wallet.balance)}}
                        <span v-text="addressMeta.tonIcon || 'TON'" title="TON"/>
                        <span v-if="$store.state.exchangeRate" style="color: #717579">
                            ≈ ${{$fiat(wallet.balance * $store.state.exchangeRate)}}
                        </span>
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
                        <span v-if="wallet.is_frozen" class="card-row-wallet-activity card-row-wallet-activity--frozen"
                            v-text="$t('address.info.type_frozen')"/>

                        <span v-else-if="wallet.is_active" class="card-row-wallet-activity card-row-wallet-activity--active"
                            v-text="$t('address.info.type_active')"/>

                        <span v-else class="card-row-wallet-activity card-row-wallet-activity--passive"
                            v-text="$t('address.info.type_inactive')"/>
                    </div>
                </div>

                <div v-if="contractTypeVisible" class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.contract_type')"/>
                    <div v-if="!contractExtendedInfo" class="card-row__value">
                        <span v-if="wallet.wallet_type" v-text="wallet.wallet_type"/>
                        <span v-else class="skeleton">wallet v123</span>
                    </div>
                    <div v-else class="card-row__value">
                        <router-link
                            v-if="contractExtendedInfo.type === 'collection'"
                            v-bind:to="{ name: 'nft', params: { address, skeletonHint: 'collection' }}"
                            v-text="'NFT Collection'"/>

                        <router-link
                            v-else-if="contractExtendedInfo.type === 'item'"
                            v-bind:to="{ name: 'nft', params: { address, skeletonHint: 'item' }}"
                            v-text="'NFT Item'"/>

                        <span v-else>Unknown</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div v-if="emptyHistory" class="tx-history-empty-panel" v-text="$t('address.tx_table.empty')"/>

                <div v-show="!emptyHistory" class="tx-history-wrap">
                    <table class="tx-table">
                        <thead>
                            <tr>
                                <th v-pre width="40"></th>
                                <th width="100">
                                    <div class="tx-table__cell" v-text="$t('address.tx_table.age')"/>
                                </th>
                                <th>
                                    <div class="tx-table__cell tx-table__cell--align-right" v-text="$t('address.tx_table.from')"/>
                                </th>
                                <th v-pre width="50"></th>
                                <th>
                                    <div class="tx-table__cell" v-text="$t('address.tx_table.to')"/>
                                </th>
                                <th>
                                    <div class="tx-table__cell tx-table__cell--align-right" style="padding-right: 26px;"
                                        v-text="$t('address.tx_table.value')"/>
                                </th>
                                <th v-pre width="40">
                                    <div class="tx-table__cell"></div>
                                </th>
                            </tr>
                        </thead>

                        <tbody v-show="transactions.length == 0">
                            <tx-row-skeleton v-for="i in 8" v-bind:key="`tx_skeleton_${i}`"/>
                        </tbody>

                        <tx-row v-for="tx in transactions" v-bind="tx"
                            v-bind:key="tx.transaction_id.hash"
                            v-bind:txHash="tx.transaction_id.hash"
                            v-bind:txLt="tx.transaction_id.lt"/>
                    </table>
                </div>

                <mugen-scroll v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll" style="display: flex;">
                    <div v-on:click="loadMore" class="tx-table-loader-button" v-show="showPreloader">
                        <span v-if="isLoading" v-text="$t('address.tx_table.loader_loading')"/>
                        <span v-else v-text="$t('address.tx_table.loader')"/>
                    </div>
                </mugen-scroll>
            </div>
        </section>

        <ui-modal class="qr-modal" v-bind:isOpen.sync="qrModalVisible">
            <qr-code class="qr-modal__layer" level="H" render-as="svg" foreground="#111"
                v-bind:value="`ton://transfer/${address}`"
                v-bind:size="300"/>

            <svg v-pre class="qr-modal__logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M46.54 19.143c.608.424.92 2.325.605 6.494a42.027 42.027 0 0 1-.606 4.514c1.411 2.459 1.8 5.247 1.167 8.366-.561 2.761-2.398 5.341-5.345 7.805C39.413 48.787 35.995 51 31.969 51c-4.027 0-8.154-2.323-10.66-4.678-2.507-2.354-4.084-4.575-4.813-7.047-.883-2.997-.587-6.038.886-9.124-.313-1.654-.51-3.158-.59-4.514-.296-4.994-.106-5.965.59-6.494.947-.72 3.961 1.13 9.042 5.547 2.327-.421 4.186-.631 5.576-.631 1.39 0 3.228.21 5.513.63 5.114-4.326 8.123-6.175 9.026-5.546Z" stroke="currentColor" stroke-width="6"/>
                <path d="M31.932 43.822c-1.234.024-2.896-1.649-2.896-2.333 0-.685 1.948-.888 3.037-.888 1.09 0 2.897.116 2.897.888 0 .771-1.804 2.309-3.038 2.333ZM23.985 37.338c1.785.695 3.59.315 4.03-.85.44-1.165-.65-2.674-2.435-3.37-1.784-.695-3.305-.775-3.746.39-.44 1.165.367 3.134 2.151 3.83ZM39.96 37.137c-1.687.815-3.525.516-3.965-.65-.44-1.164.65-2.673 2.434-3.369 1.785-.695 3.127-.775 3.567.39.44 1.165-.349 2.813-2.036 3.629Z" fill="currentColor"/>
            </svg>
        </ui-modal>
    </section>
</template>

<script>
import QrCode from 'qrcode.vue';
import TxRowSkeleton from './TxRowSkeleton.vue';
import TxRow from './TxRow.vue';
import { getAddressInfo, getTransactions } from '~/api.js';
import MugenScroll from 'vue-mugen-scroll';
import { checkAddress } from '~/nft.js';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            contractTypeVisible: true,
            wallet: {},
            transactions: [],
            lastActivity: undefined,
            isLoading: true,
            hasMore: true,
            emptyHistory: false,
            qrModalVisible: false,
            contractExtendedInfo: undefined,
        };
    },

    computed: {
        addressMeta() {
            return this.$store.getters.getAddressMeta(this.address);
        },

        shouldHandleScroll() {
            return !this.isLoading
                && this.hasMore
                && this.transactions.length > 0;
        },

        showPreloader() {
            return this.transactions.length > 0 && this.hasMore;
        },
    },

    watch: {
        '$route': 'loadData',
    },

    created() {
        this.loadData();
    },

    methods: {
        reset() {
            this.wallet = {};
            this.transactions = [];
            this.lastActivity = undefined;
            this.qrModalVisible = false;
            this.contractExtendedInfo = undefined;
        },

        async loadData() {
            this.reset();

            this.wallet = await getAddressInfo(this.address);

            if (this.wallet.invalid) {
                return;
            }

            this.contractTypeVisible = this.wallet.is_active;
            this.emptyHistory = this.wallet.last_tx_lt == '0';

            // Don't make extra requests:
            if (! this.emptyHistory) {
                this.transactions = await getTransactions(this.address, this.wallet.last_tx_lt, this.wallet.last_tx_hash, 20);
            }

            this.lastActivity = this.transactions[0]?.timestamp || null;
            this.hasMore = this.transactions.length >= 20;
            this.isLoading = false;

            if (this.wallet.wallet_type == 'Unknown') {
                checkAddress(this.address)
                    .then((nftInfo) => this.contractExtendedInfo = nftInfo)
                    .catch(e => void e);
            }
        },

        async loadMore() {
            this.isLoading = true;

            const limit = 50;
            const lastTx = this.transactions[ this.transactions.length - 1 ];
            const { transaction_id: { lt, hash }} = lastTx;

            const newTx = await getTransactions(this.address, lt, hash, limit);

            this.hasMore = newTx.length >= limit;
            this.isLoading = false;

            // First tx from the new batch is the last tx from the old batch:
            newTx.shift();

            this.transactions = this.transactions.concat(newTx);
        },
    },

    components: {
        TxRow, TxRowSkeleton, MugenScroll, QrCode,
    },
};
</script>
