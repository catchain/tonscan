<template>
    <tbody>
        <tr v-on:click="open()">
            <td>
                <router-link class="tx-table-cell-icon"
                    v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                    v-bind:title="is_success ? undefined : $t('tx.error_icon_tooltip', [exitCode])"
                    v-bind:class="{ 'tx-table-cell-icon--error': !is_success || is_bounced }">
                    <icon-tx-bounced v-once v-if="is_bounced" fill="currentColor"/>
                    <icon-tx-chain v-once v-else-if="is_success" fill="none"/>
                    <icon-tx-error v-once v-else fill="currentColor"/>
                </router-link>
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
                        v-bind:type="source_type"/>
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
                    <router-link v-if="is_aggregated"
                        v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                        v-text="$tc('address.tx_table.address_count', outputCount)"/>

                    <template v-else-if="is_log">
                        {{$t('address.tx_table.nowhere')}}
                    </template>

                    <ui-address v-else
                        v-bind:address="receiver"
                        v-bind:disabled="receiver === address"
                        v-bind:type="destination_type"/>
                </div>
            </td>

            <!-- Transaction value (TON amount or action): -->
            <td>
                <div class="tx-table__cell tx-table__cell--align-right" style="position: relative; padding-right: 26px;" v-bind:title="message">
                    <template v-if="action">
                        <template v-if="[
                            'jetton:burn',
                            'jetton:burn_notification',
                            'jetton:transfer',
                            'jetton:transfer_notification',
                            'jetton:internal_transfer',
                        ].includes(action.type)">
                            <span v-if="action.type === 'jetton:burn'" class="tx-row-msg-action" v-bind:title="op">
                                <icon-burn class="tx-row-msg-action__icon"/> Burn
                            </span>

                            <span v-else-if="action.type === 'jetton:burn_notification'" class="tx-row-msg-action" v-bind:title="op">
                                <icon-confirmation class="tx-row-msg-action__icon"/> Burn
                            </span>

                            <span v-else-if="action.type === 'jetton:internal_transfer'" class="tx-row-msg-action" v-bind:title="op">
                                <icon-internal-transfer class="tx-row-msg-action__icon"/> Route
                            </span>

                            <ui-inline-jetton
                                v-bind:address="meta.jetton_address"
                                v-bind:value="action.amount"
                                v-bind="meta.jetton"/>
                        </template>

                        <!-- incoming NFT transfer: -->
                        <ui-inline-nft-item
                            v-else-if="action.type === 'nft:ownership_assigned'"
                            v-bind:address="from"/>

                        <!-- outgoing NFT transfer: -->
                        <ui-inline-nft-item
                            v-else-if="action.type === 'nft:transfer'"
                            v-bind:address="to"/>

                        <!-- incoming excesses: -->
                        <template v-else-if="action.type.endsWith(':excesses')">
                            <span class="tx-row-msg-action" v-bind:title="op">
                                <icon-excesses class="tx-row-msg-action__icon"/> Excess
                            </span>
                            {{$ton(amount)}} TON
                        </template>

                        <!-- nominator pool actions: -->
                        <template v-else-if="action.type.startsWith('pool:')">
                            <template v-if="action.type === 'pool:recover_stake'">
                                <span class="tx-row-msg-action" v-bind:title="op">
                                    <icon-unstake class="tx-row-msg-action__icon"/> Recover stake
                                </span>
                                {{$ton(amount, undefined, true)}} TON
                            </template>

                            <template v-else-if="action.type === 'pool:recover_stake_ok'">
                                <span class="tx-row-msg-action" v-bind:title="op">
                                    <icon-confirmation class="tx-row-msg-action__icon"/> Stake recovered
                                </span>
                                {{$ton(amount, undefined, true)}} TON
                            </template>

                            <template v-else-if="action.type === 'pool:new_stake'">
                                <span class="tx-row-msg-action" v-bind:title="op">
                                    <template v-if="amount > 5000000000">
                                        <icon-stake class="tx-row-msg-action__icon"/> Add stake
                                    </template>
                                    <template v-else>
                                        <icon-service-action class="tx-row-msg-action__icon"/> Push stake
                                    </template>
                                </span>

                                {{$ton(amount, undefined, true)}} TON
                            </template>

                            <template v-else-if="action.type === 'pool:new_stake_ok'">
                                <span class="tx-row-msg-action tx-row-msg-action--single" v-bind:title="op">
                                    <icon-confirmation class="tx-row-msg-action__icon"/> Stake accepted
                                </span>
                            </template>

                            <template v-else-if="action.type === 'pool:update_validator_set_hash'">
                                <span class="tx-row-msg-action" v-bind:title="op">
                                    <icon-service-action class="tx-row-msg-action__icon"/> Update validator
                                </span>
                                {{$ton(amount, undefined, true)}} TON
                            </template>

                            <template v-else-if="action.type === 'pool:process_withdraw_requests'">
                                <span class="tx-row-msg-action" v-bind:title="op">
                                    <icon-service-action class="tx-row-msg-action__icon"/> Process withdraws
                                </span>
                                {{$ton(amount, undefined, true)}} TON
                            </template>
                        </template>

                        <!-- unsupported action: display action name: -->
                        <template v-else>
                            <span class="tx-row-msg-action" v-bind:title="op">
                                <icon-service-action class="tx-row-msg-action__icon"/> {{action.type}}
                            </span>
                            {{$ton(amount)}} TON
                        </template>
                    </template>

                    <template v-else>
                        <template v-if="is_service || is_external">N/A</template>
                        <template v-else>{{$ton(amount)}} TON</template>
                    </template>

                    <icon-message v-once class="tx-table-operation-icon" v-if="message"/>
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

                    <div v-if="message" class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.message')"/>
                        {{message}}
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
import UiInlineJetton from './TxRowInlineJetton.vue';
import UiInlineNftItem from './TxRowInlineNft.vue';
import IconTxError from '@primer/octicons/build/svg/alert-16.svg?inline';
import IconTxBounced from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconTxChain from '@img/icons/tonscan/chain-16.svg?inline';
import IconMessage from '@img/icons/tonscan/message-14.svg?inline';
import IconExpand from '@img/icons/tonscan/chevron-bottom-14.svg?inline';
import IconExcesses from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconBurn from '@primer/octicons/build/svg/flame-16.svg?inline';
import IconServiceAction from '@primer/octicons/build/svg/tools-16.svg?inline';
import IconInternalTransfer from '@primer/octicons/build/svg/git-branch-16.svg?inline';
import IconConfirmation from '@primer/octicons/build/svg/check-circle-16.svg?inline';
import IconUnstake from '@primer/octicons/build/svg/sign-out-16.svg?inline';
import IconStake from '@primer/octicons/build/svg/sign-in-16.svg?inline';

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
        sender() {
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
        IconTxChain, IconTxError, IconMessage, IconExpand, IconTxBounced,
        IconExcesses, IconBurn, IconInternalTransfer, IconServiceAction, IconConfirmation, IconUnstake, IconStake,
        UiInlineJetton, UiInlineNftItem,
    },
};
</script>

<style lang="scss">
.tx-row-msg-action {
    font-size: 13px;
    display: flex;
    align-items: center;
    background: var(--card-row-separator);
    padding: 4px 8px 4px 6px;
    margin: -6px 8px;
    border-radius: 8px;
    cursor: help;
    &--single {
        margin-right: -1px;
    }
    &__icon {
        fill: currentColor;
        opacity: .6;
        margin-right: 6px;
    }
}
</style>
