<template>
    <div class="chart-bar">
        <ui-chart-legend v-if="!hideLegend" v-bind:items="legend"/>

        <div class="chart-bar__graph">
            <canvas ref="canvas"/>
            <ui-chart-tooltip ref="tooltip" v-bind="tooltip"/>
        </div>
    </div>
</template>

<script>
import { buildTooltip, createInitialTooltipData } from './tooltip.js';
import { prefixNumber, createGradientFromContext } from './helpers.js';
import UiChartTooltip from './UiChartTooltip.vue';
import UiChartLegend from './UiChartLegend.vue';

const ChartLoader = import('~/lib/Chart.js').then(esm => esm.default);

const skipFirstLabel = (scale) => scale.ticks.length > 0 && (scale.ticks[0].label = '');

const randomLabels = Array.from({ length: 50 }).map((_, idx) => ' '.repeat(5));
const randomValues = randomLabels.map((text, idx) => ({ x: idx, y: Math.random() }));

export default {
    props: {
        labels: {
            type: Array,
            default: () => randomLabels,
        },
        datasets: {
            type: Array,
            default: () => [{
                data: randomValues,
                borderWidth: 1.5,
                fill: true,
                isSkeleton: true,
                xAxisId: 'skeleton',
                parsing: false,
            }],
        },
        type: {
            type: String,
            default: 'line',
        },
        hideLegend: Boolean,
    },

    data() {
        return {
            tooltip: {},
            legend: [],
        };
    },

    watch: {
        datasets(newData) {
            ChartLoader.then(() => {
                const chart = this.$options.chart;

                chart.config.options.scales.y.ticks.display = true;
                chart.config.options.scales.skeleton.display = false;
                chart.config.options.animation.duration = 700;

                // cannot set it in default config:
                chart.config.options.elements.line.backgroundColor = newData[0].backgroundGradient
                    ? createGradientFromContext
                    : 'transparent';

                // optimizing performance:
                chart.config.options.elements.line.cubicInterpolationMode = this.labels.length > 90
                    ? 'default'
                    : 'monotone';

                chart.data.labels = this.labels;
                chart.data.datasets = newData;

                chart.update();
                console.log(newData)
            });
        },
    },

    beforeDestroy() {
        this.$options.chart && this.$options.chart.destroy();
        this.$options.chart = undefined;
    },

    async mounted() {
        const Chart = await ChartLoader;

        const BarChart = new Chart(this.$refs.canvas, {
            type: this.type,
            data: {
                labels: this.labels,
                datasets: this.datasets,
            },
            options: {
                normalized: true,
                elements: { line: {}},
                animation: { duration: 0 },
                layout: {
                    autoPadding: false,
                    padding: {
                        top: 20,
                        right: 6,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    skeleton: {
                        position: 'bottom',
                        display: true,
                        afterTickToLabelConversion: skipFirstLabel,
                        type: 'category',
                        ticks: {
                            backdropColor: '#2c2c2c',
                            showLabelBackdrop: true,
                            maxTicksLimit: 9,
                        },
                    },
                    x: {
                        type: 'time',
                        time: { unit: 'day' },
                        grid: { display: this.type === 'line' },
                        afterTickToLabelConversion: skipFirstLabel,
                        ticks: {
                            maxTicksLimit: 9,
                        },
                    },
                    y: {
                        grid: { display: this.type === 'bar' },
                        position: 'right',
                        beginAtZero: false,
                        alignToPixels: true,
                        border: { display: true },
                        ticks: {
                            display: false,
                            maxTicksLimit: 7,
                            callback: prefixNumber,
                        },
                    },
                },
                plugins: {
                    tooltip: buildTooltip(this.$refs.tooltip.$el, (tooltip) => this.tooltip = tooltip),
                    htmlLegend: {
                        onReady: (props) => this.$set(this, 'legend', props),
                    },
                },
            },
        });

        this.$options.chart = BarChart
        this.tooltip = createInitialTooltipData(BarChart);
    },

    components: {
        UiChartTooltip, UiChartLegend,
    },

    chart: undefined,
};
</script>

<style lang="scss">
.chart-bar {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    &__graph {
        position: relative;
        margin: 0 0 0 -8px;
        overflow: hidden;
        box-sizing: border-box;
        flex-grow: 1;
        color: #313131;
    }
}
</style>
