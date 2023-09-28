import Vue from 'vue';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2';
import VueMeta from 'vue-meta';
import store from './store.js';
import router from './router.js';
import App from '~/components/App.vue';
import UiCopyButton from '~/components/UiCopyButton.vue';
import UiAddress from '~/components/UiAddress.vue';
import UiTimeago from '~/components/UiTimeago.vue';
import UiModal from '~/components/UiModal.vue';
import UiRoundImage from '~/components/UiRoundImage.vue';
import UiFiat from '~/components/UiFiat.vue';
import UiLink from '~/components/UiLink.vue';
import { IS_TESTNET, APP_MAIN_LOCALE } from '~/config.js';
import { formatFee, formatTons, formatFiat } from '~/helpers.js';
import i18n from '~/i18n';
import MediaQueriesPlugin from '~/plugins/mediaQueries.js';

Vue.use(VueClipboard);
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true,
});

Vue.use(MediaQueriesPlugin)

Vue.component('ui-round-image', UiRoundImage);
Vue.component('ui-copy-button', UiCopyButton);
Vue.component('ui-address', UiAddress);
Vue.component('ui-timeago', UiTimeago);
Vue.component('ui-modal', UiModal);
Vue.component('ui-fiat', UiFiat);
Vue.component('ui-link', UiLink);

Vue.prototype.$http = axios;
Vue.prototype.$bus = new Vue();

Vue.prototype.$ton = formatTons;
Vue.prototype.$fee = formatFee;
Vue.prototype.$fiat = formatFiat;

Vue.prototype.$localizedUrl = function createUrlOfCurrentRouteWithAnotherLocalePrefix(locale) {
    // don't display main language in url prefix:
    const lang = locale === APP_MAIN_LOCALE ? undefined : locale;

    // generate the exact same url but with another lang prefix:
    const newRoute = this.$router.resolve({ ...this.$route,
        params: { ...this.$route.params, lang },
    });

    return (document.location.origin + newRoute.href).replace(/\/$/, '');
};

new Vue({ router, store, i18n,
    el: '#app',
    render: h => h(App),

    /**
     * Need to be executed before all watchers:
     */
    beforeCreate() {
        // LocalStorage contains unsupported language:
        if (!this.$i18n.availableLocales.includes(this.$store.state.appLocale)) {
            console.error(`Invalid locale, resetting to ${APP_MAIN_LOCALE}`);
            return this.$store.commit('updateLocale', APP_MAIN_LOCALE);
        }

        // URL language doesn't match with current locale (either loaded from localStorage or undefined):
        if (this.$route.params.lang !== this.$i18n.locale) {
            // This is the first visit - then save the locale from URL prefix as preferred:
            if (!this.$store.state.appLocalePreferenceSet) {
                this.$store.commit('updateLocale', this.$route.params.lang || APP_MAIN_LOCALE);
            }
        }
    },

    watch: {
        '$store.state.appTheme': {
            immediate: true,
            handler(theme) {
                document.documentElement.dataset.theme = theme;
            },
        },

        '$store.state.appLocale': {
            immediate: true,
            handler(locale) {
                this.$i18n.locale = locale;
                document.documentElement.setAttribute('lang', locale);

                // Change URL if app lang is changed somewhere via the $store.commit:
                this.replaceUrlLocalePrefix(locale);
            },
        },

        '$store.state.exchangeRateCurrency': {
            immediate: true,
            handler() {
                !IS_TESTNET && this.$store.dispatch('getExchangeRates');
            },
        },
    },

    created() {
        if (IS_TESTNET) {
            return console.debug('Not loading addressbook and exchange rates in testnet mode');
        }

        this.$store.dispatch('getAddrbook');
    },

    methods: {
        replaceUrlLocalePrefix(locale) {
            // don't trigger route watchers:
            window.history.replaceState({}, null, this.$localizedUrl(locale));
        },
    },
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.which || e.keyCode) == 90) {
        e.preventDefault();
        Vue.prototype.$bus.$emit('ctrl-alt-z');
    }
});
