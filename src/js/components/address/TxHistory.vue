<template>
    <section>
        <div v-if="emptyHistory"
            class="tx-history-empty-panel"
            v-text="$t('address.tx_table.empty')"/>

        <div v-show="!emptyHistory" class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th v-pre width="40"></th>
                        <th width="100">
                            <div class="tx-table__cell"
                                v-text="$t('address.tx_table.age')"/>
                        </th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right"
                                v-text="$t('address.tx_table.from')"/>
                        </th>
                        <th v-pre width="50"></th>
                        <th>
                            <div class="tx-table__cell"
                                v-text="$t('address.tx_table.to')"/>
                        </th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right" style="padding-right: 26px;"
                                v-text="$t('address.tx_table.value')"/>
                        </th>
                        <th v-pre width="40">
                            <div class="tx-table__cell"></div>
                        </th>
                    </tr>
                </thead>

                <tbody v-show="!address || transactions.length == 0">
                    <tx-row-skeleton v-for="i in 8" v-bind:key="`tx_skeleton_${i}`"/>
                </tbody>

                <template v-if="address">
                    <template v-for="tx in transactions">
                        <template v-for="(msg, idx) in tx.messages">
                            <tx-row v-if="displayMsg(msg)"
                                v-bind:class="{ 'sub-list': idx > 0 }"
                                v-bind:address="address"
                                v-bind:key="`${tx.hash}_${idx}`"
                                v-bind:txHash="tx.hash"
                                v-bind:txLt="tx.lt"
                                v-bind:timestamp="tx.timestamp"
                                v-bind:fee="tx.fee"
                                v-bind:exitCode="tx.exit_code"
                                v-bind:outputCount="tx.output_count"
                                v-bind:action="msg.action"
                                v-bind:meta="msg.meta"
                                v-bind="msg"/>
                        </template>
                    </template>
                </template>
            </table>
        </div>

        <mugen-scroll class="mugen-scroll" v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll">
            <div ref="infiniteLoader" class="mugen-scroll__button" v-show="showPreloader" v-on:click="loadMore">
                <template v-if="isLoading">{{$t('common.loading')}}</template>
                <template v-else>{{$t('common.load_more')}}</template>
            </div>
        </mugen-scroll>
    </section>
</template>

<script>
import { getTransactionsByAddress } from '~/api/indexator.js';
import TxRowSkeleton from './TxRowSkeleton.vue';
import TxRow from './TxRow.vue';
import MugenScroll from 'vue-mugen-scroll';

export default {
    props: {
        address: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            transactions: [],
            isLoading: true,
            hasMore: true,
            emptyHistory: false,
            lastActivity: undefined,
        };
    },

    computed: {
        shouldHandleScroll() {
            return !this.isLoading
                && this.address
                && this.hasMore
                && this.transactions.length > 0;
        },

        showPreloader() {
            return this.address
                && this.transactions.length > 0
                && this.hasMore;
        },
    },

    watch: {
        address: {
            immediate: true,
            handler(address) {
                if (!address) return;

                this.transactions = [];
                this.isLoading = true;
                this.hasMore = true;
                this.emptyHistory = false;

                this.$nextTick(() => this.loadData());
            },
        },
    },

    activated() {
        this.emitLastActivity();
    },

    methods: {
        displayMsg(msg) {
            return !msg.is_external;
        },

        emitLastActivity() {
            this.$emit('lastActivityUpdate', this.lastActivity);
        },

        async loadData() {
            const transactions = await getTransactionsByAddress(this.address, { limit: 20 });

            this.transactions = transactions;
            this.emptyHistory = transactions.length === 0;
            this.hasMore = transactions.length >= 20;
            this.isLoading = false;

            // fix the latest timestamp so that the new transactions don't break offset+limit:
            this.lastActivity = transactions.length > 0
                ? this.transactions[0]?.timestamp
                : null;

            this.emitLastActivity();
        },

        async loadMore() {
            // Since the address prop can be undefined, the should-handle
            // prop may not be updated in time (delayed tick):
            if (!this.shouldHandleScroll || !this.$refs.infiniteLoader.offsetParent) { return; }

            this.isLoading = true;

            const limit = 50;
            const newTx = await getTransactionsByAddress(this.address, {
                limit: limit,
                offset: this.transactions.length,
                end_utime: this.lastActivity,
            });

            this.hasMore = newTx.length >= limit;
            this.isLoading = false;

            this.transactions = this.transactions.concat(newTx);
        },
    },

    components: {
        TxRow, TxRowSkeleton, MugenScroll,
    },
};
</script>
