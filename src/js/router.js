import Vue from 'vue';
import VueRouter from 'vue-router'
import PageAddressInvalid from '~/components/address/PageAddressInvalid.vue';
import PageAddress from '~/components/address/PageAddress.vue';
import PageBlock from '~/components/block/PageBlock.vue';
import PageBlockLatest from '~/components/block/PageBlockLatest.vue';
import PageBlocks from '~/components/block/PageBlocks.vue';
import PageIndex from '~/components/PageIndex.vue';
import PageTx from '~/components/tx/PageTx.vue';
import PageNft from '~/components/nft/PageNft.vue';
import PageJetton from '~/components/jetton/PageJetton.vue';
import PageNominator from '~/components/nominator/PageNominator.vue';
import PageStats from '~/components/stats/PageStats.vue';
import { ADDRESS_REGEX } from '~/config.js';

Vue.use(VueRouter);

const routes = new VueRouter({
    hashbang: false,
    mode: 'history',
    routes: [{
        name: 'index',
        path: '/',
        component: PageIndex,
        meta: { title: 'TON Explorer — The Open Network' },
    }, {
        name: 'address',
        path: `/address/:address(${ADDRESS_REGEX.source})`,
        component: PageAddress,
        meta: { title: 'TON Explorer' },
        props: true,
    }, {
        name: 'address_invalid',
        path: '/address/:address',
        component: PageAddressInvalid,
        meta: { title: 'TON Explorer :: Address' },
        props: true,
    }, {
        path: `/account/:address(${ADDRESS_REGEX.source})`,
        redirect: { name: 'address' },
    }, {
        name: 'tx_by_msg_hash',
        path: '/tx/by-msg-hash/:hash([^:]+)',
        component: PageTx,
        props: true,
    }, {
        name: 'tx',
        path: '/tx/:hash([^:\$]{44,})',
        component: PageTx,
        props: true,
    }, {
        path: '/tx/:lt([\\d]+)\::hash([^:]+)\::address(.{48})',
        redirect: { name: 'tx' },
    }, {
        path: '/tx/:lt([\\d]+)\$:hash([^:\$]+)\$:address(.{48})',
        redirect: { name: 'tx' },
    }, {
        name: 'block',
        path: '/block/:workchain([\\-\\d]+)\::shard([\\-\\d]+)\::seqno([\\d]+)',
        component: PageBlock,
        meta: { title: 'TON Explorer :: Block' },
        props: true,
    }, {
        name: 'block_latest',
        path: '/block/latest',
        component: PageBlockLatest,
        meta: { title: 'TON Explorer :: Block' },
    }, {
        name: 'blocks',
        path: '/blocks',
        component: PageBlocks,
        meta: { title: 'TON Explorer :: Blocks' },
    }, {
        name: 'nft',
        path: `/nft/:address(${ADDRESS_REGEX.source})`,
        component: PageNft,
        props: true,
    }, {
        name: 'jetton',
        path: `/jetton/:address(${ADDRESS_REGEX.source})`,
        component: PageJetton,
        props: true,
        meta: { title: 'TON Explorer :: Jetton' },
    }, {
        name: 'nominator',
        path: `/nominator/:address(${ADDRESS_REGEX.source})`,
        component: PageNominator,
        props: true,
        meta: { title: 'TON Explorer :: Nominator Pool' },
    }, {
        name: 'stats',
        path: '/stats',
        component: PageStats,
    }],
});

routes.afterEach((to, from) => {
    Vue.nextTick(() => {
        if (to.name == 'address') {
            document.title = `${to.meta.title} :: ${to.params.address}`;
            return;
        }

        if (to.meta?.title) {
            document.title = to.meta.title;
        }
    });
});

export default routes;
