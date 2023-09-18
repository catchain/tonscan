<template>
  <div>
    <div>
      <ul class="args-list">
        <li v-for="arg in args" :key="arg.name">
          <argument-input :defaultType="arg.type"/>
        </li>
      </ul>
    </div>
    <button class="args_btn" @click="addArgument">
      + {{$t('address.contract.methods.args_btn')}}
    </button>
    <button class="execute_btn" v-on:click="execute">
      {{$t('address.contract.methods.execute_btn')}}
    </button>
    {{result}}
  </div>
</template>
<script>
import {executeGetMethod} from "~/api/toncenter";
import ArgumentInput from "~/components/address/Contract/ArgumentInput.vue";

export default {
  props: {
    defaultArgs: Array,
    returnTypes: Array,
    name: String,
    address: String
  },
  data() {
    return {
      customArgs: [],
      result: ""
    }
  },
  computed: {
    args(){
      return [...this.defaultArgs, ...this.customArgs]
    }
  },
  methods: {
    async execute() {
      this.result = await executeGetMethod({
        method: this.name,
        address: this.address
      });
    },
    addArgument() {
      this.customArgs.push({})
    }
  },
  components: {
    ArgumentInput
  }
}
</script>
<style lang="scss">
.args-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>