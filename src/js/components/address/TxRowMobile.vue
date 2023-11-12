<template>
    <tbody>
        <tr>
            <!-- Transaction icon -->
            <td style="width: 47px;">
                <router-link class="tx-table-cell-icon" v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                    v-bind:title="is_success ? undefined : $t('tx.error_icon_tooltip', [exitCode])"
                    v-bind:class="{ 'tx-table-cell-icon--error': !is_success || is_bounced }">
                    <icon-tx-bounced v-once v-if="is_bounced" fill="currentColor" />
                    <action-icon-mobile v-else-if="action" v-bind:action="action" v-bind:amount="amount" />
                    <template v-else>
                        <template v-if="is_success">
                            <icon-out v-once v-if="is_out" fill="none" />
                            <icon-in v-once v-else fill="none" />
                        </template>
                        <icon-tx-error v-once v-else fill="currentColor" />
                    </template>
                </router-link>
            </td>

            <!-- Time and address -->
            <td style="max-width: 120px;">
                <ui-timeago v-bind:timestamp="timestamp" class="muted" style="font-size: 12px; margin-left: 7px;" />
                <div style="margin-left: 7px;">

                    <span v-if="is_external" class="muted" v-text="$t('address.tx_table.external')" />
                    <router-link v-if="is_aggregated" v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
                        v-text="$tc('address.tx_table.address_count', outputCount)" />

                    <template v-else-if="is_log">
                        {{ $t('address.tx_table.nowhere') }}
                    </template>

                    <ui-address v-else-if="!is_out" v-bind:address="sender" v-bind:type="source_type" />
                    <ui-address v-else v-bind:address="receiver" v-bind:type="destination_type" />
                </div>
            </td>

            <!-- Transaction value or action: -->
            <td>
                <action-badge-mobile v-if="action" v-bind:action="action" v-bind:amount="amount" v-bind:meta="meta"
                    v-bind:from="from" v-bind:to="to" v-bind:is_out="is_out" />

                <template v-else-if="is_service || is_external || is_log">
                    <div class="tx-table__cell tx-table__cell--align-right muted">
                        N/A
                    </div>
                </template>

                <template v-else>
                    <div class="tx-table__cell tx-table__cell--align-right" style="padding-left: 0;">
                        <div v-bind:class="{
                            'tx-amount--in': !is_out,
                            'tx-amount--out': is_out,
                        }">
                            {{ $ton(amount) }} TON
                        </div>
                    </div>
                    <div class="tx-table__cell tx-table__cell--align-right muted" style="padding-left: 0;">
                        ≈ <ui-fiat v-bind:tonValue="amount" />
                    </div>
                </template>
            </td>
        </tr>

        <!-- Encrypted message -->
        <tr v-if="op == 0x2167da4b">
            <td style="border-top: none;"></td>
            <td style="border-top: none;" colspan="2">
                <div class="tx-table__cell" style="padding-left: 7px;">
                    <div class="tx-msg-block">
                        <span class="muted" v-text="$t('tx.encrypted_message')"></span>
                    </div>
                </div>
            </td>
        </tr>

        <!-- Message block -->
        <tr v-if="message">
            <td style="border-top: none;"></td>
            <td style="border-top: none;" colspan="2">
                <div class="tx-table__cell" style="padding-left: 7px;">
                    <div class="tx-msg-block">
                        {{ message }}
                    </div>
                </div>
            </td>
        </tr>

    </tbody>
</template>

<script>
import ActionIconMobile from './TxRowActionIconMobile.vue';
import ActionBadgeMobile from './TxRowActionBadgeMobile.vue';
import IconTxError from '@primer/octicons/build/svg/alert-16.svg?inline';
import IconTxBounced from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconIn from '@img/icons/tonscan/in-24.svg?inline';
import IconOut from '@img/icons/tonscan/out-24.svg?inline';

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
        IconTxError, IconTxBounced, IconIn, IconOut, ActionIconMobile, ActionBadgeMobile
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
