export const MULTIPLIER = 10 ** 9;
export const AMOUNT_OF_DATA_ON_MOBILE = 50
export const AMOUNT_OF_DATA_ON_TABLET = 150

const feeFormatter = new Intl.NumberFormat('fullwide', {
    maximumFractionDigits: 9,
    minimumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
});

export const formatTons = function formatNanoTonsLimitNumberLength(value, decimals = 9, round = false) {
    const valueMultiplier = Number.isInteger(decimals)
        ? Math.pow(10, decimals)
        : MULTIPLIER;

    return round
        ? currencyFormatter.format(value / valueMultiplier)
        : feeFormatter.format(value / valueMultiplier);
};

export const formatFiat = function formatFiatValue(value) {
    return currencyFormatter.format(value / MULTIPLIER);
};

export const getCurrencyFormatter = (locale, currency) => new Intl.NumberFormat(locale, { style: 'currency', currency });

export const formatFee = formatTons;

export const cutDataset = (dataset, offset) => dataset.data.length <= offset ? dataset : ({ ...dataset, data: dataset.data.slice(-offset) })