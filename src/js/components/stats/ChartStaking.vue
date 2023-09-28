<template>
    <div class="card" style="height: 100%;max-width: 100%;">
        <div class="card-title" style="border: none;" v-text="$t('stats.staking')"/>

        <div class="data-container">
            <side-ear v-if="!isDataLoading"
                v-bind:param-top="stakingData.apy"
                v-bind:param-middle="stakingData.total"
                v-bind:param-bottom="stakingData.validators"
                v-bind:interval="interval"/>

            <line-chart style="flex-grow: 1"
                v-bind:labels="parsedChartLabels"
                v-bind:datasets="parsedChartDatasets"/>
        </div>
    </div>
</template>

<script>
import LineChart from '~/lib/Chart.js/UiChartLine.vue';
import { prefixNumber } from '~/lib/Chart.js/helpers.js';
import { getStakingInformation } from '~/api/tontech.js';
import { getAddressInfo } from '~/api/toncenter.js';
import { getValidatorsStats } from '~/api/elections.js';
import ChartColorSchemeMixin from '~/mixins/chartColorScheme.js';
import { decimateData } from '~/decimation.js';
import ChartChangeIndicator from './ChartChangeIndicator.vue';
import SideEar from './ChartSideEar.vue';
import {
    AMOUNT_OF_DATA_ON_MOBILE,
    AMOUNT_OF_DATA_ON_TABLET,
    decimateDataset,
    MULTIPLIER,
} from '~/helpers.js';

const decimateStaking = (dataset, offset) => {
    const updatedDataset = decimateDataset(dataset, offset);

    return {
        ...updatedDataset,
        data: updatedDataset.data.map((y, idx) => ({ x: idx, y })),
    };
};

export default {
    mixins: [ChartColorSchemeMixin],

    props: {
        validatorsAmount: Number,
    },

    data() {
        return {
            originalData: undefined,
            labels: undefined,
            datasets: undefined,
            total_staked: undefined,
            validators_month_ago: undefined,
            stakingData: {
                apy: {},
                total: {},
                validators: {}
            },
            interval: 30,
            isDataLoading: true
        };
    },

    computed: {
        parsedChartLabels() {
            if (!this.labels) {
                return undefined;
            }

            switch (true) {
                case this.isMobile: {
                    return decimateData(this.labels, AMOUNT_OF_DATA_ON_MOBILE);
                }
                case this.isTablet: {
                    return decimateData(this.labels, AMOUNT_OF_DATA_ON_TABLET);
                }
                default: {
                    return this.labels;
                }
            }
        },

        parsedChartDatasets() {
            if (!this.datasets) {
                return undefined;
            }

            const [_apyDatatset, _stakedDataset] = this.datasets;

            const apyDatatset = {
                ..._apyDatatset,
                backgroundGradient: [
                    `${this.chartLineColor}50`,
                    `${this.chartLineColor}20`,
                    `${this.chartLineColor}00`,
                ],
                borderColor: this.chartLineColor,
            };

            const stakedDataset = {
                ..._stakedDataset,
                backgroundColor: `${this.chartLineColor}70`,
            };

            switch (true) {
                case this.isMobile: {
                    return [
                        decimateStaking(apyDatatset, AMOUNT_OF_DATA_ON_MOBILE),
                        decimateStaking(stakedDataset, AMOUNT_OF_DATA_ON_MOBILE),
                    ];
                }

                case this.isTablet: {
                    return [
                        decimateStaking(apyDatatset, AMOUNT_OF_DATA_ON_TABLET),
                        decimateStaking(stakedDataset, AMOUNT_OF_DATA_ON_TABLET),
                    ];
                }

                default: {
                    return [
                        decimateStaking(apyDatatset, 1),
                        decimateStaking(stakedDataset, 1),
                    ];
                }
            }
        },
    },

    mounted() {
        this.getData();
    },

    methods: {
        async getData() {
            const data = await getStakingInformation();

            const { balance: total_staked_ton } = await getAddressInfo('Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF');

            const labels = data.map(({ date }) => new Date(date).valueOf());

            const calculate = (dataset, key, localization) => {
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - this.interval);

                const monthAgoIndex = dataset.findIndex((item) => Date.parse(item.date) > monthAgo);

                let latestValue = dataset.at(-1)[key];
                const earliestValue = dataset.at(monthAgoIndex)[key];
                const valueDiff = (latestValue - earliestValue) / latestValue;

                if (localization == 'stats.staking_apy') latestValue = (latestValue * 100).toFixed(1) + '%';
                if (localization == 'stats.total_staked') latestValue = prefixNumber(total_staked_ton / MULTIPLIER);

                return Object.freeze({
                    localization: localization,
                    value: latestValue,
                    change: valueDiff,
                });
            };

            this.stakingData.apy = calculate(data, 'annual_percent_yld', 'stats.staking_apy');
            this.stakingData.total = calculate(data, 'staked', 'stats.total_staked');

            const apyDatatset = Object.freeze({
                data: data.map(({ annual_percent_yld }) => +(annual_percent_yld * 100).toFixed(1)),
                borderWidth: 1.5,
                fill: true,
                yAxisID: 'y',
                label: this.$t('stats.apy'),
                suffix: ' %',
                parsing: false,
            });

            const stakedDataset = Object.freeze({
                data: data.map(({ staked }) => Math.round(staked.toFixed(0))),
                fill: true,
                type: 'bar',
                yAxisID: 'volume',
                label: this.$t('stats.staking'),
                suffix: ' TON',
                parsing: false,
            });

            this.labels = labels;
            this.datasets = [apyDatatset, stakedDataset];

            const validators_month_ago = await getValidatorsStats({ offset: 43 });

            this.validators_month_ago = validators_month_ago[0].validator_count;
            this.stakingData.validators = Object.freeze({
                change: (this.validatorsAmount - this.validators_month_ago) / this.validatorsAmount,
                value: this.validatorsAmount,
                localization: 'stats.validators'
            });

            this.isDataLoading = false;
        }
    },

    components: {
        LineChart,
        SideEar,
        ChartChangeIndicator,
    },
};
</script>
