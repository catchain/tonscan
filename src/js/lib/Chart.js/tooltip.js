export const createInitialTooltipData = (chart) => ({
    visible: false,
    header: chart.config.data.labels[0],
    values: chart.config.data.datasets.map((dataset) => ({
        value: dataset.data[0],
        color: dataset.backgroundColor,
        label: dataset.label,
    })),
});

export const createTooltipObject = function (context, tooltipEl) {
    const tooltipModel = context.tooltip;

    // graph is not initialized yet, but mouse events are already registered:
    if (!tooltipModel.dataPoints) {
        return { visible: false, values: [] };
    }

    // don't show tooltip for skeletons:
    if (tooltipModel.dataPoints[0].dataset.isSkeleton) {
        return { visible: false, values: [] };
    }

    const tooltip = {
        visible: tooltipModel.opacity === 1,
        header: tooltipModel.dataPoints[0].label,
        vAlign: tooltipModel.yAlign,
        tickDiff: null,
        values: tooltipModel.dataPoints.map((dataPoint, idx) => {
            // border color for line chart, background color for bar chart:
            const color = dataPoint.dataset.borderColor || dataPoint.dataset.backgroundColor;

            const tooltipColor = Array.isArray(color)
                ? color[dataPoint.dataIndex]
                : color;

            return Object.freeze({
                color: tooltipColor,
                value: dataPoint.formattedValue.replace(',', '.'),
                label: dataPoint.dataset.label,
                suffix: dataPoint.dataset.suffix,
            });
        }),
    };

    const labels = context.chart.config.data.labels;

    // replace serialized date values with date object:
    if (context.chart.scales.x?.type === 'time') {
        tooltip.header = labels[tooltipModel.dataPoints[0].dataIndex];
        tooltip.tickDiff = Math.round((labels[1] - labels[0]) / 1000);
    }

    const tooltipWidth = tooltipEl.offsetWidth || 0;
    const tooltipHeight = tooltipEl.offsetHeight || 0;

    let tooltipOffsetLeft = tooltipModel.caretX;
    let tooltipOffsetTop = tooltipModel.caretY;

    if (tooltipOffsetLeft > context.chart.chartArea.right - tooltipWidth) {
        tooltipOffsetLeft = tooltipOffsetLeft - tooltipWidth;
    }

    if (tooltipOffsetTop > context.chart.chartArea.bottom - tooltipHeight) {
        tooltipOffsetTop = tooltipOffsetTop - tooltipHeight;
    }

    tooltip.left = Math.round(tooltipOffsetLeft + 20);
    tooltip.top = Math.round(tooltipOffsetTop - 10);

    return tooltip;
};

export const buildTooltip = (tooltipEl, handleChange) => ({
    mode: 'index',
    enabled: false,
    intersect: false,
    external: (context) => {
        const tooltip = createTooltipObject(context, tooltipEl);

        if (!tooltip.visible) {
            context.tooltip._timer = setTimeout(() => handleChange(tooltip), 300);
            return;
        }

        clearTimeout(context.tooltip._timer);
        return handleChange(tooltip);
    },
});
