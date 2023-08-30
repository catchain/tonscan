<template>
  <td class="tx-table__cell tx-table__cell--align-right">
      {{ $t(`nft.item.${this.type}`) }}
  </td>
</template>

<script>
export default {
    props: {
        type: String,
    },
};
</script>
