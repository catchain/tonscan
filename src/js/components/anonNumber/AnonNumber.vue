<template>
    <anon-number-tabs v-bind:address="address" />
</template>

<script>

import AnonNumberTabs from './AnonNumberTabs.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    components: {
        AnonNumberTabs
    },
};
</script>
