<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;"><i18n path="stats.address_count"/></div>
        <line-chart hide-legend
            v-bind:labels="parsedChartLabels"
            v-bind:datasets="parsedChartDatasets"/>
    </div>
</template>

<script>
import { getStatus } from '~/api/tontech.js';
import LineChart from '~/lib/Chart.js/UiChartLine.vue';
import { AMOUNT_OF_DATA_ON_MOBILE, AMOUNT_OF_DATA_ON_TABLET, decimateDataset } from '~/helpers.js'
import ChartColorSchemeMixin from '~/mixins/chartColorScheme.js'
import { decimateData } from '~/decimation.js'

export default {
    mixins: [ChartColorSchemeMixin],
    data() {
        return {
            labels: undefined,
            datasets: undefined,
        };
    },

    mounted() {
        this.getData()
    },

    computed: {
        parsedChartLabels () {
            if (!this.labels) {
                return undefined
            }
            switch (true) {
                case this.isMobile: return decimateData(this.labels, AMOUNT_OF_DATA_ON_MOBILE)
                case this.isTablet: return decimateData(this.labels, AMOUNT_OF_DATA_ON_TABLET)
                default: return this.labels
            }
        },
        parsedChartDatasets () {
            if (!this.datasets) {
                return undefined
            }

            const [_addressCount] = this.datasets

            const addressCount = {
                ..._addressCount,
                backgroundGradient: [`${this.chartLineColor}50`, `${this.chartLineColor}20`, `${this.chartLineColor}00`],
                borderColor: this.chartLineColor,
            }
            
            switch (true) {
                case this.isMobile: return [decimateDataset(addressCount, AMOUNT_OF_DATA_ON_MOBILE)]
                case this.isTablet: return [decimateDataset(addressCount, AMOUNT_OF_DATA_ON_TABLET)]
                default: return [addressCount]
            }
        }
    },

    methods: {
        async getData() {
            const data = await getStatus();

            const labels = data.slice(-120).map(({ timestamp }) => timestamp * 1000);

            const dataset = Object.freeze({
                data: data.slice(-120).map(({ total_accounts }) => total_accounts),
                borderWidth: 1.5,
                fill: true,
            });

            this.labels = labels;
            this.datasets = [dataset];

            const total_suply = data[data.length - 1].total_supply;
            this.$emit('supply', total_suply);
        },
    },

    components: {
        LineChart,
    },
};
</script>
