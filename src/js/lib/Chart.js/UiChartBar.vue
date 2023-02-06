<script>
import UiChartLine from './UiChartLine.vue';

export default {
    props: {
        labels: Array,
        datasets: Array,
        hideLegend: Boolean,
    },

    render(createElement) {
        return createElement(UiChartLine, { props: {
            labels: this.labels,
            datasets: this.datasets,
            hideLegend: this.hideLegend,
            type: 'bar',
        }});
    },
};
</script>
