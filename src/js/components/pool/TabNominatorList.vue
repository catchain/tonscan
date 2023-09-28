<template>
    <section>
        <div v-if="isEmpty"
            class="tx-history-empty-panel"
            v-text="$t('nominator_pool.nominator_table_empty')"/>

        <!-- Showing plain text instead of the skeleton: -->
        <div v-else-if="isLoading"
            class="tx-history-empty-panel"
            v-text="$t('common.loading')"/>

        <div v-show="!isEmpty && !isLoading" class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th><div class="tx-table__cell" v-text="$t('common.address')"/></th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$t('nominator_pool.nominator_table_stake')}}
                            </div>
                        </th>
                        <th><div class="tx-table__cell" v-text="$t('nominator_pool.nominator_table_pie')"/></th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$t('nominator_pool.nominator_table_pending')}}
                            </div>
                        </th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$t('nominator_pool.nominator_table_withdrawal')}}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="nominator in nominators">
                        <td>
                            <div class="tx-table__cell">
                                <ui-address v-bind:address="nominator.address"/>
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$ton(nominator.amount)}} TON
                            </div>    
                        </td>
                        <td>
                            <div class="tx-table__cell">
                                {{ Math.round(nominator.weight * 100 * 1000) / 1000 }}%
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$ton(nominator.pending_deposit_amount)}} TON
                            </div>    
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{ nominator.withdraw_requested ? $t('common.yes') : $t('common.no') }}
                            </div>    
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import { getNominatorPoolNominators } from '~/api';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            nominators: [],
            isLoading: true,
        };
    },

    computed: {
        isEmpty() {
            // If the data is loaded, but the list is empty, then there're no nominators:
            return !this.isLoading && this.nominators.length === 0;
        },
    },

    watch: {
        address: {
            immediate: true,
            handler(address) {
                if (!address) return;

                this.nominators = [];
                this.isLoading = true;

                this.$nextTick(() => this.loadData());
            },
        }
    },

    methods: {
        loadData() {
            getNominatorPoolNominators(this.address).then((info) => {
                this.nominators = info.nominators.map(Object.freeze);
                this.$emit('totalStakeUpdated', info);
            }).catch(console.error).then(() => {
                this.isLoading = false;
            });
        },
    },
};
</script>
