import Vuex from 'vuex';
import Vue from 'vue';
import { ADDRBOOK_LOCATION, APP_MAIN_LOCALE, APP_MAIN_EXCHANGE_CURRENCY, APP_MAIN_THEME } from '~/config.js';
import { getExchangeRateAndTrend } from '~/api/coingecko.js';

Vue.use(Vuex);

const saveToLs = function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const getFromLs = (key, defaultValue = null) => {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
};

export default new Vuex.Store({
    state: {
        addrbook: {},
        exchangeRate: 0,
        exchangeRateTrend: 0,
        exchangeRateCurrency: window.localStorage.getItem('exchangeRateCurrency') || APP_MAIN_EXCHANGE_CURRENCY,
        appLocale: window.localStorage.getItem('appLocale') || APP_MAIN_LOCALE,
        appLocalePreferenceSet: window.localStorage.getItem('appLocale') !== null,
        appTheme: window.localStorage.getItem('appTheme') || APP_MAIN_THEME,
        searchRecentAddresses: getFromLs('searchRecentAddresses', []),
    },

    mutations: {
        updateLocale(state, locale) {
            state.appLocale = locale;
            state.appLocalePreferenceSet = true;
            window.localStorage.setItem('appLocale', locale);
        },

        updateExchangeRateCurrency(state, currency) {
            state.exchangeRateCurrency = currency;
            window.localStorage.setItem('exchangeRateCurrency', currency);
        },

        updateTheme(state, theme) {
            state.appTheme = theme;
            window.localStorage.setItem('appTheme', theme);
        },

        updateRecentSearch(state, { suggestion, forget }) {
            const routes = state.searchRecentAddresses;

            const idx = routes.findIndex((r) => r.address === suggestion.address);

            // if we already have this address, remove it,
            // since it'll be added to the top:
            if (idx >= 0) {
                routes.splice(idx, 1);
            }

            // store only limited set of records:
            if (routes.length >= 8) {
                routes.splice(7, routes.length);
            }

            // push new item to the top of the list:
            if (!forget) {
                routes.unshift(Object.freeze(suggestion));

            } else {
                // if forgetting the item, just do nothing
            }

            saveToLs('searchRecentAddresses', routes);
        },

        updateAddrbook(state, data) {
            const addrbook = {};
            const defaultInfo = {
                isScam: false,
                name: undefined,
            };

            Object.entries(data).forEach(([ address, mixedData ]) => {
                const addressInfo = typeof mixedData === 'string'
                    ? { ...defaultInfo, name: mixedData }
                    : { ...defaultInfo, ...mixedData };

                addrbook[address] = Object.freeze(addressInfo);
            });

            state.addrbook = addrbook;
        },

        /**
         * @param  {Object} state
         * @param  {Number} options.rate
         * @param  {Number} options.trend
         * @return {undefined}
         */
        updateExchangeRate(state, { rate, trend }) {
            state.exchangeRate = rate;
            state.exchangeRateTrend = trend;
        },
    },

    actions: {
        rememberRecentSearch({ commit }, suggestion) {
            commit('updateRecentSearch', { suggestion, forget: false });
        },

        forgetRecentSearch({ commit}, suggestion) {
            commit('updateRecentSearch', { suggestion, forget: true });
        },

        getAddrbook({ commit }) {
            return this._vm.$http.get(ADDRBOOK_LOCATION).then(({ data }) => {
                commit('updateAddrbook', Object.freeze(data));
            });
        },

        getExchangeRates({ state, commit }) {
            commit('updateExchangeRate', {});

            return getExchangeRateAndTrend(state.exchangeRateCurrency).then(([ rate, trend ]) => {
                commit('updateExchangeRate', { rate, trend });
            });
        },
    },

    getters: {
        getAddressMeta: (state) => (address) => {
            return state.addrbook[address] || {};
        },

        getAddressName: (state) => (address) => {
            return state.addrbook[address]?.name || address;
        },
    },
});
