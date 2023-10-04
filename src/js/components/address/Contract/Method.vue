<template>
  <div>
    <div>
      <ul class="args-list">
        <li class="args-item" v-for="(arg, index) in args" :key="index">
          <argument-input
              @updateType="arg.type = $event"
              :defaultType="arg.type"
          /> <x-circle @click="removeArgument(index)"/>
        </li>
      </ul>
    </div>
    <button class="args_btn" @click="addArgument">
      + {{$t('address.contract.methods.args_btn')}}
    </button>
    <button class="execute_btn" v-on:click="execute">
      {{$t('address.contract.methods.execute_btn')}}
    </button>
    <div>
      {{result}}
    </div>
  </div>
</template>
<script>
import {executeGetMethod} from "~/api/toncenter";
import ArgumentInput from "~/components/address/Contract/ArgumentInput.vue";
import XCircle from "@primer/octicons/build/svg/x-circle-16.svg";

export default {
  props: {
    defaultArgs: {
      type: Array,
      default: []
    },
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
    },
  },
  methods: {
    addArgument() {
      this.customArgs.push({})
    },
    removeArgument(index) {
      this.customArgs.splice(index, 1);
    },
    async execute() {
      this.result = await executeGetMethod({
        method: this.selectedMethodName,
        address: this.address,
      });
    },
  },
  components: {
    ArgumentInput, XCircle
  }
}
</script>
<style lang="scss">
.args-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.args-item {
  display: flex;
}

</style>