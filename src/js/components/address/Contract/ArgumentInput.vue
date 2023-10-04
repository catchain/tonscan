<template>
  <div class="argument">
    <ui-select
      :editable="false"
      class="argument__type"
      v-model="type"
      :options="typeOptions"
    />
    <ui-input
      v-model="value"
    />
  </div>
</template>
<script>
import UiSelect from "~/components/UiSelect.vue";
import UiInput from "~/components/UiInput.vue";

export default {
  props: {
    defaultType: String,
  },
  events: ["updateType"],
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
      type: this?.defaultType || null,
      value: null
    }
  },
  watch: {
    type(oldValue) {
      this.$emit("updateType", oldValue);
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