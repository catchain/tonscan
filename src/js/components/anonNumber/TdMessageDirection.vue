<template>
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
</template>

<script>
export default {
    props: {
        is_service: Boolean,
        from: String,
        to: String,
        address: String,
    },

    computed: {
        is_log() {
            return !this.to;
        },
        is_out() {
            return this.from == this.address;
        },
    },
};
</script>