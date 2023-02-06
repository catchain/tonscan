<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">Address count</div>
        <line-chart hide-legend
            v-bind:labels="labels"
            v-bind:datasets="datasets"/>
    </div>
</template>

<script>
import axios from 'axios';
import LineChart from '~/lib/Chart.js/UiChartLine.vue';

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

    methods: {
        async getData() {
            const { data } = await axios.get('https://api.ton.cat/tontech/status');

            const labels = data.slice(-120).map(({ timestamp }) => timestamp * 1000);

            const dataset = Object.freeze({
                data: data.slice(-120).map(({ total_accounts }) => total_accounts),
                backgroundGradient: ['#6c8e7550', '#6c8e7520', '#6c8e7500'],
                borderColor: '#6c8e75',
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
