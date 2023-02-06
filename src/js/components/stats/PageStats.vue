<style lang="scss">
.chart-box {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 16px;
    flex: 1;
    header {
        opacity: .5;
        margin-bottom: 8px;
    }
    &__value {
        font-size: 28px;
    }
    footer {
        opacity: .3;
    }
}
</style>

<template>
    <section style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: 108px 360px 300px repeat(auto-fill, 380px);
    grid-gap: 24px;">

        <div style="grid-column: 1 / span 3; margin-top: 0;" class="card">
            <div class="chart-box">
                <header>Masterchain height</header>
                <div class="chart-box__value">
                    <ui-animated-number v-bind:value="currentHeight"/>
                </div>
                <footer>
                    Block time: {{blockTime}}s
                </footer>
            </div>
        </div>

        <div style="grid-column: 4 / span 3; margin-top: 0;" class="card">
            <div class="chart-box">
                <header>User transaction count</header>
                <div class="chart-box__value">
                    <ui-animated-number v-bind:value="txCount"/>
                </div>
                <footer>
                    {{tps}} transaction per second
                </footer>
            </div>
        </div>

        <div style="grid-column: 7 / span 3; margin-top: 0;" class="card">
            <div class="chart-box">
                <header>Circulation</header>
                <div class="chart-box__value">{{circulation}} TON</div>
                <footer>
                    {{circulation_percent}}% of total supply
                </footer>
            </div>
        </div>

        <div style="grid-column: 10 / span 3; margin-top: 0;" class="card">
            <div class="chart-box">
                <header>Validators</header>
                <div class="chart-box__value">242</div>
                <footer>Next election in 8 hours</footer>
            </div>
        </div>

        <div style="grid-column: 1 / 13;">
            <chart-price/>
        </div>

        <div style="grid-column: 1 / 6;">
            <chart-contract-types/>
        </div>

        <div style="grid-column: 6 / span 7;">
            <chart-address-count/>
        </div>

        <div style="grid-column: 1 / 13;">
            <chart-transaction-count/>            
        </div>

    </section>
</template>

<script>
import { getBlockchainMarketAnal, blockAnal } from '~/api/extenderContracts.js';
import { prefixNumber } from '~/lib/Chart.js/helpers.js';
import ChartContractTypes from './ChartContractTypes.vue';
import ChartTransactionCount from './ChartTransactionCount.vue';
import ChartAddressCount from './ChartAddressCount.vue';
import ChartPrice from './ChartPrice.vue';

import UiAnimatedNumber from '~/components/UiAnimatedNumber.vue';

const formatter = new Intl.NumberFormat('en');


export default {
    data() {
        return {
            currentHeight: undefined,
            blockTime: 3.5,
            tps: undefined,
            txCount: undefined,
            circulation: undefined,
            circulation_percent: undefined,
        };
    },

    mounted() {
        this.loadBlockAnalytics();

        getBlockchainMarketAnal().then((data) => {
            this.circulation = prefixNumber(data.self_reported_circulating_supply);
            this.circulation_percent = Math.round(data.self_reported_circulating_supply / data.total_supply * 100);
        });
    },

    methods: {
        loadBlockAnalytics() {
            blockAnal().then((stats) => {
                this.currentHeight = stats.latest_masterchain_seqno;
                this.blockTime = formatter.format(stats.average_block_time);
                this.tps = formatter.format(stats.average_tps);
                this.txCount = stats.trans_ord_count;

            }).finally(() => {
                setTimeout(() => this.loadBlockAnalytics(), this.blockTime * 1000);
            });
        },
    },

    components: {
        ChartContractTypes,
        ChartTransactionCount,
        ChartAddressCount,
        ChartPrice,
        UiAnimatedNumber,
    },
};
</script>
