<template>
    <div class="tx-history-wrap desktop-table">
        <table class="tx-table all-transactions-table">
            <thead>
                <tr>
                    <th v-pre width="40"></th>
                    <th>
                        <div class="tx-table__cell" v-text="$t('common.time')"/>
                    </th>
                    <th>
                        <div class="tx-table__cell tx-table__cell--align-right" v-text="$t('address.all_tx_table.sender')"/>
                    </th>
                    <th v-pre width="50"></th>
                    <th>
                        <div class="tx-table__cell" v-text="$t('address.all_tx_table.recipient')"/>
                    </th>
                    <th>
                        <div class="tx-table__cell tx-table__cell--align-right" v-text="$t('address.tx_table.value')"/>
                    </th>
                </tr>
            </thead>

            <tbody v-if="transactions">
                <tr v-for="tx in transactions" v-bind:key="tx.hash" class="new-row-animation">
                    <td>
                        <ui-link class="tx-table-cell-icon" v-bind:to="{ name: 'tx', params: { hash: tx.hash } }">
                            <icon-tx-chain fill="none"/>
                        </ui-link>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <ui-timeago v-bind:timestamp="tx.created_at * 1000"/>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <span v-if="tx.from === null" class="muted" style="text-transform: capitalize;"
                                v-text="$t('address.tx_table.external')"/>
                            <ui-address v-else v-bind:address="tx.from"/>
                        </div>
                    </td>
                    <td>
                        <span v-if="tx.is_service || is_log(tx.to)" class="tx-table__badge tx-table__badge--service"
                            v-text="$t('address.tx_table.log')"/>
                        <span v-else class="tx-table__badge tx-table__badge--service"
                            v-text="$t('address.all_tx_table.to')"/>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <span v-if="is_log(tx.to)"
                                v-text="$t('address.tx_table.nowhere')"/>
                            <ui-address v-else v-bind:address="tx.to"/>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <span v-if="tx.amount === null || tx.is_external" class="muted" v-text="$t('common.empty')"/>
                            <span v-else-if="tx.amount">{{ $ton(tx.amount) }} TON</span>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr v-for="i of 40">
                    <td>
                        <div class="tx-table__cell" style="padding-right: 0px;">
                            <span class="skeleton" style="width: 24px; height: 24px; border-radius: 4px"></span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <span class="skeleton">skeleton</span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <span class="skeleton" style="width: 100%;">skeleton</span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell" style="padding: 0 6px;">
                            <span class="skeleton" style="width: 46px; height: 25px; border-radius: 4px"></span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <span class="skeleton" style="width: 100%;">skeleton</span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <span class="skeleton">skeletonskeleton</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <mugen-scroll class="mugen-scroll" v-bind:handler="loadOldTransactions" v-bind:should-handle="shouldHandleScroll">
            <div ref="infiniteLoader" class="mugen-scroll__button" v-on:click="loadOldTransactions">
                <template v-if="isLoading">
                    {{$t('common.loading')}}
                </template>
                <template v-else>
                    {{$t('common.load_more')}}
                </template>
            </div>
        </mugen-scroll>
    </div>
</template>

<script>
import IconTxChain from '@img/icons/tonscan/chain-16.svg?inline';
import { getAllTransactions } from '~/api';
import MugenScroll from 'vue-mugen-scroll';

export default {
    timerHandle: undefined,

    props: {
        workchain: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            transactions: undefined,
            isLoading: false,
            // Whether to keep the size of the block table when new tx appear.
            // Default is true, so that the table won't grow indefinetely if user opens the page and leaves.
            // Should be set to false if user intentionally requests more tx (scrolls down or requests new page).
            truncateTransactionList: true,
        };
    },

    computed: {
        shouldHandleScroll() {
            return !this.isLoading;
        },
    },

    async created() {
        this.transactions = await getAllTransactions({
            wc: this.workchain,
            limit: 10,
        });

        this.$options.timerHandle = setInterval(() => this.loadNewTransactions(), 6000);
    },

    beforeDestroy() {
        clearInterval(this.$options.timerHandle);
    },

    methods: {
        async loadNewTransactions() {
            const lastTxTimestamp = this.transactions[0].created_at + 1;

            const newTxs = await getAllTransactions({
                wc: this.workchain,
                startUtime: lastTxTimestamp,
            });

            const uniqueTransactions = [];

            newTxs.forEach((tx) => {
                const alreadyHasReverseTx = uniqueTransactions.some((transaction) => {
                    return transaction.created_at === tx.created_at
                        && transaction.amount === tx.amount;
                });

                if (!alreadyHasReverseTx) {
                    uniqueTransactions.push(tx);
                }
            });

            this.transactions = uniqueTransactions
                .sort((a, b) => b.created_at - a.created_at)
                .concat(this.transactions);

            if (this.truncateTransactionList) {
                this.transactions.splice(32);
            }
        },

        async loadOldTransactions() {
            this.truncateTransactionList = false;
            this.isLoading = true;

            const firstTimestamp = this.transactions.at(-1).created_at - 1;

            const oldTxs = await getAllTransactions({
                wc: this.workchain,
                endUtime: firstTimestamp,
            });

            this.transactions = this.transactions.concat(oldTxs);
            this.isLoading = false;
        },

        getTime(timestamp) {
            timestamp = new Date(timestamp * 1000).toLocaleTimeString(this.$i18n.locale);
        },

        is_log(to) {
            return !to;
        },
    },

    components: {
        IconTxChain, MugenScroll,
    }
};
</script>

<style lang="scss">
.all-transactions-table {
    thead {
        background-color: var(--tx-table-thead-alt-background);
    }

    tr:last-child > td {
        border-bottom: 1px solid var(--card-border-color);
    }
}
</style>