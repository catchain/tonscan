<template>
    <div class="info__item">
        <div class="item__name">
            {{ title }}
        </div>
        <div class="item__value">
            <slot v-if="!loading"></slot>
            <t-skeleton-loader
                v-else
                type="paragraph"
                width="120px"
                height="24px"
                border-radius="32px"
            ></t-skeleton-loader>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppInfoItem',
    props: {
        title: {
            type: null,
        },
        loading: {
            type: Boolean,
        },
    },
};
</script>

<style lang="scss" scoped>

.item__name {
  color: var(--app-info-name);
  font-weight: 400;
}

.item__value {
  margin-top: 8px;
  font-weight: 500;

  .value-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  & svg {
    color: var(--icon-color);
    width: 16px;
    height: 16px;

    &:hover {
      color: var(--icon-hover-color);
    }
  }
}

</style>
