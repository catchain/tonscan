<template>
  <tr class="tx-table-row-details">
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
</template>

<script>
export default {
    props: {
        is_success: Boolean,
        is_bounced: Boolean,
        exitCode: Number,
        txHash: String,
        txLt: String,
        fee: String,
        message: String,
        timestamp: Number,
    },

    computed: {
      dateTime() {
          return new Date(this.timestamp);
      },
    }
};
</script>
