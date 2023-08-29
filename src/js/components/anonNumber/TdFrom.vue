<template>
  <td>
      <div class="tx-table__cell tx-table__cell--align-right">
          <span v-if="is_external" class="muted" v-text="$t('address.tx_table.external')"/>
          
          <ui-address v-else
              v-bind:address="sender"
              v-bind:disabled="sender === address"
              v-bind:type="source_type"/>
      </div>
  </td>
</template>

<script>
export default {
    props: {
      address: String,
      from: String,
      is_external: Boolean,
      source_type: String,
      action: Object,
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
    },
};
</script>