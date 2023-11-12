<template>
    <section>
        <section>
            <div class="card">
                <div class="card-title">
                    <span v-if="isMasterChain" v-text="$t('block.masterchain_block_title')"/>
                    <span v-else v-text="$t('block.shardchain_block_title')"/>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name" v-text="$t('tx.workchain')"/>
                    <div class="card-row__value" v-text="workchain"/>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name" v-text="$t('tx.shard')"/>
                    <div class="card-row__value" v-text="shard"/>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name" v-text="$t('tx.seqno')"/>
                    <div class="card-row__value" v-text="seqno"/>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name">LT</div>
                    <div class="card-row__value">
                        <span v-if="block.start_lt">{{block.start_lt}} ... {{block.end_lt}}</span>
                        <span v-else class="skeleton">00000000000000 ... 00000000000000</span>
                    </div>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name">Root hash</div>
                    <div class="card-row__value">
                        <span v-if="block.id" v-text="block.id.root_hash"/>
                        <span v-else class="skeleton">zMLQwaoiatVZRJ0PY019KkbRoJYQjNS6azjpVNbMsOQ=</span>
                    </div>
                </div>

                <div class="card-row card-row--wide">
                    <div class="card-row__name">File hash</div>
                    <div class="card-row__value">
                        <span v-if="block.id" v-text="block.id.file_hash"/>
                        <span v-else class="skeleton">zMLQwaoiatVZRJ0PY019KkbRoJYQjNS6azjpVNbMsOQ=</span>
                    </div>
                </div>    

                <div v-show="boringFieldsVisible">
                    <div class="card-row card-row--wide" v-for="field in boringFields">
                        <div class="card-row__name" v-text="field"/>
                        <div class="card-row__value" v-text="block[field]"/>
                    </div>
                </div>

                <div v-if="!boringFieldsVisible" class="card-row card-row--wide">
                    <div class="card-row__name">
                        <div class="block-boring-expand" v-on:click="boringFieldsVisible = true">
                            {{$t('block.show_details', [boringFields.length])}}

                            <svg v-pre xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" d="m1.5 4.75 5.5 5.5 5.5-5.5"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="block-nav">
                <div v-show="hasPrevBlocks" class="block-nav__vcontainer">
                    <ui-link class="block-nav__pill block-nav__pill--prev"
                        v-for="prev in block.prev_blocks"
                        v-bind:key="prev.file_hash"
                        v-bind:to="{ name: 'block', params: {
                            workchain: prev.workchain,
                            shard: prev.shard,
                            seqno: prev.seqno,
                        }}">
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        {{$t('block.nav.prev')}}
                    </ui-link>
                </div>

                <div v-show="!hasPrevBlocks">
                    <div class="block-nav__pill block-nav__pill--prev block-nav__pill--disabled">
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        {{$t('block.nav.prev')}}
                    </div>
                </div>

                <div v-if="isMasterChain" class="block-nav__hcontainer">
                    <ui-link class="block-nav__pill block-nav__pill--next" v-bind:to="{ name: 'block', params: nextBlockLinkParams }">
                        {{$t('block.nav.next')}}
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                        </svg>
                    </ui-link>

                    <span class="block-nav__pill block-nav__pill--next" v-on:click="goToLatestBlock">
                        {{$t('block.nav.latest')}}
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <polygon points="6.41,6 5,7.41 9.58,12 5,16.59 6.41,18 12.41,12"/><polygon points="13,6 11.59,7.41 16.17,12 11.59,16.59 13,18 19,12"/>
                        </svg>
                    </span>
                </div>
            </div>

            <div v-if="isMasterChain" class="card">
                <div class="card-title" v-text="$t('block.shardchain_blocks_title')"/>
                <div class="tx-history-wrap">
                    <table class="tx-table">
                        <thead>
                            <tr>
                                <th v-pre width="40"></th>
                                <th width="110">
                                    <div class="tx-table__cell tx-table__cell--align-center" v-text="$t('tx.workchain')"/>
                                </th>
                                <th><div class="tx-table__cell" v-text="$t('tx.shard')"/></th>
                                <th><div class="tx-table__cell" v-text="$t('tx.seqno')"/></th>
                            </tr>
                        </thead>

                        <tbody v-show="shards === undefined">
                            <shard-skeleton v-for="i in 5" v-bind:key="`shard_skeleton_${i}`"/>
                        </tbody>

                        <tr v-for="shard in shards">
                            <td>
                                <ui-link class="tx-table-cell-icon" v-bind:to="{ name: 'block', params: {
                                    workchain: shard.workchain,
                                    shard: shard.shard,
                                    seqno: shard.seqno,
                                }}">
                                    <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="1.3" d="M7.665 9.301c-.155-.067-.338-.206-.549-.417a2.6 2.6 0 0 1 0-3.677l1.768-1.768a2.6 2.6 0 0 1 3.677 3.677l-1.167 1.167m-3.06-1.584c.156.067.339.206.55.417a2.6 2.6 0 0 1 0 3.677l-1.768 1.768A2.6 2.6 0 1 1 3.44 8.884l1.167-1.167"/>
                                    </svg>
                                </ui-link>
                            </td>
                            <td>
                                <div class="tx-table__cell tx-table__cell--align-center" v-text="shard.workchain"/>
                            </td>
                            <td>
                                <div class="tx-table__cell" v-text="shard.shard"/>
                            </td>
                            <td>
                                <div class="tx-table__cell" v-text="shard.seqno"/>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-title" v-text="$t('block.transactions_title')"/>

                <div v-if="txHistoryEmpty" class="tx-history-empty-panel" v-text="$t('address.tx_table.empty')"/>

                <div v-show="!txHistoryEmpty" class="tx-history-wrap">
                    <table class="tx-table">
                        <thead>
                            <tr>
                                <th v-pre width="40"></th>
                                <th width="110">
                                    <div class="tx-table__cell tx-table__cell--align-center">Seqno</div>
                                </th>
                                <th><div class="tx-table__cell" v-text="$t('tx.account')"/></th>
                                <th><div class="tx-table__cell" v-text="$t('tx.lt')"/></th>
                                <th><div class="tx-table__cell" v-text="$t('tx.hash')"/></th>
                            </tr>
                        </thead>

                        <tbody v-show="txHistoryLoading">
                            <tx-skeleton v-for="i in 5" v-bind:key="`tx_skeleton_${i}`"/>
                        </tbody>

                        <tx-row v-for="tx, seqno in transactions" v-bind="tx" v-bind:key="tx.hash" v-bind:seqno="seqno"/>
                    </table>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import { getBlockHeader, getBlockTransactions, getShards, getLastBlock } from '~/api';
import ShardSkeleton from './BlockShardSkeleton.vue';
import TxSkeleton from './BlockTxSkeleton.vue';
import TxRow from './BlockTxRow.vue';

export default {
    props: {
        workchain: String,
        shard: String,
        seqno: String,
    },

    data() {
        return {
            block: {},
            boringFieldsVisible: false,
            transactions: undefined,
            shards: undefined,
        };
    },

    computed: {
        isMasterChain() {
            return this.workchain == '-1';
        },

        hasPrevBlocks() {
            return (this.block.prev_blocks || []).length > 0;
        },

        txHistoryEmpty() {
            return this.transactions && this.transactions.length == 0;
        },

        txHistoryLoading() {
            return this.transactions === undefined;
        },

        prevBlockLinkParams() {
            return { ...this.$props,
                seqno: parseInt(this.seqno) - 1,                
            };
        },

        nextBlockLinkParams() {
            return { ...this.$props,
                seqno: parseInt(this.seqno) + 1,                
            };
        },

        boringFields() {
            return ['global_id', 'version', 'after_merge', 'after_split', 'before_split', 'want_merge', 'want_split', 'validator_list_hash_short', 'catchain_seqno', 'min_ref_mc_seqno', 'is_key_block', 'prev_key_block_seqno', 'vert_seqno'];
        },
    },

    watch: {
        '$route': 'loadData',
    },

    created() {
        this.loadData();
    },

    methods: {
        goToLatestBlock() {
            getLastBlock().then(({ workchain, shard, seqno }) => {
                this.$router.push({
                    name: 'block',
                    params: { workchain, shard, seqno,
                        lang: this.$i18n.locale,
                    },
                });
            });
        },

        reset() {
            this.block = {};
            this.boringFieldsVisible = false;
            this.transactions = undefined;
            this.shards = undefined;
        },

        async loadData() {
            this.reset();

            this.block = await getBlockHeader(this.$props);

            this.transactions = (await getBlockTransactions(this.$props)).transactions;

            if (this.isMasterChain) {
                this.shards = (await getShards(this.$props)).shards;
            }
        },
    },

    components: {
        TxSkeleton, TxRow, ShardSkeleton,
    },
};
</script>
