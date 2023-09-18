import {getVerifiedSourceByAddress} from "~/api/extenderContracts";
import {parseGetters} from "~/contracts";

export default {
  namespaced: true,
  state: {
    sources: [],
    getMethods: [],
  },
  actions: {
    async loadSource({ commit }, address) {
      const response = await getVerifiedSourceByAddress(address);
      commit("updateSources", response.source_item_data.content.sources);
    },
    async parseSource({ state, commit }) {
      const methods = [];
      for (const file of state.sources) {
        if (!file.filename.match(/\.(fc|func)/)) continue;
        if(file.content) {
          const parsedMethods = await parseGetters(file.content);
          methods.push(...parsedMethods);
        }
      }
      commit("updateMethods", methods);
    }
  },
  mutations: {
    updateSources(state, sources) {
      state.sources = sources;
    },
    updateMethods(state, getMethods) {
      console.log(getMethods)
      state.getMethods = getMethods;
    }
  },
}