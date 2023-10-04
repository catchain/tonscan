<template>
  <input
    class="input"
    type="text"
    :value="value"
    @input="onInput"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    }
  }
}
</script>
<style lang="scss">
.input {
  border: none;
}
</style>