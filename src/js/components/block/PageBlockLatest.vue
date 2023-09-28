<template></template>

<script>
import { getLastBlock } from '~/api';

export default {
    created() {
        this.redirect().then(v => void v);
    },

    methods: {
        async redirect() {
            const { workchain, shard, seqno } = await getLastBlock();

            this.$router.replace({
                name: 'block',
                params: { workchain, shard, seqno,
                    lang: this.$i18n.locale,
                },
            }); 
        },
    },
};
</script>
