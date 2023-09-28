<script>
import { MULTIPLIER, getCurrencyFormatter } from '~/helpers.js';

export default {
    props: {
        tonValue: {
            type: [Number, String],
            required: true,
            default: 0,
        },
    },

    render(createElement) {
        const fiatValue = this.$props.tonValue / MULTIPLIER * this.$store.state.exchangeRate;
        const formatter = getCurrencyFormatter(this.$i18n.locale, this.$store.state.exchangeRateCurrency);

        return createElement('span', formatter.format(fiatValue));
    },
};
</script>
