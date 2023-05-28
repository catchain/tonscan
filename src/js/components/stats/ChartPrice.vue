<style lang="scss">
.line-chart-ear {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 16px 0 0;
    width: 155px;
    box-sizing: border-box;
}
.line-chart-ear-box {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    padding: 0 16px;
    header {
        opacity: .5;
        margin-bottom: 6px;
        font-size: 14px;
    }
    &__value {
        font-size: 22px;
        margin-bottom: 5px;
    }
    footer {
        font-size: 13px;
    }
}

.card-title-selector {
    display: flex;
    align-items: center;
    padding: 3px;
    margin: -3px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.4);
    text-transform: none;
    margin-left: auto;
    &__item {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
        text-transform: lowercase;
        white-space: nowrap;
        &--active {
            background: #212121;
        }
    }
}

.market-data-container {
    display: flex;
    height: 100%;
    flex-direction: row;
}

@media screen and (max-width: 479px) {
    .market-data-container {
        flex-direction: column;
    }

    .line-chart-ear {
        flex-direction: row;
        width: unset;
        padding: 0;
        margin: 20px 0;
    }

    .line-chart-ear-box {
        padding: 0;
    }
}
</style>

<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">
            Market data
            <chart-interval-selector v-model="interval"/>
        </div>
        <div class="market-data-container">
            <aside class="line-chart-ear">
                <div class="line-chart-ear-box">
                    <header>TONCOIN price</header>
                        <div class="line-chart-ear-box__value">$ {{marketData.price.value}}</div>
                    <footer>
                            <chart-change-indicator
                                v-bind:change="marketData.price.change"
                                v-bind:rangeDays="interval"/>
                    </footer>
                </div>
                <div class="line-chart-ear-box">
                    <header>Capitalization</header>
                        <div class="line-chart-ear-box__value">$ {{marketData.caps.value}}</div>
                    <footer>
                            <chart-change-indicator
                                v-bind:change="marketData.caps.change"
                                v-bind:rangeDays="interval"/>
                    </footer>
                </div>
                <div class="line-chart-ear-box">
                    <header>Trading volume</header>
                        <div class="line-chart-ear-box__value">$ {{marketData.volume.value}}</div>
                    <footer>
                            <chart-change-indicator
                                v-bind:change="marketData.volume.change"
                                v-bind:rangeDays="interval"/>
                    </footer>

                    <!--footer style="opacity: .5;">
                                <strong>{{marketData.circulating_percent}}%</strong> of {{marketData.total_supply}}
                            </footer-->
                </div>
            </aside>

                <line-chart hide-legend style="flex-grow: 1"
                    v-bind:labels="labels"
                    v-bind:datasets="datasets"/>
            </div>
    </div>
</template>

<script>
import axios from 'axios';
import LineChart from '~/lib/Chart.js/UiChartLine.vue';
import ChartChangeIndicator from './ChartChangeIndicator.vue';
import ChartIntervalSelector, { INTERVAL_TWO_WEEKS } from './ChartIntervalSelector.vue';
import { prefixNumber } from '~/lib/Chart.js/helpers.js';

export default {
    data() {
        return {
            interval: INTERVAL_TWO_WEEKS,
            labels: undefined,
            datasets: undefined,
            marketData: {
                price: {},
                volume: {},
                caps: {},
            },
        };
    },

    watch: {
        interval() {
            this.loadData();
        },
    },

    mounted() {
        setTimeout(() => this.loadData(), 300);
    },

    methods: {
        updateInterval({ length }) {
            this.interval = length;
        },

        async loadMarketData() {
            const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/the-open-network?localization=false&community_data=false&developer_data=false&market_data=true');

            this.marketData = data.market_data;

            data.market_data.circulating_percent = Math.round(data.market_data.circulating_supply / data.market_data.total_supply * 10000) / 100;
            data.market_data.market_cap.usd = prefixNumber(data.market_data.market_cap.usd);
            data.market_data.circulating_supply = prefixNumber(data.market_data.circulating_supply);
            data.market_data.total_supply = prefixNumber(data.market_data.total_supply);
        },

        async loadData() {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/the-open-network/market_chart?vs_currency=USD&days=${this.interval}`);

            const calculate = (dataset, key) => {
                const latestValue = dataset[key][dataset[key].length - 1][1];
                const earliestValue = dataset[key][0][1];
                const valueDiff = (latestValue - earliestValue) / latestValue;
                return Object.freeze({ value: prefixNumber(latestValue), change: valueDiff });
            };

            this.marketData.price = calculate(data, 'prices');
            this.marketData.volume = calculate(data, 'total_volumes');
            this.marketData.caps = calculate(data, 'market_caps')

            const labels = data.prices.map(([ timestamp ]) => timestamp);

            const priceDataset = Object.freeze({
                data: data.prices.map(([ _, value ], idx) => Object.freeze({ x: idx, y: value })),
                backgroundGradient: ['#6c8e7550', '#6c8e7520', '#6c8e7500'],
                borderColor: '#6c8e75',
                borderWidth: 1.5,
                fill: true,
                yAxisID: 'y',
                label: 'price',
                suffix: ' USD',
                parsing: false,
            });

            const volumeDataset = Object.freeze({
                data: data.total_volumes.map(([ _, value ], idx) => Object.freeze({ x: idx, y: value })),
                backgroundColor: '#6c8e7570',
                fill: true,
                type: 'bar',
                yAxisID: 'volume',
                label: 'volume',
                suffix: ' TON',
                parsing: false,
            });

            this.labels = labels;
            this.datasets = [priceDataset, volumeDataset];
        },
    },

    components: {
        LineChart, ChartChangeIndicator, ChartIntervalSelector,
    },
};
</script>
