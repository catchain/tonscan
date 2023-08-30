<template>
  <td>
      {{this.stringifyPrice}}
  </td>
</template>

<script>
export default {
    props: {
      price: String,
    },
    computed: {
      stringifyPrice() {
        return this.price ? this.price / (10**9) : undefined
      }
    }
};
</script>
