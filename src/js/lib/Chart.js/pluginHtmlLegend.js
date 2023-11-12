export default {
    id: 'htmlLegend',

    afterUpdate(chart, args, options) {
        if (chart.config.data.datasets[0].isSkeleton) {
            return;
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        // Pie and doughnut charts only have a single dataset:
        const isRoundChart = chart.config.type === 'doughnut' || chart.config.type === 'pie';
        const valueDataset = isRoundChart
            ? chart.config.data.datasets[0].legendValue || chart.config.data.datasets[0].data
            : {};

        const props = items.map((item) => ({
            color: typeof item.fillStyle === 'string' ? item.fillStyle : item.strokeStyle,
            hidden: item.hidden,
            index: item.index,
            text: item.text,
            value: valueDataset[item.index],
            onclick: () => {
                const result = isRoundChart
                    ? chart.toggleDataVisibility(item.index)
                    : chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                chart.update();
            },
        }));

        if (!(options.onReady instanceof Function)) {
            throw new Error('options.onReady must be a function');
        }

        return options.onReady(props);
    },
};
