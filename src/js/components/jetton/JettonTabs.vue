<script>
import IconList from '@img/icons/material-duotone/list.svg?inline';
import IconContract from '@img/icons/material-duotone/data-object.svg?inline';
import IconToken from '@img/icons/material-duotone/toll.svg?inline';
import TabContractSources from '../address/Verifier/Verifier.vue';
import JettonTabHolders from './JettonTabHolders.vue';
import TxHistory from '../address/TxHistory.vue';
import UiTabs from '~/components/UiTabs.vue';

export default {
    props: {
        isActive: Boolean,
        supply: String,
        decimals: Number,
        symbol: String,
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
                key: 'holders',
                text: this.$t('jetton.top_holders'),
                icon: IconToken,
                content: {
                    key,
                    component: JettonTabHolders,
                    props: {
                        address: this.address,
                        decimals: this.decimals,
                        supply: this.supply,
                        symbol: this.symbol,
                    },
                },
            }, {
                key: 'source',
                text: this.$t('address.tab_contract'),
                icon: IconContract,
                content: {
                    key,
                    component: TabContractSources,
                    props: {
                        address: this.address,
                        isActive: true,
                    },
                },
            }];
        },
    },
};
</script>
