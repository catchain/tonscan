<style lang="scss">
.stats-section {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: 120px 370px 340px repeat(2, 380px);
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

.ton-icon {
    fill: currentColor;
    width: 28px;
    height: 28px;
    margin-right: 2px;
    opacity: .3;
    transform: translate(-3px, 3px);
}

.cotract-types-container {
    grid-column: 1 / 6;
}

.address-count-container {
    grid-column: 6 / span 7;
}

.price-container,
.transaction-count-container,
.staking-container,
.validation-status-container {
    grid-column: 1 / 13;
}

@media screen and (max-width: 1099px) {
    .stats-section {
        grid-template-rows: 108px 108px 400px 360px repeat(2, 300px) 400px auto;
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
        grid-template-rows: 108px 108px 108px 108px 520px 570px repeat(2, 280px) 520px auto;
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
            <div class="chart-box" v-if="item.value == 0">
                <header><span class="skeleton">User transaction count</span></header>
                <div class="chart-box__value">
                    <span class="skeleton">3,414,166,606</span>
                </div>
                <footer><span class="skeleton">123 transactions per second</span></footer>
            </div>
            <div class="chart-box" v-else>
                <header>{{ item.header }}</header>
                <div class="chart-box__value">
                    <component v-if="item.component" :is="item.component" v-bind:value="item.value" />
                    <span v-else>
                        <icon-ton v-if="item.icon_ton" class="ton-icon" />{{ item.value }}
                    </span>
                </div>
                <footer>
                    {{ item.description }}
                </footer>
            </div>
        </div>

        <div class="price-container">
            <chart-price v-bind:market-cap="market_cap" />
        </div>

        <div class="cotract-types-container">
            <chart-contract-types />
        </div>

        <div class="address-count-container">
            <chart-address-count v-on:supply="setTotalSupply" />
        </div>

        <div class="transaction-count-container">
            <chart-transaction-count />
        </div>

        <div class="staking-container">
            <chart-staking v-bind:validators-amount="validators_amount" />
        </div>

        <div class="validation-status-container">
            <keep-alive>
                <component v-bind:is="isMobile ? 'validation-status-mobile' : 'validation-status'"
                    v-bind:cycle-start="validation_cycle_start" v-bind:cycle-end="validation_cycle_end"></component>
            </keep-alive>
        </div>

    </section>
</template>

<script>
import { getBlockchainMarketAnal, blockAnal } from '~/api/extenderContracts.js';
import { getValidatorsStats } from '~/api/elections.js';
import ChartContractTypes from './ChartContractTypes.vue';
import ChartTransactionCount from './ChartTransactionCount.vue';
import ChartAddressCount from './ChartAddressCount.vue';
import ChartPrice from './ChartPrice.vue';
import ChartStaking from './ChartStaking.vue';
import ValidationStatus from './ValidationStatus.vue';
import ValidationStatusMobile from './ValidationStatusMobile.vue';
import IconTon from '@img/icons/tonscan/ton-24.svg?inline';
import { MULTIPLIER } from '~/helpers';

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
            validators_amount: 0,
            validation_cycle_start: 0,
            validation_cycle_end: 0,
            total_supply: 0,
            market_cap: 0
        };
    },

    mounted() {
        this.loadBlockAnalytics();

        getValidatorsStats({ limit: 1 }).then(([ data ]) => {
            this.validators_amount = data.validator_count;
            this.validation_cycle_start = data.validation_cycle_start;
            this.validation_cycle_end = data.validation_cycle_end;
        });

        getBlockchainMarketAnal().then((data) => {
            this.circulation = formatter.format(data.self_reported_circulating_supply);
            this.circulation_percent = Math.round(data.self_reported_circulating_supply / data.total_supply * 100);
            this.market_cap = Math.floor(data.quotes.usd.market_cap);
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
                header: this.$t('stats.transactions_count'),
                description: this.$tc('stats.transactions_per_second', this.tps),
                value: this.txCount,
                component: 'ui-animated-number'
            }, {
                header: this.$t('stats.circulation'),
                description: this.$t('stats.percent_total_supply', { total: this.circulation_percent }),
                value: this.circulation,
                icon_ton: true
            }, {
                header: this.$t('stats.total_supply'),
                description: this.$t('stats.percent_inflation_rate'),
                value: this.total_supply,
                icon_ton: true
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
        setTotalSupply(supply) {
            supply = Math.round(supply / MULTIPLIER);
            this.total_supply = formatter.format(supply);
        }
    },

    components: {
        ChartContractTypes,
        ChartTransactionCount,
        ChartAddressCount,
        ChartPrice,
        ChartStaking,
        UiAnimatedNumber,
        ValidationStatus,
        ValidationStatusMobile,
        IconTon
    },
};
</script>
