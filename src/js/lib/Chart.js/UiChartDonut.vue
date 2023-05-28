<template>
    <section>
        <div class="chart-pie" style="height: 100%;">
            <canvas class="chart-pie__canvas" ref="canvas" width="200" height="200" />

            <section class="chart-pie-inner" v-show="!dataset.isSkeleton">
                <header class="chart-pie-inner__counter">
                    <slot name="header"/>
                </header>
                <footer class="chart-pie-inner__explanation">
                    <slot name="footer"/>
                </footer>
            </section>

            <ui-chart-tooltip ref="tooltip" v-bind="tooltip"/>
        </div>

        <ui-chart-legend layout="table" v-bind:items="legend"/>
    </section>
</template>

<script>
import { buildTooltip, createInitialTooltipData } from './tooltip.js';
import UiChartTooltip from './UiChartTooltip.vue';
import UiChartLegend from './UiChartLegend.vue';

const ChartLoader = import('~/lib/Chart.js').then(esm => esm.default);

export default {
    props: {
        labels: Array,
        dataset: {
            type: Object,
            default: () => ({
                data: [1],
                isSkeleton: true,
            }),
        },
    },

    watch: {
        dataset(newData) {
            ChartLoader.then(() => {
                this.chart.config.options.animation.duration = 1000;
                this.chart.data.labels = this.labels;
                this.chart.data.datasets = [newData];
                this.chart.update();
            });
        },
    },

    data() {
        return {
            legend: [],
            tooltip: {},
        };
    },

    beforeDestroy() {
        this.chart && this.chart.destroy();
        this.chart = undefined;
    },

    async mounted() {
        const Chart = await ChartLoader;

        this.chart = new Chart(this.$refs.canvas, {
            type: 'doughnut',
            data: {
                labels: this.labels,
                datasets: [ this.dataset ],
            },
            options: {
                animation: { duration: 0 },
                cutout: '88%',
                borderWidth: 1.5, //3 
                borderRadius: 0, //6
                plugins: {
                    tooltip: buildTooltip(this.$refs.tooltip.$el, (tooltip) => this.tooltip = tooltip),
                    htmlLegend: {
                        onReady: (props) => this.$set(this, 'legend', props),
                    },
                },
            },
        });
    },

    components: {
        UiChartLegend, UiChartTooltip,
    },

    chart: undefined,
};
</script>

<style lang="scss">
.chart-pie {
    width: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 100px;
    max-width: 280px;
    aspect-ratio: 1 / 1;
    margin: auto;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    &__canvas {
       z-index: 2000;
       position: relative;
       color: var(--card-background);
       max-height: 100%;
    }
}
.chart-pie-inner {
    position: absolute;
    z-index: 1000;
    aspect-ratio: 1 / 1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20%;
    border-radius: 50%;
    text-align: center;
    margin: auto;
    &__counter {
        font-size: 22px;
    }
    &__explanation {
        color: #adadab;
        margin-top: 4px;
        font-size: 14px;
    }
}
</style>
