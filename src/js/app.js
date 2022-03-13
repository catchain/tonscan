import Vue from 'vue';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2';
import store from './store.js';
import router from './router.js';
import App from '~/components/App.vue';
import UiCopyButton from '~/components/UiCopyButton.vue';
import UiAddress from '~/components/UiAddress.vue';
import UiTimeago from '~/components/UiTimeago.vue';
import UiModal from '~/components/UiModal.vue';
import { IS_TESTNET } from '~/config.js';
import { formatFee, formatTons, formatFiat } from '~/helpers.js';
import i18n from '~/i18n';

Vue.use(VueClipboard);

Vue.component('ui-copy-button', UiCopyButton);
Vue.component('ui-address', UiAddress);
Vue.component('ui-timeago', UiTimeago);
Vue.component('ui-modal', UiModal);

Vue.prototype.$http = axios;
Vue.prototype.$bus = new Vue();

Vue.prototype.$ton = formatTons;
Vue.prototype.$fee = formatFee;
Vue.prototype.$fiat = formatFiat;

new Vue({ router, store, i18n,
    el: '#app',
    render: h => h(App),
    created() {
        if (IS_TESTNET) {
            return console.debug('Not loading addressbook and exchange rates in testnet mode');
        }

        this.$store.dispatch('getAddrbook');
        this.$store.dispatch('getExchangeRates');
    },
});
