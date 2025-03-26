<template>
  <div>
    <div>
      <ul class="args-list">
        <li class="args-item" v-for="(arg, index) in args" :key="index">
          <argument-input
            :value.sync="arg.value"
            :type.sync="arg.type"
          /> <x-circle @click="removeArgument(index)" class="item_remove-btn"/>
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
      args: [],
      result: "",
    }
  },
  watch: {
    defaultArgs(args) {
      this.args = [...args];
    }
  },
  methods: {
    addArgument() {
      this.args.push({
        type: "int"
      });
    },
    removeArgument(index) {
      this.args.splice(index, 1);
    },
    async execute() {
      console.log(this.returnTypes)
      this.result = await executeGetMethod({
        method: this.name,
        address: this.address,
        stack: this.args.map((arg) => [arg.type, arg.value])
      });
      console.log(this.result.length)
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
  align-items: center;
}

.item_remove-btn {
  cursor: pointer;
}

</style>