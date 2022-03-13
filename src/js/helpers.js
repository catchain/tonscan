const MULTIPLIER = 10 ** 9;

const feeFormatter = new Intl.NumberFormat('fullwide', {
    maximumFractionDigits: 9,
    minimumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
});

export const formatTons = function formatNanoTonsLimitNumberLength(value, round = true) {
    return feeFormatter.format(value / MULTIPLIER);
};

export const formatFiat = function formatFiatValue(value) {
    return currencyFormatter.format(value / MULTIPLIER);
};

export const formatFee = formatTons;
