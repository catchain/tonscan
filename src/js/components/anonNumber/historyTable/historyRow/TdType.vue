<template>
  <td>
    <div class="tx-table__cell tx-table__cell--align-right">
        {{ $t(`nft.item.${this.type}`) }}
    </div>
  </td>
</template>

<script>
export default {
    props: {
        type: String,
    },
};
</script>
