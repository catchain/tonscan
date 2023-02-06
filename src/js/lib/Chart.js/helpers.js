/**
 * @param  {Number} number
 * @return {String}
 */
export const prefixNumber = function reduceNumberLengthWithSiPrefix(number) {
    if (number >= 1000000000) {
        return Math.round(number / 10000000) / 100 + ' B';

    } else if (number >= 1000000) {
        return Math.round(number / 100000) / 10 + ' M';

    } else if (number > 1000) {
        return Math.round(number / 100) / 10 + 'k';

    } else if (number === 0) {
        return '0';

    } else if (number < 10) {
        return number.toFixed(2);
    }

    return number;
};

export const createGradientFromContext = function(context) {
    const chartArea = context.chart.chartArea;
    if (!chartArea || !context.dataset || !context.dataset.backgroundGradient) { return; }

    const gradient = context.chart.ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    const colors = Array.from(context.dataset.backgroundGradient);

    gradient.addColorStop(0, colors.pop());
    gradient.addColorStop(1, colors.shift());

    // Two colors are already set, we need to distibute the rest between them.
    // Offset one item from the beginning (idx + 1) and onw from the end (length + 1):
    colors.reverse().forEach((color, idx) => {
        gradient.addColorStop((idx + 1) / (colors.length + 1), color);
    });

    return gradient;
};
