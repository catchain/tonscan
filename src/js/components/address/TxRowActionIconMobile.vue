<template>
    <div style="height: 15px">
        <!-- nominator pool actions: -->
        <div v-if="action.type.startsWith('pool:')">
            <div v-if="action.type === 'pool:recover_stake'">
                <icon-unstake v-once fill="currentColor" />
            </div>

            <div v-else-if="action.type === 'pool:recover_stake_ok' || action.type === 'pool:new_stake_ok'">
                <icon-confirmation v-once fill="currentColor" />
            </div>

            <div v-else-if="action.type === 'pool:new_stake'">
                <div v-if="amount > 5000000000">
                    <icon-stake v-once fill="currentColor" />
                </div>
                <div v-else>
                    <icon-service-action v-once fill="currentColor" />
                </div>
            </div>

            <div
                v-else-if="action.type === 'pool:update_validator_set_hash' || action.type === 'pool:process_withdraw_requests'">
                <icon-service-action v-once fill="currentColor" />
            </div>
        </div>
        <icon-burn v-once v-else-if="action.type === 'jetton:burn' || action.type === 'jetton:burn_notification'"
            fill="currentColor" />
        <icon-internal-transfer v-once v-else-if="action.type === 'jetton:internal_transfer'" fill="currentColor" />
        <icon-in v-once
            v-else-if="action.type === 'nft:ownership_assigned' || action.type === 'jetton:transfer_notification'"
            fill="currentColor" />
        <icon-out v-once v-else-if="action.type === 'nft:transfer' || action.type === 'jetton:transfer'"
            fill="currentColor" />
        <icon-excesses v-once v-else-if="action.type.endsWith(':excesses')" fill="currentColor" />
        <icon-tx-chain v-else v-once fill="none" />
    </div>
</template>

<script>
import IconIn from '@img/icons/tonscan/in-24.svg?inline';
import IconOut from '@img/icons/tonscan/out-24.svg?inline';
import IconExcesses from '@primer/octicons/build/svg/iterations-16.svg?inline';
import IconBurn from '@primer/octicons/build/svg/flame-16.svg?inline';
import IconServiceAction from '@primer/octicons/build/svg/tools-16.svg?inline';
import IconInternalTransfer from '@primer/octicons/build/svg/git-branch-16.svg?inline';
import IconConfirmation from '@primer/octicons/build/svg/check-circle-16.svg?inline';
import IconUnstake from '@primer/octicons/build/svg/sign-out-16.svg?inline';
import IconStake from '@primer/octicons/build/svg/sign-in-16.svg?inline';
import IconTxChain from '@img/icons/tonscan/chain-no-padding-16.svg?inline';

export default {
    props: {
        action: Object,
        amount: String,
    },

    components: {
        IconExcesses, IconBurn, IconInternalTransfer, IconServiceAction, IconConfirmation, IconUnstake, IconStake, IconIn, IconOut, IconTxChain
    },
};
</script>