<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;"><i18n path="stats.contract_types"/></div>
        <donut-chart class="chart-contract-types" v-if="true" v-bind:labels="labels" v-bind:dataset="parsedChartDatasets">
            <template v-slot:header>{{ total }}</template>
            <template v-slot:footer><i18n path="stats.total_addresses"/></template>
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

@media screen and (max-width: 599px) {
    .chart-contract-types {
        flex-direction: column;
        padding: 0;
        margin: 0;
        
        .chart-pie {
            max-width: 220px;;
        }

        .chart-legend {
            width: 100%;
            padding: 10px 12px;
        }
    }
}
</style>

<script>
import { getBlockchainAddressAnal } from '~/api/extenderContracts.js';
import DonutChart from '~/lib/Chart.js/UiChartDonut.vue';
import ChartColorSchemeMixin from '~/mixins/chartColorScheme.js'

export default {
    mixins: [ChartColorSchemeMixin],
    data() {
        return {
            labels: [],
            dataset: undefined,
            total: 0,
        };
    },

    computed: {
        parsedChartDatasets () {
            if (!this.dataset) {
                return 
            }

            return {
                ...this.dataset,
                borderColor: this.chartPieBorderColor
            }
        }
    },

    async mounted() {
        const data = await getBlockchainAddressAnal();
        
        const labels = [];
        const dataset = {
            backgroundColor: [],
            legendValue: [],
            data: [],
            suffix: '%',
        };

        data.graph.forEach((contract, idx) => {
            labels.push(this.$t('address.contract_type.' + contract.type));

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
