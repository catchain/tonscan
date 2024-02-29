<template>
    <t-row v-bind:gap="20">
        <t-col
            v-bind:cols="6"
            v-bind:tablet="6"
            v-bind:mobile="12"
            v-for="index in count"
            v-bind:key="index">
            <app-card is-loading class="apps-list__card"/>
        </t-col>
    </t-row>

</template>

<script>
import AppCard from '~/components/apps/List/AppCard.vue';

export default {
    name: 'AppsAppCardsSkeleton',

    props: {
        count: Number,
    },

    components: {
        AppCard,
    },
};
</script>

<style lang="scss" scoped>
  .apps-list__card {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 480px) {
    .apps-list__card {
      margin: 0 -16px;
      border-radius: 0;
      border-bottom: none;
    }

  }
</style>
