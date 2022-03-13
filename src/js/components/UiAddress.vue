<template>
    <component v-once v-bind:is="component" class="address-link ui-looong"
        v-bind:class="{ clickable: !disabled }"
        v-bind:to="{ name: 'address', params: { address }}"
        v-bind:data-loopa="name.substr(0, 40)"
        v-bind:data-poopa="name.substr(40)"/>
</template>

<script>
export default {
    props: {
        address: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        component() {
            return this.disabled ? 'span' : 'router-link';
        },

        name() {
            return this.$store.getters.getAddressName(this.address);
        },
    },
};
</script>
