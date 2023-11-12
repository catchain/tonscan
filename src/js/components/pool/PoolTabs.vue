<script>
import UiTabs from '~/components/UiTabs.vue';
import IconVote from '@img/icons/material-duotone/how-to-vote.svg?inline';
import IconNominators from '@img/icons/material-duotone/groups.svg?inline';
import IconList from '@img/icons/material-duotone/list.svg?inline';
import IconContract from '@img/icons/material-duotone/data-object.svg?inline';
import TabVotings from './TabVotings.vue';
import TabNominatorList from './TabNominatorList.vue';
import TabContractSources from '../address/Verifier/Verifier.vue';
import TxHistory from '../address/TxHistory.vue';

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
            style: { marginTop: '18px' },
            on: this.$listeners, // passthru listeners from parent
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
                text: this.$t('nominator_pool.tab_transactions'),
                icon: IconList,
                content: {
                    key, props,
                    eager: true,
                    component: TxHistory,
                },
            }, {
                key: 'nominators',
                text: this.$t('nominator_pool.tab_nominators'),
                icon: IconNominators,
                content: {
                    key, props,
                    component: TabNominatorList,
                    eager: true,
                },
            }, {
                key: 'votings',
                text: this.$t('nominator_pool.tab_votings'),
                icon: IconVote,
                content: {
                    key, props,
                    component: TabVotings,
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