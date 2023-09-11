<template>
  <contract-tabs v-bind:tabs="tabs"  />
</template>
<script>
import ContractTabs from "~/components/address/Contract/ContractTabs.vue";
import Verifier from "~/components/address/Contract/Verifier.vue";
import GetMethods from "~/components/address/Contract/GetMethods.vue";

export default {
  props: {
    isActive: Boolean,
    address: {
      type: String,
      required: true,
    },
  },
  components: {
    ContractTabs
  },
  computed: {
      tabs(){
        return [{
          text: this.$t('address.contract.tabs.source'),
          key: "source",
          component: Verifier,
          props: {
            isActive: this.isActive,
            address: this.address
          }
        },
          {
            text: this.$t('address.contract.tabs.get_methods'),
            key: "get_methods",
            component: GetMethods,
            props: {
              isActive: this.isActive,
              address: this.address
            }
          }]
      }
  },
}
</script>