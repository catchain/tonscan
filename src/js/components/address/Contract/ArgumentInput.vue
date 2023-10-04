<template>
  <div class="argument">
    <ui-select
      :editable="false"
      class="argument__type"
      :value="type"
      :options="typeOptions"
      @input="onSelectType"
    />
    <ui-input
      @input="onInputValue"
      :value="value"
    />
  </div>
</template>
<script>
import UiSelect from "~/components/UiSelect.vue";
import UiInput from "~/components/UiInput.vue";

export default {
  props: {
    type: String,
    value: String,
  },
  events: ["update:type", "update:value"],
  data() {
    return {
      typeOptions: [{
        value: "int",
        text: "Number"
      }, {
        value: "slice",
        text: "Slice"
      }, {
        value: "cell",
        text: "Cell"
      }],
    }
  },
  methods: {
    onSelectType(type) {
      this.$emit("update:type", type);
    },
    onInputValue(value) {
      this.$emit("update:value", value);
    }
  },
  components: {
    UiSelect, UiInput
  }
}
</script>
<style lang="scss">
.argument {
  display: flex;

  &__type {
    width: 100px !important;
  }
}
</style>