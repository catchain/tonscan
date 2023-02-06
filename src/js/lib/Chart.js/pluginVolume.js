/**
 * Dynamically adds small volume chart on the bottom of line chart.
 */
export default {
    id: 'volume_subchart',

    afterDataLimits(chart, args) {
        // reduces volume chart height by increasing the highest value:
        if (args.scale.id === 'volume') {
            args.scale.options.display = false;
            args.scale.options.ticks.display = false;
            args.scale.options.beginAtZero = false;
            args.scale.options.position = 'left';
            args.scale.max = Math.round(args.scale.max * 6);

        // increases other chart bottom padding by decreasing the lowest value:
        } else if ('volume' in chart.scales) {
            // apply only to vertical axes:
            if (args.scale.axis === 'y') {
                args.scale.min = args.scale.min * 0.95;
            }
        }
    },
};
