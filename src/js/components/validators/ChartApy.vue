<script>
import MiniChart from '~/lib/Chart.js/UiChartMini.vue';
import { getCSSVar } from '~/utils.js';

export default {
    render(h) {
        return !this.datasets ? undefined : h(MiniChart, {
            props: {
                labels: this.labels,
                datasets: this.datasets,
                aspectRatio: 2.5,
            },
        });
    },

    props: {
        chartData: Array,
    },

    data() {
        return {
            datasets: undefined,
            labels: undefined
        };
    },

    mounted() {
        this.prepareData();
    },

    methods: {
        prepareData() {
            const labels = this.chartData.map(data => data.date);

            // Detecting border color (red or green):
            const border_color = this.chartData.at(0).annual_percent_yld <= this.chartData.at(-1).annual_percent_yld
                ? getCSSVar('chart-line-green-color')
                : getCSSVar('chart-line-red-color');

            const dataset = Object.freeze({
                data: this.chartData.map(data => data.annual_percent_yld),
                borderWidth: 1.5,
                fill: true,
                borderColor: border_color,
                backgroundGradient: [
                    `${border_color}50`,
                    `${border_color}20`,
                    `${border_color}20`,
                ],
            });

            this.labels = labels;
            this.datasets = [dataset];
        },
    },
};
</script>
