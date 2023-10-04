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
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    }
  }
}
</script>
<style lang="scss" scoped>
.input {
  border: none;
  background: var(--body-light-muted-color);

  &:focus {
    border-color: #2575ed !important;
  }
  &::placeholder {
    color: #777;
  }
  &::-webkit-input-placeholder {
    color: #777;
  }
}
</style>