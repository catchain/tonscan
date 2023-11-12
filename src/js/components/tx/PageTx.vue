<template>
    <section>
        <section v-if="isError">
            <div class="alert" v-text="$t('error.invalid_tx')"/>
        </section>

        <div v-show="!isError" class="card">
            <div class="card-title">
                <icon-tx-type-ordinary class="card-title__icon"/> {{$t('tx.title')}}
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.account')"/>
                <div class="card-row__value">
                    <div v-if="address" style="display: flex;">
                        <ui-address hide-name v-bind:address="address"/>
                        <ui-copy-button v-bind:copy="address" v-bind:successMessage="$t('address.info.copy_success')"/>
                    </div>
                    <span v-else class="skeleton">EQDCHV6...BLABLA</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.status')"/>
                <div class="card-row__value">
                    <span class="tx-status" v-bind:class="{
                        'tx-status--success': is_success,
                        'tx-status--failed': !is_success,
                    }">
                        <span v-if="is_success === undefined" class="skeleton">Unknown</span>
                        <template v-else-if="is_success">
                            <icon-success class="tx-status__icon"/> {{$t('tx.status_success')}}
                        </template>
                        <template v-else>
                            <icon-failed class="tx-status__icon"/> {{$t('tx.status_failed')}}
                        </template>
                    </span>
                </div>
            </div>

            <div class="card-row" v-if="is_success === false">
                <div class="card-row__name" v-text="$t('tx.exit_codes')"/>
                <div class="card-row__value">
                    <div class="tx-flow-schematics">
                        <div class="tx-flow-schematics-step">
                            <div class="tx-flow-schematics-step__inner">
                                <header class="tx-flow-schematics-step__phase muted" v-text="$t('tx.compute_phase')"/>
                                <div class="tx-flow-schematics-step__result">
                                    <template v-if="compute_exit_code === null">
                                        {{$t('tx.phase_aborted')}}
                                    </template>
                                    <template v-else>
                                        {{compute_exit_code}}
                                    </template>
                                </div>
                            </div>
                        </div>

                        <div class="tx-flow-schematics-step">
                            <div class="tx-flow-schematics-step__inner">
                                <header class="tx-flow-schematics-step__phase muted" v-text="$t('tx.action_phase')"/>
                                <div class="tx-flow-schematics-step__result">
                                    <template v-if="action_result_code === null">
                                        {{$t('tx.phase_aborted')}}
                                    </template>
                                    <template v-else>
                                        {{action_result_code}}
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.timestamp')"/>
                <div class="card-row__value">
                    <template v-if="timestamp">
                        {{dateString}} &mdash; <ui-timeago v-bind:timestamp="timestamp"/>
                    </template>
                    <span v-else class="skeleton">00/00/2000 10:00</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.lt')"/>
                <div class="card-row__value">
                    <template v-if="lt">
                        <ui-copy-button v-bind:copy="lt" v-bind:successMessage="$t('tx.lt_copy_success')">
                            {{lt}}
                        </ui-copy-button>
                    </template>
                    <span v-else class="skeleton">0000000000000</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.hash')"/>
                <div class="card-row__value card-row__value--flex-row">
                    <div class="card-row">
                        <div class="card-row__name">base64</div>
                        <div class="card-row__value">
                            <span v-if="isLoading" class="skeleton">0000000000000</span>
                            <ui-copy-button v-else v-bind:copy="hashBase64" v-bind:successMessage="$t('tx.hash_copy_success')">
                                {{hashBase64}}
                            </ui-copy-button>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name">hex</div>
                        <div class="card-row__value">
                            <span v-if="isLoading" class="skeleton">0000000000000</span>
                            <ui-copy-button v-else v-bind:copy="hashHex" v-bind:successMessage="$t('tx.hash_copy_success')">
                                {{hashHex}}
                            </ui-copy-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.fee')"/>
                <div class="card-row__value card-row__value--flex-row">
                    <div class="card-row">
                        <div class="card-row__name">total</div>
                        <div class="card-row__value">
                            <span v-if="isLoading" class="skeleton">0.1 TON</span>
                            <span v-else>{{$fee(fee)}} TON</span>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name">storage</div>
                        <div class="card-row__value">
                            <span v-if="isLoading" class="skeleton">0.1 TON</span>
                            <span v-else>{{$fee(storageFee)}} TON</span>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name">other</div>
                        <div class="card-row__value">
                            <span v-if="isLoading" class="skeleton">0.1 TON</span>
                            <span v-else>{{$fee(otherFee)}} TON</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-row" style="border-bottom: none;">
                <div class="card-row__name" v-text="$t('tx.msgs')"/>
                <div class="card-row__value">
                    <span v-if="isLoading" class="skeleton">1 input, 1 output</span>
                    <span v-else-if="!in_msg && !out_msgs.length" v-text="$t('tx.msgs_empty')"/>
                    <span v-else v-text="$t('tx.msgs_count', [1, out_msgs.length])"/>
                </div>
            </div>

            <div class="tx-page-messages">
                <div v-if="in_msg" class="tx-page-msg">
                    <div class="card-row__name">
                        <span class="tx-table__badge tx-table__badge--in">IN</span>
                    </div>
                    <tx-msg class="tx-page-msg-details"
                        v-bind:source="in_msg.source"
                        v-bind:destination="in_msg.destination"
                        v-bind:value="in_msg.value"
                        v-bind:fwd_fee="in_msg.fwd_fee"
                        v-bind:ihr_fee="in_msg.ihr_fee"
                        v-bind:created_lt="in_msg.created_lt"
                        v-bind:hash="in_msg.hash"
                        v-bind:comment="in_msg.comment"
                        v-bind:op="in_msg.op"/>
                </div>

                <div v-for="msg in out_msgs" class="tx-page-msg"> 
                    <div class="card-row__name">
                        <span v-if="!msg.destination"
                            class="tx-table__badge tx-table__badge--service"
                            v-text="$t('address.tx_table.log')"/>

                        <span v-else
                            class="tx-table__badge tx-table__badge--out"
                            v-text="$t('address.tx_table.output')"/>
                    </div>

                    <tx-msg class="tx-page-msg-details"
                        v-bind:source="msg.source"
                        v-bind:destination="msg.destination"
                        v-bind:value="msg.value"
                        v-bind:fwd_fee="msg.fwd_fee"
                        v-bind:ihr_fee="msg.ihr_fee"
                        v-bind:created_lt="msg.created_lt"
                        v-bind:hash="msg.hash"
                        v-bind:comment="msg.comment"
                        v-bind:op="msg.op"/>
                </div>
            </div>

            <div style="display: none">
                <a ref="devExplorerLink" target="_blank" v-bind:href="devExplorerUrl">View in Toncoin Explorer</a>
            </div>
        </div>
    </section>
</template>

<script>
import IconTxTypeOrdinary from '@primer/octicons/build/svg/git-commit-24.svg?inline';
import IconSuccess from '@primer/octicons/build/svg/check-circle-16.svg?inline';
import IconFailed from '@primer/octicons/build/svg/x-circle-16.svg?inline';
import { DEV_EXPLORER_ADDRESS } from '~/config.js';
import { base64ToHex, hexToBase64, toBase64Web } from '~/utils.js';
import { canonizeAddress } from '~/tonweb.js';
import { getTransactionByHashOrInMessageHash, getTransactionByInMessageHash } from '~/api';
import TxMsg from './TxMsg.vue';

export default {
    props: {
        hash: String,
    },

    data() {
        return {
            address: undefined,
            type: undefined,
            is_success: undefined,
            exit_code: undefined,
            compute_vm_steps: undefined,
            fee: undefined,
            storageFee: undefined,
            otherFee: undefined,
            dateString: undefined,
            timestamp: undefined,
            in_msg: undefined,
            isLoading: true,
            isError: false,
            hashBase64: undefined,
            hashHex: undefined,
            lt: undefined,
            out_msgs: [],
        };
    },

    computed: {
        isGettingByMsgHash() {
            return this.$route.name === 'tx_by_msg_hash';
        },

        devExplorerUrl() {
            return `${DEV_EXPLORER_ADDRESS}/transaction?account=${this.address}&lt=${this.lt}&hash=${this.hashHex}`;
        },
    },

    created() {
        // redirect hex-formatted hash to base64-formatted:
        if (this.$route.params.hash.length === 64) {
            return this.$router.replace({
                name: this.$route.name,
                params: {
                    hash: toBase64Web(hexToBase64(this.$route.params.hash)),
                    lang: this.$i18n.locale,
                },
            });
        }

        this.loadData();

        this.$bus.$on('ctrl-alt-z', this.goToDevExplorer);
    },

    beforeDestroy() {
        this.$bus.$off('ctrl-alt-z', this.goToDevExplorer);
    },

    watch: {
        '$route': 'loadData',
    },

    methods: {
        loadData() {
            this.isLoading = true;
            this.isError = false;

            // both hash and in_msg_hash pages are served with this component:
            const apiMethod = this.isGettingByMsgHash
                ? getTransactionByInMessageHash
                : getTransactionByHashOrInMessageHash;

            apiMethod(this.hash).then((tx) => {
                this.address = canonizeAddress(tx.account);
                this.type = tx.transaction_type;

                // in_msg hash matches the requested hash, meaning that we're searching
                // for in_msg_hash on tx page, need to replace URL:
                if (tx?.in_msg?.hash && toBase64Web(tx.in_msg.hash) === toBase64Web(this.hash)) {
                    this.$router.replace({
                        name: 'tx_by_msg_hash',
                        params: {
                            hash: toBase64Web(tx.in_msg.hash),
                            lang: this.$i18n.locale,
                        },
                    });
                }

                // both phases are skipped if we're activating the new wallet, we should consider this tx successful:
                const new_wallet_tx_success = tx.action_result_code === null && tx.compute_exit_code === null;
                const execution_success = tx.action_result_code !== null && parseInt(tx.action_result_code, 10) <= 1;

                this.is_success = new_wallet_tx_success || execution_success;
                this.exit_code = this.is_success
                    ? tx.action_result_code
                    : tx.compute_exit_code;

                this.compute_exit_code = tx.compute_exit_code;
                this.action_result_code = tx.action_result_code;
                this.compute_vm_steps = tx.compute_vm_steps;

                this.fee = tx.fee;
                this.storageFee = tx.storage_fee || 0;
                this.otherFee = tx.other_fee || 0;
                this.timestamp = parseInt(tx.utime + '000', 10);
                this.dateString = new Date(this.timestamp).toLocaleString();
                this.in_msg = tx.in_msg ? Object.freeze(tx.in_msg) : undefined;
                this.out_msgs = tx.out_msgs.map(Object.freeze);

                this.hashBase64 = tx.hash;
                this.hashHex = base64ToHex(this.hashBase64);
                this.lt = tx.lt;
            })
            .catch((e) => {
                this.isError = true;
                console.error(e);
            })
            .finally(() => {
                this.isLoading = false;
            });
        },

        goToDevExplorer() {
            this.$refs.devExplorerLink.click();
        },
    },

    metaInfo() {
        return {
            title: this.$t('tx.meta.title', { hash: this.hash }),
            meta: [{
                property: 'robots',
                content: 'noindex',
            }],
        };
    },

    components: {
        TxMsg, IconTxTypeOrdinary, IconSuccess, IconFailed,
    },
};
</script>

<style lang="scss">
.tx-status {
    display: flex;
    align-items: center;
    font-weight: 500;
    &--failed {
        color: var(--page-tx-status-error-color);
    }
    &--success {
        color: var(--page-tx-status-success-color);
    }
    &__icon {
        margin-right: 5px;
        width: 16px;
        height: 16px;
        fill: currentColor;
    }
}
.tx-flow-schematics {
    display: flex;
    align-items: center;
    border: 1px solid var(--page-tx-flow-diagram-border-color);
    overflow: hidden;
    border-radius: 6px;
}
.tx-flow-schematics-step {
    display: flex;
    align-items: center;
    &__inner {
        padding: 4px 10px;
        display: flex;
        flex-direction: column;
    }
    &__phase {
        font-size: 12px;
    }
    &::after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        border-color: var(--page-tx-flow-diagram-border-color);
        border-width: 0 1px 1px 0;
        border-style: solid;
        transform: rotate(-45deg);
        margin: 0 8px 0 -28px;
        user-select: none;
        pointer-events: none;
    }
    &:last-child::after {
        display: none;
    }
}
</style>
