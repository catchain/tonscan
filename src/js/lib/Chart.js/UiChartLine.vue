<template>
    <div class="chart-bar">
        <ui-chart-legend v-if="!hideLegend" v-bind:items="legend" />

        <div class="chart-bar__graph">
            <canvas ref="canvas" />
            <ui-chart-tooltip ref="tooltip" v-bind="tooltip" />
        </div>
    </div>
</template>

<script>
import { buildTooltip, createInitialTooltipData } from './tooltip.js';
import { prefixNumber, createGradientFromContext } from './helpers.js';
import UiChartTooltip from './UiChartTooltip.vue';
import UiChartLegend from './UiChartLegend.vue';
import { getCSSVar } from '~/utils.js';

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
            timeUnit: 'day'
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

                const timeUnit = this.getTimeUnit(this.labels[0], this.labels[this.labels.length - 1]);
                chart.config.options.scales.x.time.unit = timeUnit;

                chart.update();
            });
        }
    },

    beforeDestroy() {
        this.$options.chart && this.$options.chart.destroy();
        this.$options.chart = undefined;
    },

    async mounted() {
        const Chart = await ChartLoader;

        const BarChart = new Chart(this.$refs.canvas, {
            plugins: [{
                afterDraw: chart => {
                    if (chart.tooltip?._active?.length) {
                        let x = chart.tooltip._active[0].element.x;
                        let yAxis = chart.scales.y;
                        let ctx = chart.ctx;

                        ctx.save();
                        ctx.setLineDash([8, 5]);
                        ctx.beginPath();
                        ctx.moveTo(x, yAxis.top);
                        ctx.lineTo(x, yAxis.bottom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'rgba(147, 180, 155, 0.2)';
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }],
            type: this.type,
            data: {
                labels: this.labels,
                datasets: this.datasets,
            },
            options: {
                normalized: true,
                elements: { line: {} },
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
                        grid: { display: this.type === 'line', color: () => getCSSVar('chart-grid-color') },
                        afterTickToLabelConversion: skipFirstLabel,
                        ticks: {
                            maxTicksLimit: 9,
                        },
                    },
                    y: {
                        grid: { display: this.type === 'bar', color: () => getCSSVar('chart-grid-color') },
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

        this.$options.chart = BarChart;
        this.tooltip = createInitialTooltipData(BarChart);
    },
    methods: {
        getTimeUnit(oldest_timestamp, newest_timestamp) {
            const limit = 60 * 60 * 24 * 2 * 1000; // 3 days
            const difference = newest_timestamp - oldest_timestamp;

            return difference > limit ? 'day' : 'hour';
        }
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
        box-sizing: border-box;
        flex-grow: 1;
        color: #313131;
    }
}
</style>
