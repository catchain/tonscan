<template>
  <section class="get-methods">
    <div class="select-wrapper">
      <ui-select :options="getMethods.map(item => ({
    text: item.name,
    value: item.name
    }))"
     v-model="selectedMethodName"
     :placeholder="$t('address.contract.methods.method_placeholder')"
      />
    </div>
    <method
        :defaultArgs="selectedMethod?.parameters"
        :returnTypes="selectedMethod?.returnTypes"
        :address="address"
        :name="selectedMethodName"
    />
  </section>
</template>
<script>
import UiSelect from "~/components/UiSelect.vue";
import Method from "~/components/address/Contract/Method.vue";
import {executeGetMethod} from "~/api/toncenter";

export default {
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedMethodName: null,
      result: null
    }
  },
  components: {
    UiSelect, Method
  },
  computed: {
    getMethods() {
      return this.$store.state.ContractsStore.getMethods;
    },
    selectedMethod() {
      return this.getMethods.find((method) => method.name === this.selectedMethodName);
    }
  },
}
</script>
<style lang="scss">
.get-methods {
  margin: 16px 12px;
}
.select-wrapper {
  width: 340px;
  margin-bottom: 10px;
}
.args_btn, .execute_btn {
  cursor: pointer;
  border-radius: 6px;
  padding: 10px 12px;

  border: 1px solid var(--code-viewer-file-selector-background-color);

  font-weight: 500;
  text-transform: uppercase;
}
.execute_btn {
  color: #FFF;
  background: var(--big-blue-button-background);
}
</style>