<template>
  <td class="tx-table__cell tx-table__cell--align-right">
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
