// const PIE_COLORS_DARK = ['#a162f7', '#107c5d', '#23ca49', '#3ed599', '#ff6383', '#bb7739', '#3184dc', '#2b66a3', '#db3031', '#ff8742'];
// const PIE_COLORS_DARK = ['#60a5fa', '#d1d5db', '#818cf8', '#22d3ee', '#f472b6', '#fb923c', '#facc15', '#3184dc', '#107c5d', '#8b6df2'];

const PIE_COLORS_DARK_1 = Object.freeze([
    '#fff2f2', '#6c8e75', '#DBA691', '#DB8688', '#C8DBD7', '#DEBC68', '#8E748F', '#3184dc', '#107c5d',
]);

const PIE_COLORS_DARK = Object.freeze([
    '#4487f9', '#d08eed', '#b8ed83', '#ffcd26', '#f97c8c', '#7594df', '#fd790b', '#cc62b2', '#7373cb',
])

export default {
    id: 'pie_autocolors',

    beforeUpdate(chart) {
        if (chart.config.type !== 'doughnut' && chart.config.type !== 'pie') {
            return;
        }

        const dataset = chart.data.datasets[0];

        if (dataset.isSkeleton) {
            return;
        }

        if (!dataset.backgroundColor && !Object.isFrozen(dataset)) {
            dataset.backgroundColor = [];
        }

        if (Array.isArray(dataset.backgroundColor)) {
            // replace all empty values with auto colors and leaves non-empty values as is:
            dataset.data.forEach((_, idx) => {
                dataset.backgroundColor[idx] = dataset.backgroundColor[idx] || PIE_COLORS_DARK[idx];
            });
        }
    },
};
