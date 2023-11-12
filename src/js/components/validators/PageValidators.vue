<template>
    <section>
        <div class="card page-validators-info-card">
            <div class="card-title" v-text="$t('stats.validation_status')"/>
            <div class="card-row">
                <div class="card-row__name">Election id</div>
                <div class="card-row__value">
                    <span v-if="!stats" class="skeleton">1234567890</span>
                    <template v-else>{{stats.cycle_id}}</template>
                </div>                        
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('common.general')"/>
                <div class="card-row__value card-row__value--flex-row">
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.validators_amount')"/>
                        <div class="card-row__value">
                            <span v-if="!validators" class="skeleton">123456789</span>
                            <template v-else>{{validators.length}}</template>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.total_staked')"/>
                        <div class="card-row__value">
                            <span v-if="!totalStakedTon" class="skeleton">123456789</span>
                            <template v-else>{{totalStakedTon}} TON</template>
                        </div>                                
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.staking_apy')"/>
                        <div class="card-row__value">
                            <span v-if="!stakingApy" class="skeleton">100%</span>
                            <template v-else>≈ {{stakingApy}}%</template>
                        </div>                                
                    </div>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('common.time')"/>
                <div class="card-row__value card-row__value--flex-row">
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.round_started')"/>
                        <div class="card-row__value">
                            <span v-if="!stats" class="skeleton">January 1 at 00:00</span>
                            <template v-else>
                                {{formatDate(stats.round.start * 1000)}}
                            </template>
                        </div>                                
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.next_round')"/>
                        <div class="card-row__value">
                            <span v-if="!stats" class="skeleton">January 1 at 00:00</span>
                            <template v-else>
                                {{formatDate(stats.round.end * 1000)}}
                            </template>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('stats.hold')"/>
                        <div class="card-row__value">
                            <span v-if="!stats" class="skeleton">January 1 at 00:00</span>
                            <template v-else>
                                {{formatDate(stats.round.hold * 1000)}}
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="card">
            <div class="tx-history-wrap desktop-table">
                <table class="tx-table validators-table">
                    <!-- Mobile table: -->
                    <template v-if="isMobile">
                        <thead>
                            <tr>
                                <th v-text="$t('common.address')"/>
                                <th v-text="$t('stats.total_stake')"/>
                            </tr>
                        </thead>

                        <tbody v-if="validators === undefined">
                            <tr v-for="i in 20" v-bind:key="`mobile_skeleton_${i}`">
                                <td><span class="skeleton">Ef9uLbpVmmuRjPODCtRTsu6U0QCw6irUd4NgsepBa0N_4BPv</span></td>
                                <td><span class="skeleton">123456789</span></td>
                            </tr>
                        </tbody>

                        <tbody v-else>
                            <tr v-for="validator in validators" v-bind:key="`mobile_row_${validator.index}`">
                                <td>
                                    <ui-address v-bind:address="validator.wallet_address"/>
                                </td>
                                <td>
                                    {{$ton(validator.stake)}} <span class="muted">TON</span>
                                </td>
                            </tr>
                        </tbody>
                    </template>

                    <!-- Desktop table: -->
                    <template v-else>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th v-text="$t('common.address')"/>
                                <th>ADNL</th>
                                <th v-text="$t('stats.total_stake')"/>
                                <th v-text="$t('stats.frozen_stake')"/>
                                <th v-text="$t('stats.weight')"/>
                            </tr>
                        </thead>

                        <tbody v-if="validators === undefined">
                            <tr v-for="n in 20" v-bind:key="`desktop_skeleton_${n}`">
                                <td><span class="skeleton ">123</span></td>
                                <td><span class="skeleton">Ef9uLbpVmmuRjPODCtRTsu6U0QCw6irUd4NgsepBa0N_4BPv</span></td>
                                <td><span class="skeleton">12345...12345</span></td>
                                <td><span class="skeleton">123456789</span></td>
                                <td><span class="skeleton">123456789</span></td>
                                <td><span class="skeleton">100%</span></td>
                            </tr>
                        </tbody>

                        <tbody v-else>
                            <tr v-for="validator in validators" v-bind:key="validator.index">
                                <td class="muted">
                                    {{validator.index + 1}}
                                </td>

                                <td>
                                    <ui-address hide-name v-bind:address="validator.wallet_address"/>
                                </td>

                                <td class="adnl-cell">
                                    {{validator.adnl_addr.substring(0, 5)}}…{{validator.adnl_addr.substring(59)}}

                                    <ui-copy-button class="copy-adnl-icon"
                                        v-bind:successMessage="$t('address.info.copy_success')"
                                        v-bind:copy="validator.adnl_addr"/>
                                </td>

                                <td>
                                    {{$ton(validator.stake)}} <span class="muted">TON</span>
                                </td>

                                <td class="muted">
                                    <template v-if="validator.frozen_stake">
                                        {{$ton(validator.frozen_stake)}} TON
                                    </template>
                                    <template v-else>
                                        None
                                    </template>
                                </td>

                                <td>
                                    {{validator.weight}}%
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </table>
            </div>
        </section>
    </section>
</template>

<script>
import { getStakingInformation } from '~/api/tontech.js';
import { getAddressInfo } from '~/api/toncenter.js';
import { getValidatorsStats } from '~/api/elections.js';
import { MULTIPLIER } from '~/helpers.js';
import { prefixNumber } from '~/lib/Chart.js/helpers.js';

export default {
    data() {
        return {
            stakingApy: undefined,
            totalStakedTon: undefined,
            validators: undefined,
            stats: undefined,
        };
    },

    mounted() {
        this.getData();
    },

    methods: {
        async getData() {
            const [
                electorInfo,
                validationCycles,
                stakingInfo,
            ] = await Promise.all([
                getAddressInfo('Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF'),
                getValidatorsStats({ limit: 2, withValidators: true }), // Last 2 validation cycles (second one is for 'Frozen stake')
                getStakingInformation(),
            ]);

            const totalStakedNanoTons = electorInfo.balance;

            const currentCycle = validationCycles[0];
            const previousCycle = validationCycles[1];

            currentCycle.validators.forEach((validator) => {
                // Find the same validator in prevous cycle:
                const previousValidator = previousCycle.validators.find((oldValidator) => {
                    return oldValidator.adnl_addr === validator.adnl_addr;
                });

                // Add its stake as 'Frozen stake' property to the current cycle:
                validator.frozen_stake = previousValidator?.stake;
                validator.weight = ((100 * validator.stake) / totalStakedNanoTons).toFixed(2);
                validator.stake = Math.floor(validator.stake / MULTIPLIER) * MULTIPLIER;
            });

            this.validators = currentCycle.validators;
            this.totalStakedTon = prefixNumber(totalStakedNanoTons / MULTIPLIER);
            this.stats = this.makeValidationStats(currentCycle);

            const medianApy = stakingInfo
                .toSorted((a, b) => Math.sign(b.annual_percent_yld - a.annual_percent_yld))
                .at(Math.round(stakingInfo.length / 2))
                .annual_percent_yld;

            this.stakingApy = (medianApy * 100).toFixed(1);
        },

        makeValidationStats(data) {
            return Object.freeze({
                cycle_id: data.cycle_id,
                round: {
                    start: data.validation_cycle_start - 32768,
                    hold: data.validation_cycle_end + 32768,
                    end: data.validation_cycle_end,
                },
                validators: {
                    max: data.config16.max_validators,
                    min: data.config16.min_validators,
                    max_main: data.config16.max_main_validators,
                },
                stake: {
                    min: data.config17.min_stake,
                    max: data.config17.max_stake,
                    max_factor: data.config17.max_stake_factor,
                },
            });
        },

        formatDate(timestamp) {
            const dateTime = new Intl.DateTimeFormat(this.$i18n.locale, {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23',
            });

            return dateTime.format(timestamp);
        },
    },
};
</script>

<style lang="scss">
.page-validators-info-card {
    margin-top: 0 !important;
    margin-bottom: 18px;
    flex-grow: 1;
}

.validators-table {
    thead {
        background-color: var(--tx-table-thead-alt-background);
    }

    th {
        border-radius: 0.5rem 0.5rem 0 0;
    }

    th, td {
        padding: 10px 12px !important;
    }

    tr > th:first-child, tr > td:first-child {
        width: 26px;
    }

    tr > th:last-child, tr > td:last-child {
        width: 40px;
    }

    .copy-adnl-icon {
        opacity: 0;
        transition: .2s;
    }

    .adnl-cell:hover {
        cursor: default;

        .copy-adnl-icon {
            opacity: 1;
        }
    }
}
</style>
