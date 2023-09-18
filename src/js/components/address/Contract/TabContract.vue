<template>
  <contract-tabs v-bind:tabs="tabs"  />
</template>
<script>
import ContractTabs from "~/components/address/Contract/ContractTabs.vue";
import Verifier from "~/components/address/Contract/Verifier.vue";
import GetMethods from "~/components/address/Contract/GetMethods.vue";
import AddressFormats from "~/components/address/Contract/AddressFormats.vue";

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
  watch: {
    isActive: {
      immediate: true,
      // wait until we have address activity info:
      handler() {
        return this.loadSource();
      },
    },
    sources: {
      handler() {
        this.$store.dispatch("ContractsStore/parseSource");
      }
    }
  },
  methods: {
    loadSource() {
      if (this.isActive === undefined) {
        return;
      }

      if (this.isActive === false) {
        this.isLoading = false;
        this.isVerified = false;
        return;
      }
      this.$store.dispatch("ContractsStore/loadSource", this.address);
    }
  },
  computed: {
      sources() {
        return this.$store.state.ContractsStore.sources;
      },
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
            text: this.$t("address.contract.tabs.get_methods"),
            key: "get_methods",
            component: GetMethods,
            props: {
              isActive: this.isActive,
              address: this.address
            }
          }, {
          text: this.$t("address.contract.tabs.address_formats"),
            key: "address_formats",
            component: AddressFormats,
            props: {
              address: this.address
            }
          }]
      }
  },
}
</script>