<script>
import IconList from '@img/icons/material-duotone/list.svg?inline';
import IconContract from '@img/icons/material-duotone/data-object.svg?inline';
import TabContractSources from '../address/Verifier/Verifier.vue';
import HistoryTable from './historyTable/HistoryTable.vue';
import TxHistory from '../address/TxHistory.vue';
import UiTabs from '~/components/UiTabs.vue';

export default {
    props: {
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
                key: 'history',
                text: this.$t('address.tab_history'),
                icon: IconList,
                content: {
                    key, props,
                    eager: true,
                    component: HistoryTable,
                },
            },{
                key: 'transactions',
                text: this.$t('address.tab_transactions'),
                icon: IconList,
                content: {
                    key, props,
                    eager: true,
                    component: TxHistory,
                },
            }, 
            {
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
