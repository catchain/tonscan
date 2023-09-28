<template>
    <tbody>
        <tr v-on:click="open()">
            <td>
                <ui-link class="tx-table-cell-icon"
                    v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                    v-bind:title="is_success ? undefined : $t('tx.error_icon_tooltip', [exitCode])"
                    v-bind:class="{ 'tx-table-cell-icon--error': !is_success || is_bounced }">
                    <icon-tx-bounced v-once v-if="is_bounced" fill="currentColor"/>
                    <icon-tx-chain v-once v-else-if="is_success" fill="none"/>
                    <icon-tx-error v-once v-else fill="currentColor"/>
                </ui-link>
            </td>
            <td>
                <ui-timeago class="tx-table__cell" v-bind:timestamp="timestamp"/>
            </td>
            <td>
                <div class="tx-table__cell tx-table__cell--align-right">
                    <span v-if="is_external" class="muted" v-text="$t('address.tx_table.external')"/>
                    <ui-address v-else
                        v-bind:address="sender"
                        v-bind:disabled="sender === address"
                        v-bind:type="source_type"
                        v-bind:alias="source_alias"/>
                </div>
            </td>

            <!-- Message direction (in/out/log): -->
            <td>
                <div class="tx-table__cell" style="padding: 0;">
                    <span v-if="is_service || is_log"
                        class="tx-table__badge tx-table__badge--service"
                        v-text="$t('address.tx_table.log')"/>

                    <span v-else-if="is_out"
                        class="tx-table__badge tx-table__badge--out"
                        v-text="$t('address.tx_table.output')"/>

                    <span v-else
                        class="tx-table__badge tx-table__badge--in"
                        v-text="$t('address.tx_table.input')"/>
                </div>
            </td>

            <!-- Receivers: -->
            <td>
                <div class="tx-table__cell">
                    <ui-link v-if="is_aggregated"
                        v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                        v-text="$tc('address.tx_table.address_count', outputCount)"/>

                    <template v-else-if="is_log">
                        {{$t('address.tx_table.nowhere')}}
                    </template>

                    <ui-address v-else
                        v-bind:address="receiver"
                        v-bind:disabled="receiver === address"
                        v-bind:type="destination_type"
                        v-bind:alias="destination_alias"/>
                </div>
            </td>

            <!-- Transaction value (TON amount or action): -->
            <td>
                <div class="tx-table__cell tx-table__cell--align-right" style="position: relative; padding-right: 26px;" v-bind:title="comment">
                    <action-badge
                        v-if="canShowActionBadge"
                        v-bind:action="action"
                        v-bind:amount="amount"
                        v-bind:op="op"
                        v-bind:meta="meta"
                        v-bind:from="from"
                        v-bind:to="to"/>

                    <template v-else>
                        <template v-if="is_service || is_external">N/A</template>
                        <template v-else>{{$ton(amount)}} TON</template>
                    </template>
                    
                    <icon-encrypted-message v-once class="tx-table-operation-icon" v-if="op == 0x2167da4b"/>
                    <icon-message v-once class="tx-table-operation-icon" v-if="comment"/>
                </div>
            </td>

            <!-- Expand chevron: -->
            <td>
                <div class="tx-table__cell">
                    <icon-expand class="tx-table-expand-caret" v-bind:class="{
                        'tx-table-expand-caret--expanded': isVisible,
                    }"/>
                </div>
            </td>
        </tr>

        <!-- Transaction extended details (accordeon block): -->
        <tr v-if="isVisible" class="tx-table-row-details">
            <td colspan="12">
                <div class="tx-table-inner-container">
                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.status')"/>
                        <template v-if="is_success">
                            {{$t('tx.exit_code_success', [exitCode])}}
                        </template>
                        <template v-else-if="is_bounced">
                            Bounced
                        </template>
                        <template v-else>
                            {{$t('tx.exit_code_error', [exitCode])}}
                        </template>
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.timestamp')"/>
                        {{dateTime.toLocaleString()}}
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.hash')"/>

                        <ui-copy-button v-bind:copy="txHash" v-bind:successMessage="$t('tx.hash_copy_success')">
                            {{txHash}}
                        </ui-copy-button>
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.lt')"/>

                        <ui-copy-button v-bind:copy="txLt" v-bind:successMessage="$t('tx.lt_copy_success')">
                            {{txLt}}
                        </ui-copy-button>
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.fee')"/>
                        {{$ton(fee)}} TON
                    </div>

                    <div v-if="comment" class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.message')"/>
                        {{comment}}
                    </div>

                    <!-- Encrypted message -->
                    <div v-if="op == 0x2167da4b" class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.message')"/>
                        <span class="muted" v-text="$t('tx.encrypted')"></span>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
import ActionBadge from './TxRowActionBadge.vue';
import IconTxError from '@primer/octicons/build/svg/alert-16.svg?inline';
import IconTxBounced from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconTxChain from '@img/icons/tonscan/chain-16.svg?inline';
import IconMessage from '@img/icons/tonscan/message-14.svg?inline';
import IconEncryptedMessage from '@img/icons/tonscan/encrypted-message.svg?inline';
import IconExpand from '@img/icons/tonscan/chevron-bottom-14.svg?inline';

export default {
    props: {
        address: String,
        date: String,
        from: String,
        is_service: Boolean,
        is_external: Boolean,
        is_aggregated: Boolean,
        is_success: Boolean,
        is_bounced: Boolean,
        outputCount: Number,
        to: String,
        amount: String,
        message: String,
        timestamp: Number,
        fee: String,
        txHash: String,
        txLt: String,
        exitCode: Number,
        op: [Number, String],
        source_type: String,
        destination_type: String,
        source_alias: String,
        destination_alias: String,
        action: Object,
        meta: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            isVisible: false,
        };
    },

    computed: {
        currentAccountContractType() {
            return this.is_out ? this.source_type : this.destination_type;
        },

        canShowActionBadge() {
            const isNftMessage = (this.action?.type || '').startsWith('nft:');

            // show nft badges only if they are opened on the wallet page:
            if (isNftMessage) {
                return this.currentAccountContractType === 'wallet';
            }

            return !!this.action;
        },

        sender() {
            // don't replace sender with decoded body data
            // unless we are on the wallet page:
            if (!this.canShowActionBadge) {
                return this.from;
            }

            switch (this.action?.type) {
                case 'jetton:transfer_notification':
                    return this.action.sender;
                    break;
                case 'nft:ownership_assigned':
                    return this.action.prev_owner;
                    break;
                default:
                    return this.from;
                    break;
            }
        },

        receiver() {
            // don't replace receiver with decoded body data
            // unless we are on the wallet page:
            if (!this.canShowActionBadge) {
                return this.to;
            }

            switch (this.action?.type) {
                case 'jetton:transfer':
                    return this.action.destination;
                    break;
                case 'nft:transfer':
                    return this.action.new_owner;
                    break;
                default:
                    return this.to;
                    break;
            }
        },

        comment() {
            return this.message || this.action?.forward_payload;
        },

        is_log() {
            return !this.to;
        },

        is_out() {
            return this.from == this.address;
        },

        txLinkRouteParams() {
            return {
                lt: this.txLt,
                hash: this.txHash,
                address: this.address,
            };
        },

        dateTime() {
            return new Date(this.timestamp);
        },
    },

    created() {
        this.$bus.$on('tx-close-all', () => this.isVisible = false);
    },

    beforeDestroy() {
        this.$bus.$off('tx-close-all');
    },

    methods: {
        open() {
            !this.isVisible && this.$bus.$emit('tx-close-all');
            this.isVisible = !this.isVisible;
        },
    },

    components: {
        ActionBadge, IconTxChain, IconTxError, IconMessage, IconEncryptedMessage, IconExpand, IconTxBounced,
    },
};
</script>
