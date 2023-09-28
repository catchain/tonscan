<template>
    <span class="ui-inline-jetton">
        <span class="ui-inline-jetton__value" v-if="value !== undefined" v-text="$ton(value, decimals)"/>

        <ui-link class="ui-inline-jetton__link" v-bind:to="{ name: 'jetton', params: { address }}">
            {{ticker}}
            <ui-round-image v-if="showImage" size="tiny" class="ui-inline-jetton__avatar" v-bind:src="image_data || image.w72"/>
        </ui-link>
    </span>
</template>

<script>
export default {
    props: {
        showImage: Boolean,
        address: String,
        value: String,
        name: String,
        description: String,
        decimals: Number,
        verified: Boolean,
        symbol: String,
        image_data: String,
        image: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        ticker() {
            if (this.symbol && this.symbol.length < 10) {
                return this.symbol.replace(/[^\w\-]/gi, '').toUpperCase();
            }

            return this.address.substring(0, 3) + '…' + this.address.substring(45);
        },
    },
};
</script>

<style lang="scss">
.ui-inline-jetton {
    display: inline-flex;
    align-items: center;
    &__value {
        margin-right: 4px;
    }
    &__link {
        display: flex;
        align-items: center;
    }
    &__avatar {
        margin: -4px -1px -4px 6px;
        width: 20px;
        height: 20px;
    }
}
</style>
