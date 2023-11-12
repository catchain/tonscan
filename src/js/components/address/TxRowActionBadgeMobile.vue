<template>
    <div>
        <div class="tx-table__cell tx-table__cell--align-right" style="padding-left: 0;">
            <template v-if="[
                'jetton:burn',
                'jetton:burn_notification',
                'jetton:transfer',
                'jetton:transfer_notification',
                'jetton:internal_transfer',
            ].includes(action.type)">

                <div style="margin-right: 2px;">
                    <span v-if="!is_out">+</span>
                    <span v-else>−</span>
                </div>
                <ui-inline-jetton v-bind:address="meta.jetton_address" v-bind:value="action.amount" v-bind="meta.jetton" />
            </template>

            <!-- incoming NFT transfer: -->
            <ui-inline-nft-item v-else-if="action.type === 'nft:ownership_assigned'" v-bind:address="from" />

            <!-- outgoing NFT transfer: -->
            <ui-inline-nft-item v-else-if="action.type === 'nft:transfer'" v-bind:address="to" />

            <!-- nominator pool actions: -->
            <template v-else-if="action.type.startsWith('pool:')">
                <template v-if="action.type === 'pool:new_stake_ok'">
                    <span class="tx-row-msg-action tx-row-msg-action--single">
                        Stake accepted
                    </span>
                </template>
                <template v-else>
                    {{ $ton(amount, undefined, true) }} TON
                </template>
            </template>

            <template v-else class="muted">
                {{ $ton(amount) }} TON
            </template>
        </div>

        <div class="tx-table__cell tx-table__cell--align-right muted" style="font-size: 12px; padding-left: 0;">
            <span v-if="action.type.endsWith(':excesses')">
                Excess
            </span>

            <!-- nominator pool actions: -->
            <template v-else-if="action.type.startsWith('pool:')">
                <template v-if="action.type === 'pool:recover_stake'">
                    Recover stake
                </template>

                <template v-else-if="action.type === 'pool:recover_stake_ok'">
                    Stake recovered
                </template>

                <template v-else-if="action.type === 'pool:new_stake'">
                    <template v-if="amount > 5000000000">
                        Add stake
                    </template>
                    <template v-else>
                        Push stake
                    </template>
                </template>

                <template v-else-if="action.type === 'pool:update_validator_set_hash'">
                    Update validator
                </template>

                <template v-else-if="action.type === 'pool:process_withdraw_requests'">
                    Process withdraws
                </template>
            </template>

            <!-- Jetton actions -->
            <template v-else-if="[
                'jetton:burn',
                'jetton:burn_notification',
                'jetton:transfer',
                'jetton:transfer_notification',
                'jetton:internal_transfer',
            ].includes(action.type)">

                <span v-if="action.type === 'jetton:burn' || action.type === 'jetton:burn_notification'">
                    Burn
                </span>
                <template v-else>
                    <span v-if="is_out">
                        Transferred
                    </span>
                    <span v-else>
                        Received
                    </span>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import UiInlineJetton from './TxRowInlineJetton.vue';
import UiInlineNftItem from './TxRowInlineNft.vue';

export default {
    props: {
        action: Object,
        amount: String,
        is_out: Boolean,
        meta: {
            type: Object,
            default: () => ({}),
        },
        from: String,
        to: String
    },
    components: {
        UiInlineJetton, UiInlineNftItem,
    }
};
</script>