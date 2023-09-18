<template>
  <div>
    <ui-select
        :modelValue="type"
        @update:modelValue="type = $event"
        :options="typeOptions"
    />
    <input v-model="value" />
  </div>
</template>
<script>
import UiSelect from "~/components/UiSelect.vue";

export default {
  props: {
    defaultType: String,
  },
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
  components: {
    UiSelect
  }
}
</script>