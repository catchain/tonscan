<template>
    <div class="t-delimiter" v-bind:class="{ 't-delimiter--vertical': vertical }"></div>
</template>

<script>
export default {
    name: 'TDelimiter',
    props: {
        vertical: {
            type: Boolean,
            required: false,
            default: false,
        },
    // size: {
    //   type: String,
    //   required: false,
    //   default: false
    // }
    },
};
</script>

<style lang="scss" scoped>

  .t-delimiter {
    background: var(--card-border-color);
    height: 1px;

    &--vertical {
      height: 100%;
      width: 1px;
    }
  }

</style>
