<template>
    <section>
        <section v-if="isInvalid">
            <div class="alert" v-text="$t('error.invalid_address')"/>
        </section>
    </section>
</template>

<script>
import { matchAddress } from '~/search.js';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            isInvalid: false,
        };
    },

    async created() {
        const match = await matchAddress(this.address);

        if (! match) {
            return (this.isInvalid = true);
        }

        this.$router.replace({
            name: 'address',
            params: {
                address: match,
                lang: this.$i18n.locale,
            },
        });
    },
};
</script>
