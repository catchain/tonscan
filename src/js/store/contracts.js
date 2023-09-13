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
          const method = await parseGetters(file.content);
          methods.push(method);
        }
      }
      console.log(methods)
      commit("updateMethods", methods);
    }
  },
  mutations: {
    updateSources(state, sources) {
      state.sources = sources;
    },
    updateMethods(state, getMethods) {
      state.getMethods = getMethods;
    }
  },
}