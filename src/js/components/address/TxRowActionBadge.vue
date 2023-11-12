<template>
    <span v-once v-bind:title="op" class="tx-row-msg-action-badge">
        <!-- All excesses are displayed with the same badge: -->
        <template v-if="action.type.endsWith(':excesses')">
            <span class="tx-row-msg-action">
                <icon-excesses class="tx-row-msg-action__icon"/> Excess
            </span>

            {{$ton(amount)}} TON
        </template>

        <!-- jetton actions: -->
        <template v-else-if="[
            'jetton:burn',
            'jetton:burn_notification',
            'jetton:transfer',
            'jetton:transfer_notification',
            'jetton:internal_transfer',
        ].includes(action.type)">
            <!-- show badges only for burn and internal transfer: -->
            <span v-if="action.type === 'jetton:burn'" class="tx-row-msg-action">
                <icon-burn class="tx-row-msg-action__icon"/> Burn
            </span>

            <span v-else-if="action.type === 'jetton:burn_notification'" class="tx-row-msg-action">
                <icon-confirmation class="tx-row-msg-action__icon"/> Burn
            </span>

            <span v-else-if="action.type === 'jetton:internal_transfer'" class="tx-row-msg-action">
                <icon-internal-transfer class="tx-row-msg-action__icon"/> Route
            </span>

            <!-- always show jetton meta info: -->
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

        <!-- nominator pool actions: -->
        <template v-else-if="action.type.startsWith('pool:')">
            <template v-if="action.type === 'pool:recover_stake'">
                <span class="tx-row-msg-action">
                    <icon-unstake class="tx-row-msg-action__icon"/> Recover stake
                </span>

                {{$ton(amount, undefined, true)}} TON
            </template>

            <template v-else-if="action.type === 'pool:recover_stake_ok'">
                <span class="tx-row-msg-action">
                    <icon-confirmation class="tx-row-msg-action__icon"/> Stake recovered
                </span>

                {{$ton(amount, undefined, true)}} TON
            </template>

            <template v-else-if="action.type === 'pool:new_stake'">
                <span class="tx-row-msg-action">
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
                <span class="tx-row-msg-action tx-row-msg-action--single">
                    <icon-confirmation class="tx-row-msg-action__icon"/> Stake accepted
                </span>

                <!-- Don't show ton amount -->
            </template>

            <template v-else-if="action.type === 'pool:update_validator_set_hash'">
                <span class="tx-row-msg-action">
                    <icon-service-action class="tx-row-msg-action__icon"/> Update validator
                </span>

                {{$ton(amount, undefined, true)}} TON
            </template>

            <template v-else-if="action.type === 'pool:process_withdraw_requests'">
                <span class="tx-row-msg-action">
                    <icon-service-action class="tx-row-msg-action__icon"/> Process withdraws
                </span>

                {{$ton(amount, undefined, true)}} TON
            </template>
        </template>

        <!-- unsupported action: display action name: -->
        <template v-else>
            <span class="tx-row-msg-action">
                <icon-service-action class="tx-row-msg-action__icon"/> {{action.type}}
            </span>

            {{$ton(amount)}} TON
        </template>
    </span>
</template>

<script>
import UiInlineJetton from './TxRowInlineJetton.vue';
import UiInlineNftItem from './TxRowInlineNft.vue';
import IconExcesses from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconBurn from '@primer/octicons/build/svg/flame-16.svg?inline';
import IconServiceAction from '@primer/octicons/build/svg/tools-16.svg?inline';
import IconInternalTransfer from '@primer/octicons/build/svg/git-branch-16.svg?inline';
import IconConfirmation from '@primer/octicons/build/svg/check-circle-16.svg?inline';
import IconUnstake from '@primer/octicons/build/svg/sign-out-16.svg?inline';
import IconStake from '@primer/octicons/build/svg/sign-in-16.svg?inline';

export default {
    props: {
        action: Object,
        meta: Object,
        op: String,
        amount: String,
        from: String,
        to: String,
    },

    components: {
        IconExcesses, IconBurn, IconInternalTransfer, IconServiceAction, IconConfirmation, IconUnstake, IconStake,
        UiInlineJetton, UiInlineNftItem,
    },
};
</script>


<style lang="scss">
.tx-row-msg-action-badge {
    display: flex;
    align-items: center;
}
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
