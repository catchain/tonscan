<script>
import IconList from '@img/icons/material-duotone/list.svg?inline';
import IconContract from '@img/icons/material-duotone/data-object.svg?inline';
import IconNft from '@img/icons/material-duotone/view-in-ar.svg?inline';
import IconToken from '@img/icons/material-duotone/toll.svg?inline';
import TabUserNfts from './TabUserNfts.vue';
import TabUserTokens from './TabUserTokens.vue';
import TabContractSources from './Verifier/Verifier.vue';
import ContractInfo from './ContractInfo.vue';
import TxHistory from './TxHistory.vue';
import UiTabs from '~/components/UiTabs.vue';

export default {
    props: {
        isActive: Boolean,
        address: {
            type: String,
            required: true,
        },
    },

    render(createComponent) {
        return createComponent(UiTabs, {
            class: 'card card--tabbed',
            props: {
                tabs: this.tabs,
                changeUrlHash: true,
            },
            on: this.$listeners, // passthru listeners from parent
        });
    },

    computed: {
        tabs() {
            const props = { address: this.address };
            const key = this.address; // keepalive key

            return [{
                key: 'transactions',
                text: this.$t('address.tab_transactions'),
                icon: IconList,
                content: {
                    key, props,
                    eager: true,
                    component: TxHistory,
                },
            }, {
                key: 'nfts',
                text: this.$t('address.tab_nfts'),
                icon: IconNft,
                content: { key, props, component: TabUserNfts },
            }, {
                key: 'tokens',
                text: this.$t('address.tab_tokens'),
                icon: IconToken,
                content: { key, props, component: TabUserTokens },
            }, {
                key: 'source',
                text: this.$t('address.tab_contract'),
                icon: IconContract,
                content: {
                    key,
                    component: TabContractSources,
                    props: {
                        address: this.address,
                        isActive: this.isActive,
                    },
                },
            }];
        },
    },
};
</script>
