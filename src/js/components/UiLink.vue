<script>
import { APP_MAIN_LOCALE } from '~/config.js';

/**
 * This component extends the <router-link/> component and adds the language prefix to URL.
 */
export default {
    props: {
        to: {
            type: Object,
            required: true,
        },
    },

    render(createElement) {
        let lang = this.$i18n.locale;

        if (lang === APP_MAIN_LOCALE) {
            lang = undefined;
        }

        return createElement('router-link', { props: {
            to: {
                name: this.to.name,
                params: { ...this.to.params, lang },
                query: this.to.query,
            },
        }}, this.$slots.default);
    },
};
</script>
