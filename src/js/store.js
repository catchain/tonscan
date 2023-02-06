import Vuex from 'vuex';
import Vue from 'vue';
import { ADDRBOOK_LOCATION } from '~/config.js';
import { getExchangeRateAndTrend } from '~/api/coingecko.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        addrbook: {},
        exchangeRate: 0,
        exchangeRateTrend: 0,
        exchangeRateCurrency: window.localStorage.getItem('exchangeRateCurrency') || 'USD',
        appLocale: window.localStorage.getItem('appLocale') || 'en',
    },

    mutations: {
        updateLocale(state, locale) {
            state.appLocale = locale;
            window.localStorage.setItem('appLocale', locale);
        },

        updateExchangeRateCurrency(state, currency) {
            state.exchangeRateCurrency = currency;
            window.localStorage.setItem('exchangeRateCurrency', currency);
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
