<template>
    <div class="t-chip">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'TChip',
    // props: {
    //   variant: {
    //     type: String,
    //     default: 'hot'
    //   }
    // },
    // computed: {
    //   chipVariant() {
    //     return `t-chip--${this.variant}`
    //   }
    // }
};
</script>

<style lang="scss" scoped>

 .t-chip {
   text-transform: uppercase;
   font-weight: 500;
   border-radius: 10px;
   display: flex;
   justify-content: center;
   //align-items: center;
   padding: 0 6px;
   height: 16px;
   font-size: 11px;
   line-height: 17px;
   vertical-align: middle;
 }

</style>
