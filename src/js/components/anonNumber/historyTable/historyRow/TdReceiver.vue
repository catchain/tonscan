<template>
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
</template>


<script>
export default {
    props: {
        is_aggregated: Boolean,
        outputCount: Number,
        destination_type: String,
        address: String,
        action: Object,
        to: String,
        txLt: String,
        txHash: String,
    },

    computed: {
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

        txLinkRouteParams() {
            return {
                lt: this.txLt,
                hash: this.txHash,
                address: this.address,
            };
        },
    },
};
</script>
