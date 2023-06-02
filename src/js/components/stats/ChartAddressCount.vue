<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;"><i18n path="stats.address_count"/></div>
        <line-chart hide-legend
            v-bind:labels="parsedChartLabels"
            v-bind:datasets="parsedChartDatasets"/>
    </div>
</template>

<script>
import axios from 'axios';
import LineChart from '~/lib/Chart.js/UiChartLine.vue';
import { AMOUNT_OF_DATA_ON_MOBILE, AMOUNT_OF_DATA_ON_TABLET, cutDataset } from '~/helpers.js'
import { getCSSVar } from '~/utils.js'

export default {
    data() {
        return {
            labels: undefined,
            datasets: undefined,
        };
    },

    mounted() {
        setTimeout(() => this.getData(), 1500);
    },

    computed: {
        parsedChartLabels () {
            if (!this.labels) {
                return undefined
            }
            switch (true) {
                case this.isMobile: return this.labels.slice(-AMOUNT_OF_DATA_ON_MOBILE)
                case this.isTablet: return this.labels.slice(-AMOUNT_OF_DATA_ON_TABLET)
                default: return this.labels
            }
        },
        parsedChartDatasets () {
            if (!this.datasets) {
                return undefined
            }

            switch (true) {
                case this.isMobile: return [cutDataset(this.datasets[0], AMOUNT_OF_DATA_ON_MOBILE)]
                case this.isTablet: return [cutDataset(this.datasets[0], AMOUNT_OF_DATA_ON_TABLET)]
                default: return this.datasets
            }
        }
    },

    methods: {
        async getData() {
            const { data } = await axios.get('https://api.ton.cat/tontech/status');

            const labels = data.slice(-120).map(({ timestamp }) => timestamp * 1000);

            const lineColor = getCSSVar('chart-line-color')
            const dataset = Object.freeze({
                data: data.slice(-120).map(({ total_accounts }) => total_accounts),
                backgroundGradient: [`${lineColor}50`, `${lineColor}20`, `${lineColor}00`],
                borderColor: lineColor,
                borderWidth: 1.5,
                fill: true,
            });

            this.labels = labels;
            this.datasets = [dataset];
        },
    },

    components: {
        LineChart,
    },
};
</script>
