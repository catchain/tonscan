<template>
    <section>
        <jetton-wallet v-if="type === 'jetton_wallet' || skeletonHint === 'jetton_wallet'"
            v-bind:address="address"
            v-bind="props"/>

        <jetton-info v-else
            v-bind:address="address"
            v-bind="props"/>
    </section>
</template>

<script>
import { getJettonInfo } from '~/api';
import JettonWallet from './JettonWallet.vue';
import JettonInfo from './JettonInfo.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
        skeletonHint: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            type: undefined,
            props: undefined,
            activeTab: 'transactions',
        };
    },

    watch: {
        '$route': 'loadData',
    },

    created() {
        this.loadData();
    },

    methods: {
        reset() {
            this.props = undefined;
            this.type = undefined;
        },

        async loadData() {
            this.reset();
            const result = await getJettonInfo(this.address);

            switch (result.type) {
                case 'jetton_wallet':
                    let jettonMeta = result.jetton?.metadata;

                    // So that the component use the default prop:
                    if (!jettonMeta) {
                        jettonMeta = undefined;
                    }

                    this.props = Object.freeze({ ...result.jetton_wallet, jetton: jettonMeta });
                    this.type = 'jetton_wallet';
                    break;

                case 'jetton':
                    const metadata = result.jetton?.metadata || {};
                    this.props = Object.freeze({ ...result.jetton, ...metadata });
                    this.type = 'jetton';
                    break;

                default:
                    this.$bus.$emit('showToast', this.$t('jetton.error.redirect_invalid'));
                    this.$router.replace({
                        name: 'address',
                        params: { address: this.address },
                    });
                    break;
            }
        },
    },

    components: {
        JettonWallet, JettonInfo,
    },
};
</script>
