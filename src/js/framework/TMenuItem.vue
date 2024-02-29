<template>
    <div class="t-menu__item">
        <div class="t-menu__item-content">
            <component v-bind:is="icon" v-if="!isListItem"></component>
            {{ title }}
        </div>
        <div class="t-menu__item-selected" v-if="!isListItem">
            {{ selectedSubItem }}
            <icon-currency></icon-currency>
        </div>
    </div>
</template>

<script>
import IconCurrency from '@img/icons/tonscan/arrow-right.svg?vue';

export default {
    name: 'TMenuItem',
    components: {
        IconCurrency,
    },
    props: {
        title: {
            type: String,
        },
        icon: {
            type: null,
        },
        isListItem: {
            type: Boolean,
        },
        selectedSubItem: {
            type: String,
        },
    },
};
</script>

<style lang="scss" scoped>

  .t-menu__item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--card-border-color);
    padding: 12px 16px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    &-selected {
      color: var(--selected-big-text);
      display: flex;
      align-items: center;
    }

    &-content {
      display: flex;
      align-items: center;

      & svg {
        color: var(--selected-big-text);
        margin-right: 12px;
      }
    }
  }

</style>
