<template>
    <section>
        <div class="suspended-info">
            <h1 class="suspended-info__title" v-text="$t('suspended.header')"/>
            <p class="suspended-info__lead" v-html="$t('suspended.description')"/>
        </div>

        <div class="card">
            <div class="tx-history-wrap">
                <table class="tx-table suspended-table">
                    <thead>
                        <tr>
                            <th width="40">
                                <div class="tx-table__cell tx-table__cell--align-right suspended-table__index-cell">#</div>
                            </th>
                            <th>
                                <div class="tx-table__cell" v-text="$t('address.info.address')"/>
                            </th>
                            <th>
                                <div class="tx-table__cell" v-text="$t('address.info.balance')"/>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-if="earlyMiners === undefined">
                        <tr v-for="i in 20">
                            <td><div class="tx-table__cell tx-table__cell--align-right"><span class="skeleton">1000</span></div></td>
                            <td><div class="tx-table__cell"><span class="skeleton" style="width: 65%;">EQAAA...AAAA</span></div></td>
                            <td><div class="tx-table__cell"><span class="skeleton" style="width: 30%;">12345 TON</span></div></td>
                        </tr>
                    </tbody>

                    <tbody v-else>
                        <tr v-for="(miner, idx) in earlyMiners">
                            <td>
                                <div class="tx-table__cell tx-table__cell--align-right muted suspended-table__index-cell" v-text="idx + 1"/>
                            </td>
                            <td>
                                <div class="tx-table__cell">
                                    <ui-address hide-name v-bind:address="miner.address"/>
                                </div>
                            </td>
                            <td>
                                <div class="tx-table__cell">
                                    {{$ton(miner.balance, 0)}} TON
                                </div>
                            </td>
                        </tr>

                        <tr class="suspended-table__total">
                            <td/>
                            <td>
                                <div class="tx-table__cell" v-text="$t('common.total')"/>
                            </td>
                            <td>
                                <div class="tx-table__cell">
                                    {{$ton(totalSuspended, 0)}} TON
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
import { getSuspendedAddresses } from '~/api/tontech.js';

export default {
    data() {
        return {
            earlyMiners: undefined,
            totalSuspended: 0,
        };
    },

    mounted() {
        getSuspendedAddresses().then((miners) => {
            this.earlyMiners = miners;
            this.totalSuspended = miners.reduce((sum, miner) => sum + Number(miner.balance), 0);
        });
    },
};
</script>

<style lang="scss">
.suspended-table {
    &__index-cell {
        padding-right: 4px !important;
    }
    &__total {
        background-color: var(--tx-table-thead-alt-background);
    }
}

.suspended-info {
    padding: 0 4px;
    &__title {
        font-size: 28px;
        margin-bottom: 10px;
    }
    &__lead {
        margin-top: 0;
        margin-bottom: 22px;
        font-size: 16px;
        line-height: 1.5;
    }
}
</style>
