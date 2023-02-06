<template>
    <section>
        <div v-show="!isEmpty" class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th><div class="tx-table__cell" v-text="$t('common.address')"/></th>
                        <th><div class="tx-table__cell" v-text="$t('address.tokens.table_token_balance')"/></th>
                        <th><div class="tx-table__cell tx-table__cell--align-right" v-text="'Pie'"/></th>
                    </tr>
                </thead>

                <tbody v-if="isLoading">
                    <tr v-for="i in 5">
                        <td v-pre>
                            <div class="tx-table__cell">
                                <span class="skeleton">SomeCoolBouncableAddress</span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell">
                                <span class="skeleton">1000000</span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                <span class="skeleton">100.00%</span>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr v-for="holder in holders">
                        <td>
                            <div class="tx-table__cell">
                                <ui-address v-bind:address="holder.holder_address"/>
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell">
                                {{$ton(holder.balance, decimals)}}
                                <span style="margin-left: 4px; opacity: 0.5;" v-text="symbol"/>
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{(holder.balance / supply * 100).toFixed(2)}}%
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import { getJettonHolders } from '~/api/extenderContracts.js';

export default {
    props: {
        address: String,
        decimals: Number,
        supply: String,
        symbol: String,
    },

    data() {
        return {
            holders: [],
            isLoading: true,
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            getJettonHolders(this.address).then(({ holders, total }) => {
                this.holders = Object.freeze(holders);
                this.isLoading = false;
            });
        },
    },
};
</script>
