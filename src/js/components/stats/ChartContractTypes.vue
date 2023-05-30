<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">Contract types</div>
        <donut-chart class="chart-contract-types" v-if="true" v-bind:labels="labels" v-bind:dataset="dataset">
            <template v-slot:header>{{ total }}</template>
            <template v-slot:footer>total addresses</template>
        </donut-chart>
        <div v-else class="chart-pie"></div>
    </div>
</template>

<style lang="scss">
.chart-contract-types {
    display: flex;
    align-items: center;
    padding: 6px 4px 16px 12px;
    margin: auto 0;
    overflow: hidden;
    .chart-legend {
        padding-left: 12px;
    }
}

@media screen and (max-width: 479px) {
    .chart-contract-types {
        flex-direction: column;
        padding: 0;
    }

    .chart-legend {
        padding-left: 0;
        flex-direction: row;
        flex-wrap: wrap;
    }
}
</style>

<script>
import { getBlockchainAddressAnal } from '~/api/extenderContracts.js';
import DonutChart from '~/lib/Chart.js/UiChartDonut.vue';

export default {
    data() {
        return {
            labels: [],
            dataset: undefined,
            total: 0,
        };
    },

    async mounted() {
        const data = await new Promise((resolve) => {
            setTimeout(() => resolve(getBlockchainAddressAnal()), 500);
        });

        const labels = [];
        const dataset = {
            backgroundColor: [],
            legendValue: [],
            data: [],
            suffix: '%',
        };

        data.graph.forEach((contract, idx) => {
            labels.push(this.$t('address.contract_type.'+contract.type));

            dataset.data.push(Math.round(contract.pie * 10000) / 100);
            dataset.legendValue.push(contract.count.toLocaleString());

            if (contract.type === 'other') {
                dataset.backgroundColor[idx] = '#B0B0B0';
            }
        });

        this.labels = labels;
        this.dataset = Object.freeze(dataset);
        this.total = data.total.toLocaleString();
    },

    components: {
        DonutChart,
    },
};
</script>
