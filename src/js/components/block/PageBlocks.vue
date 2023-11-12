<template>
    <section>
        <div class="block-info-section">
            <div class="card information-block" v-for="item in informationBlocks">
                <div class="chart-box">
                    <header class="chart-box__header" v-text="item.header"/>
                    <div class="chart-box__value">
                        <span class="skeleton" v-if="item.value === undefined">1,234,567,890</span>
                        <ui-animated-number v-else v-bind:value="item.value" v-bind:suffix="item.suffix"/>
                    </div>
                </div>
            </div>
        </div>

        <workchain-blocks
            v-if="!isNaN($route.query.wc)"
            v-bind:workchain="$route.query.wc"/>

        <template v-else>
            <div class="card" style="margin-bottom: 18px;">
                <div class="card-title" v-text="$t('address.all_tx_table.title')"/>

                <section style="height: 312px; overflow: auto;">
                    <transactions-table/>
                </section>
            </div>

            <section class="block-chains-section">
                <div class="card">
                    <div class="card-title" v-text="$t('blocks.last_masterchain_blocks_title')"/>
                    <page-blocks-mini-table v-bind:blocks="masterchainBlocks"/>
                </div>

                <div class="card">
                    <div class="card-title" v-text="$t('blocks.last_workchain_blocks_title')"/>
                    <page-blocks-mini-table v-bind:blocks="workchainBlocks"/>
                </div>
            </section>
        </template>
    </section>
</template>

<script>
import { blockAnal } from '~/api/extenderContracts.js';
import { getPreviousBlocks } from '~/api';
import { hexToBase64 } from '~/utils.js';
import UiAnimatedNumber from '~/components/UiAnimatedNumber.vue';
import PageBlocksMiniTable from './PageBlocksMiniTable.vue';
import WorkchainBlocks from './PageBlocksWorkchainBlockTable.vue';
import TransactionsTable from './PageBlocksTransactions.vue';

export default {
    timerHandle: undefined,

    data() {
        return {
            blockAnal: undefined,
            lastBlockTime: undefined,
            blocks: [],
            isLoading: false,
            mcHeight: undefined,
            totalTx: undefined,
            averageTps: undefined,
        };
    },

    computed: {
        masterchainBlocks() {
            return this.blocks.filter(b => b.workchain === -1).slice(0, 15);
        },

        workchainBlocks() {
            return this.blocks?.filter(b => b.workchain === 0).slice(0, 15);
        },

        shouldHandleScroll() {
            return !this.isLoading;
        },

        informationBlocks() {
            return [{
                header: this.$t('stats.masterchain_height'),
                value: this.mcHeight,
            }, {
                header: this.$t('blocks.block_time'),
                value: this.lastBlockTime,
                suffix: ` ${this.$tc('common.seconds', [this.lastBlockTime])}`,
            }, {
                header: this.$t('stats.transaction_count'),
                value: this.totalTx,
            }, {
                header: this.$t('blocks.tx_per_second'),
                value: this.averageTps,
            }];
        },
    },

    created() {
        Promise.all([
            this.loadPreviousBlocks(),
            this.blockAnalytics(),
        ]);

        this.$options.timerHandle = setInterval(() => this.loadPreviousBlocks(), 6000);
    },

    beforeDestroy() {
        clearInterval(this.$options.timerHandle);
    },

    methods: {
        async loadPreviousBlocks() {
            const takeCount = 32;

            this.blocks = await getPreviousBlocks({ limit: takeCount });

            this.mcHeight = this.blocks[0].seqno;
            this.lastBlockTime = this.masterchainBlocks[0].gen_utime - this.masterchainBlocks[1].gen_utime;

            this.averageTps = this.blocks.reduce((acc, val) => acc + val.tx_count, 0) / takeCount;
            this.averageTps = this.averageTps;

            if (!isNaN(this.totalTx)) {
                this.totalTx += this.masterchainBlocks[0].tx_count;
                this.totalTx += this.workchainBlocks[0].tx_count;
            }
        },

        async blockAnalytics() {
            this.blockAnal = await blockAnal();
            this.totalTx = this.blockAnal.trans_ord_count;
        },
    },

    components: {
        UiAnimatedNumber, PageBlocksMiniTable, WorkchainBlocks, TransactionsTable,
    }
};
</script>

<style lang="scss">
.block-info-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 82px;
    grid-gap: 18px;
    margin-bottom: 18px;
    .information-block {
        margin-top: 0 !important;
    }
}

.block-chains-section {
    display: grid;
    width: 100%;
    align-items: stretch;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    .card + .card {
        margin: 0;
    }
}

@media screen and (max-width: 900px) {
    .block-info-section {
        grid-template-columns: repeat(2, 1fr);
    }

    .block-chains-section {
        grid-template-columns: 1fr;
    }
}

@media screen and (max-width: 480px) {
    .block-info-section {
        grid-template-columns: 1fr;
    }
}
</style>