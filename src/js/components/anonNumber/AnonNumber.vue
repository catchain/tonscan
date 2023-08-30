<template>
    <anon-number-tabs v-bind:address="address" />
</template>

<script>
// http://localhost:3000/number/EQATGB84uZOVMCC-8vok4bckwzyglAgZ0RAAhFevEJq6qdCj#history
// https://getgems.io/nft/EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF
// https://getgems.io/nft/EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj

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
