<template>
  <section class="formats">
    <div class="info">
      <div>
        <span v-text="$t('address.contract.address_formats.hex')"></span>
        <ui-copy-button
            v-bind:successMessage="$t('address.info.copy_success')"
            v-bind:copy="address">
          {{hex}}
        </ui-copy-button>
      </div>
      <div>
        <span v-text="$t('address.contract.address_formats.non_bounceable')"></span>
        <ui-copy-button
            v-bind:successMessage="$t('address.info.copy_success')"
            v-bind:copy="address">
          {{nonBounceable}}
        </ui-copy-button>
      </div>
    </div>
  </section>
</template>
<script>
import TonWeb from "tonweb";

export default {
  props: {
    address: {
      required: true,
      type: String
    }
  },
  computed: {
    hex() {
      return new TonWeb.Address(this.address).toString(false)
    },
    nonBounceable() {
      return new TonWeb.Address(this.address).toString(true, true, false)
    }
  }
}
</script>
<style lang="scss" scoped>
.formats {
  margin: 16px 12px;
}
.info {
  display: flex;
  flex-direction: column;
}
</style>