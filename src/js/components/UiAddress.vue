<template>
    <component v-once v-on:click.native.stop v-bind:is="component" class="address-link ui-looong"
        v-bind:class="{ clickable: !isDisabled, muted: !address }"
        v-bind:to="routerParams"
        v-bind:data-loopa="name.substr(0, 40)"
        v-bind:data-poopa="name.substr(40)"/>
</template>

<script>
export default {
    props: {
        address: {
            required: false,
        },

        type: String,

        // Whether the address is clickable:
        disabled: {
            type: Boolean,
            default: false,
        },

        // Whether to show human readable name:
        hideName: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        component() {
            return this.isDisabled ? 'span' : 'router-link';
        },

        routerParams() {
            switch (this.type) {
                case 'nominator_pool':
                    return {
                        name: 'nominator',
                        params: { address: this.address },
                    };
                    break;

                default:
                    return {
                        name: 'address',
                        params: { address: this.address },
                    };
                    break;
            }
        },

        isDisabled() {
            return this.disabled || !this.address;
        },

        name() {
            if (!this.address) {
                return 'empty';
            }

            return this.hideName
                ? this.address
                : this.$store.getters.getAddressName(this.address);
        },
    },
};
</script>
