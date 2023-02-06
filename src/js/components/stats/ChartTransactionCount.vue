<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">
            Transaction count
            <chart-interval-selector v-model="interval"/>
        </div>
        <bar-chart
            v-bind:labels="labels"
            v-bind:datasets="datasets"/>
    </div>
</template>

<script>
import axios from 'axios';
import BarChart from '~/lib/Chart.js/UiChartBar.vue';
import ChartIntervalSelector, { INTERVAL_TWO_WEEKS } from './ChartIntervalSelector.vue';

export default {
    data() {
        return {
            interval: INTERVAL_TWO_WEEKS,
            labels: undefined,
            datasets: undefined,
        };
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
                backgroundColor: '#6c8e75',
                label: 'user',
                stack: 0,
            }, {
                data: data.stats.map(({ trans_service_count }) => trans_service_count),
                backgroundColor: '#444',
                label: 'service',
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
