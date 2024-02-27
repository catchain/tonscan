<template>
    <div class="config-content-address">
        <p class="config-content-address__title">
            <wallet-icon class="config-content-address__icon" v-once />
            {{ $t('config.explore_address') }}
        </p>
        <div class="config-address-items">
            <ui-address v-bind:address="address" v-bind:hide-name="true" /><ui-copy-button v-bind:copy="address" hide-name="true" />
        </div>
    </div>
</template>

<script>
import WalletIcon from '@img/icons/tonscan/wallet.svg?inline';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    components: {
        WalletIcon,
    },
};
</script>

<style lang="scss">
.config-content-address {
  &__title {
    margin-bottom: 6px;
    font-weight: bold;
    text-transform: uppercase;
  }

  &__icon {
    width: 14px;
    height: 14px;
    transform: translateY(1px);
    margin-right: 3px;
  }
}

.config-address-items {
  display: flex;
  align-items: center;
}
</style>
