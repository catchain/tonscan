<template>
  <td>
      <router-link class="tx-table-cell-icon"
          v-bind:to="{ name: 'tx', params: txLinkRouteParams }"
          v-bind:title="is_success ? undefined : $t('tx.error_icon_tooltip', [exitCode])"
          v-bind:class="{ 'tx-table-cell-icon--error': !is_success || is_bounced }"
      >
          <icon-tx-bounced v-once v-if="is_bounced" fill="currentColor"/>
          <icon-tx-chain v-once v-else-if="is_success" fill="none"/>
          <icon-tx-error v-once v-else fill="currentColor"/>
      </router-link>
  </td>
</template>

<script>
import IconTxChain from '@img/icons/tonscan/chain-16.svg?inline';
import IconTxError from '@primer/octicons/build/svg/alert-16.svg?inline';
import IconTxBounced from '@primer/octicons/build/svg/iterations-16.svg?inline';

export default {
    props: {
        is_success: Boolean,
        is_bounced: Boolean,
        exitCode: Number,
        address: String,
        txHash: String,
        txLt: String,
    },

    computed: {
        txLinkRouteParams() {
            return {
                lt: this.txLt,
                hash: this.txHash,
                address: this.address,
            };
        },
    },

    components: {
        IconTxChain, IconTxError, IconTxBounced
    },
};
</script>