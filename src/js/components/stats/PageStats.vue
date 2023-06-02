<style lang="scss">
.stats-section {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: 120px 370px 340px repeat(auto-fill, 380px);
    grid-gap: 24px 18px;
}

.chart-box {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 16px;
    flex: 1;

    header {
        margin-bottom: 8px;
        color: var(--card-header-color);
    }

    &__value {
        font-size: 28px;
    }

    footer {
        opacity: .3;
    }
}

@for $i from 0 through 3 {
    .information-block[data-index='#{$i}'] {
        grid-column: #{$i * 3 + 1} / span 3;
    }
}

.cotract-types-container {
    grid-column: 1 / 6;
}

.address-count-container {
    grid-column: 6 / span 7;
}

.price-container,.transaction-count-container {
    grid-column: 1 / 13;
}

@media screen and (max-width: 991px) {
    .stats-section {
        grid-template-rows: 108px 108px 400px 360px repeat(2, 300px);
    }

    .information-block[data-index='0'],
    .information-block[data-index='2'] {
        grid-column: 1 / 7;
    }

    .information-block[data-index='1'],
    .information-block[data-index='3'] {
        grid-column: 7 / 13;
    }

    .cotract-types-container,
    .address-count-container {
        grid-column: 1 / 13;
    }
}

@media screen and (max-width: 599px) {
    .stats-section {
        grid-template-rows: 108px 108px 108px 108px 480px 570px repeat(2, 270px);
        grid-gap: 14px;
    }

    .information-block[data-index='0'],
    .information-block[data-index='1'],
    .information-block[data-index='2'],
    .information-block[data-index='3'] {
        grid-column: 1 / 13;
    }
}
</style>

<template>
    <section class="stats-section">

        <div v-for="(item, index) of informationBlocks" :data-index="index" style="margin-top: 0;"
            class="card information-block">
            <div class="chart-box">
                <header>{{ item.header }}</header>
                <div class="chart-box__value">
                    <component v-if="item.component" :is="item.component" v-bind:value="item.value" />
                    <span v-else>{{ item.value }}</span>
                </div>
                <footer>
                    {{ item.description }}
                </footer>
            </div>
        </div>

        <div class="price-container">
            <chart-price />
        </div>

        <div class="cotract-types-container">
            <chart-contract-types />
        </div>

        <div class="address-count-container">
            <chart-address-count />
        </div>

        <div class="transaction-count-container">
            <chart-transaction-count />
        </div>

    </section>
</template>

<script>
import { getBlockchainMarketAnal, blockAnal } from '~/api/extenderContracts.js';
import { prefixNumber } from '~/lib/Chart.js/helpers.js';
import ChartContractTypes from './ChartContractTypes.vue';
import ChartTransactionCount from './ChartTransactionCount.vue';
import ChartAddressCount from './ChartAddressCount.vue';
import ChartPrice from './ChartPrice.vue';

import UiAnimatedNumber from '~/components/UiAnimatedNumber.vue';

const formatter = new Intl.NumberFormat('en');


export default {
    data() {
        return {
            currentHeight: 0,
            blockTime: 3.5,
            tps: 0,
            txCount: 0,
            circulation: 0,
            circulation_percent: 0,
        };
    },

    mounted() {
        this.loadBlockAnalytics();

        getBlockchainMarketAnal().then((data) => {
            this.circulation = prefixNumber(data.self_reported_circulating_supply);
            this.circulation_percent = Math.round(data.self_reported_circulating_supply / data.total_supply * 100);
        });
    },

    computed: {
        informationBlocks() {
            return [{
                header: this.$t('stats.masterchain_height'),
                description: this.$t('stats.block_time', { time: this.blockTime }),
                value: this.currentHeight,
                component: 'ui-animated-number'
            }, {
                header:  this.$t('stats.transactions_count'),
                description:this.$tc('stats.transactions_per_second', this.tps),
                value: this.txCount,
                component: 'ui-animated-number'
            }, {
                header: this.$t('stats.circulation'),
                description: this.$t('stats.total_supply', { total: this.circulation_percent}),
                value: `${this.circulation} TON`
            }, {
                header: this.$t('stats.validators'),
                description: this.$t('stats.validators_election'),
                value: 242
            }];
        },
    },

    methods: {
        loadBlockAnalytics() {
            blockAnal().then((stats) => {
                this.currentHeight = stats.latest_masterchain_seqno;
                this.blockTime = formatter.format(stats.average_block_time);
                this.tps = formatter.format(stats.average_tps);
                this.txCount = stats.trans_ord_count;

            }).finally(() => {
                setTimeout(() => this.loadBlockAnalytics(), this.blockTime * 1000);
            });
        },
    },

    components: {
        ChartContractTypes,
        ChartTransactionCount,
        ChartAddressCount,
        ChartPrice,
        UiAnimatedNumber,
    },
};
</script>
