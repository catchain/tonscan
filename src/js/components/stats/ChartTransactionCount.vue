<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">
            <i18n path="stats.transaction_count"/>
            <chart-interval-selector v-model="interval"/>
        </div>
        <bar-chart
            v-bind:labels="parsedChartLabels"
            v-bind:datasets="parsedChartDatasets"/>
    </div>
</template>

<script>
import axios from 'axios';
import BarChart from '~/lib/Chart.js/UiChartBar.vue';
import ChartIntervalSelector, { INTERVAL_TWO_WEEKS } from './ChartIntervalSelector.vue';
import { AMOUNT_OF_DATA_ON_MOBILE, AMOUNT_OF_DATA_ON_TABLET, cutDataset } from '~/helpers.js'
import { getCSSVar } from '~/utils.js'

export default {
    data() {
        return {
            interval: INTERVAL_TWO_WEEKS,
            labels: undefined,
            datasets: undefined,
        };
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

            const [userDataset, serviceDataset] = this.datasets

            switch (true) {
                case this.isMobile: return [cutDataset(userDataset , AMOUNT_OF_DATA_ON_MOBILE),cutDataset(serviceDataset, AMOUNT_OF_DATA_ON_MOBILE) ]
                case this.isTablet: return [cutDataset(userDataset, AMOUNT_OF_DATA_ON_TABLET),cutDataset(serviceDataset, AMOUNT_OF_DATA_ON_TABLET) ]
                default: return [userDataset, serviceDataset]
            }
        }
    },

    watch: {
        interval() {
            this.getData();
        },
    },

    mounted() {
        this.getData();
    },

    methods: {
        async getData() {
            const { data } = await axios.get(`https://api.ton.cat/v2/contracts/blockchain/transaction_stats?days=${this.interval}`);
            this.data = data;

            const labels = data.stats.map(({ timestamp }) => timestamp);

            const datasets = [{
                data: data.stats.map(({ trans_ord_count }) => trans_ord_count),
                backgroundColor: getCSSVar('chart-bar-primary-color'),
                label: this.$t('stats.user'),
                stack: 0,
            }, {
                data: data.stats.map(({ trans_service_count }) => trans_service_count),
                backgroundColor: getCSSVar('chart-bar-secondary-color'),
                label: this.$t('stats.service'),
                stack: 0,
            }];

            this.labels = labels;
            this.datasets = datasets;
        },
    },

    components: {
        BarChart, ChartIntervalSelector,
    },
};
</script>
