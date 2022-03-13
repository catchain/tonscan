import Vuex from 'vuex';
import Vue from 'vue';
import { ADDRBOOK_LOCATION, COINGECKO_ENDPOINT } from '~/config.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        addrbook: {},
        exchangeRate: 0,
    },

    mutations: {
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

        updateExchangeRate(state, usd) {
            state.exchangeRate = usd;
        },
    },

    actions: {
        getAddrbook({ commit }) {
            return this._vm.$http.get(ADDRBOOK_LOCATION).then(({ data }) => {
                commit('updateAddrbook', Object.freeze(data));
            });
        },

        getExchangeRates({ commit }) {
            this._vm.$http.get(`${COINGECKO_ENDPOINT}/simple/price?ids=the-open-network&vs_currencies=USD`).then(({ data }) => {
                commit('updateExchangeRate', data['the-open-network']['usd']);
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
