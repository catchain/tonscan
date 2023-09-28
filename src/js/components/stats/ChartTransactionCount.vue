<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;">
            <i18n path="stats.transaction_count" />
            <chart-interval-selector v-model="interval" />
        </div>
        <bar-chart style="width: calc(100% - 16px); padding-left: 16px;" v-bind:labels="parsedChartLabels"
            v-bind:datasets="parsedChartDatasets" />
    </div>
</template>

<script>
import { getTransactionsStats } from '~/api/extenderContracts.js';
import BarChart from '~/lib/Chart.js/UiChartBar.vue';
import ChartIntervalSelector, { INTERVAL_DAY } from './ChartIntervalSelectorShortRange.vue';
import { AMOUNT_OF_DATA_ON_MOBILE, AMOUNT_OF_DATA_ON_TABLET, decimateDataset } from '~/helpers.js';
import ChartColorSchemeMixin from '~/mixins/chartColorScheme.js';
import { decimateData } from '~/decimation.js';

export default {
    mixins: [ChartColorSchemeMixin],
    data() {
        return {
            interval: INTERVAL_DAY,
            labels: undefined,
            datasets: undefined,
        };
    },

    computed: {
        parsedChartLabels() {
            if (!this.labels) {
                return undefined;
            }
            switch (true) {
                case this.isMobile: return decimateData(this.labels, AMOUNT_OF_DATA_ON_MOBILE);
                case this.isTablet: return decimateData(this.labels, AMOUNT_OF_DATA_ON_TABLET);
                default: return this.labels;
            }
        },
        parsedChartDatasets() {
            if (!this.datasets) {
                return undefined;
            }

            const [_userDataset, _serviceDataset] = this.datasets;

            const userDataset = {
                ..._userDataset,
                backgroundColor: this.chartBarPrimaryColor,
            };

            const serviceDataset = {
                ..._serviceDataset,
                backgroundColor: this.chartBarSecondaryColor,
            };

            switch (true) {
                case this.isMobile: return [decimateDataset(userDataset, AMOUNT_OF_DATA_ON_MOBILE), decimateDataset(serviceDataset, AMOUNT_OF_DATA_ON_MOBILE)];
                case this.isTablet: return [decimateDataset(userDataset, AMOUNT_OF_DATA_ON_TABLET), decimateDataset(serviceDataset, AMOUNT_OF_DATA_ON_TABLET)];
                default: return [userDataset, serviceDataset];
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
            const data = await getTransactionsStats(this.interval);

            const labels = data.stats.map(({ timestamp }) => timestamp);

            const datasets = [{
                data: data.stats.map(({ trans_ord_count }) => trans_ord_count),
                label: this.$t('stats.user'),
                stack: 0,
            }, {
                data: data.stats.map(({ trans_service_count }) => trans_service_count),
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
