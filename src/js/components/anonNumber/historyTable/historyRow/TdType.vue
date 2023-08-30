<template>
  <td>
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
