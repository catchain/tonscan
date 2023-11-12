<template>
  <div class="chart-bar-mini">
    <div class="chart-bar-mini__graph">
      <canvas ref="canvas" />
      <ui-chart-tooltip ref="tooltip" v-bind="tooltip" />
    </div>
  </div>
</template>

<script>
import { createInitialTooltipData } from './tooltip.js';
import { createGradientFromContext } from './helpers.js';
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
    aspectRatio: {
      type: Number,
      default: 1,
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

        chart.config.options.scales.y.ticks.display = false;
        chart.config.options.scales.x.ticks.display = false;
        chart.config.options.scales.skeleton.display = false;

        // cannot set it in default config:
        chart.config.options.elements.line.backgroundColor = newData[0].backgroundGradient ? createGradientFromContext : 'transparent';

        // optimizing performance:
        chart.config.options.elements.line.cubicInterpolationMode = this.labels.length > 90
          ? 'default'
          : 'monotone';

        chart.data.labels = this.labels;
        chart.data.datasets = newData;

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
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        normalized: true,
        elements: { line: { backgroundColor: createGradientFromContext }, point: { pointStyle: false } },
        animation: { duration: 0 },
        layout: {
          autoPadding: false,
          padding: {
            left: 4,
            top: -20
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: this.aspectRatio,
        scales: {
          skeleton: {
            position: 'bottom',
            display: true,
            afterTickToLabelConversion: skipFirstLabel,
            type: 'category',
            ticks: {
              backdropColor: '#2c2c2c',
              showLabelBackdrop: true,
              maxTicksLimit: 0,
            },
          },
          x: {
            type: 'time',
            grid: { display: this.type === 'line', color: () => getCSSVar('chart-grid-color') },
            afterTickToLabelConversion: skipFirstLabel,
            ticks: {
              display: false,
              maxTicksLimit: 0
            },
          },
          y: {
            grid: { display: this.type === 'bar', color: () => getCSSVar('chart-grid-color') },
            position: 'right',
            beginAtZero: false,
            alignToPixels: true,
            border: { display: false },
            ticks: {
              display: false,
              maxTicksLimit: 0
            },
          },
        },
        plugins: {
          htmlLegend: {
            onReady: (props) => this.$set(this, 'legend', props),
          },
        },
      },
    });

    this.$options.chart = BarChart;
    this.tooltip = createInitialTooltipData(BarChart);
  },

  components: {
    UiChartTooltip, UiChartLegend,
  },

  chart: undefined,
};
</script>

<style lang="scss">
.chart-bar-mini {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;

  &__graph {
    position: relative;
    // margin: 0 0 0 -8px
    box-sizing: border-box;
    flex-grow: 1;
    color: #313131;
  }
}
</style>
