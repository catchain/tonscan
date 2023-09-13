<template>
  <section class="get-methods">
    <input
        v-model.trim="methodName"
        type="text"
        class="method_input"
        v-bind:placeholder="$t('address.contract.methods.method_placeholder')">
    <button class="args_btn">
      + {{$t('address.contract.methods.args_btn')}}
    </button>
    <button class="execute_btn" v-on:click="execute">
      {{$t('address.contract.methods.execute_btn')}}
    </button>
  </section>
</template>
<script>
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
      methodName: null,
    }
  },
  computed: {
    getMethods() {
      this.$store.getters.getMethods;
    }
  },
  methods: {
    async execute() {
      const result = await executeGetMethod({
        method: this.methodName,
        address: this.address
      });
      console.log(result)
    }
  }
}
</script>
<style lang="scss">
.method_input {
  min-width: 340px;
  padding: 9px 34px 9px 36px;
  background: var(--body-light-muted-color);
  color: var(--body-text-color);
  border-radius: 6px;
  border: 2px solid transparent;
  transition: 0.2s all ease;
}
.get-methods {
  margin: 16px 12px;
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