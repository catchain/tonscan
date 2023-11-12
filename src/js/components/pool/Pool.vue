<template>
    <section>
        <div class="page-nominator-top">
            <div class="card page-nominator-qr-card">
                <ui-qr class="page-nominator-qr-card__qr-code" show-logo v-bind:value="nominateLink" v-bind:size="256"/>

                <a class="bright-blue-button" v-bind:href="nominateLink" v-bind:class="{
                    'bright-blue-button--disabled': buttonDisabled,
                }">
                    <template v-if="poolInfo.nominator_count === undefined">
                        {{$t('nominator_pool.button_loading')}}
                    </template>

                    <template v-else-if="buttonDisabled">
                        {{$t('nominator_pool.button_disabled')}}
                    </template>

                    <template v-else>
                        {{$t('nominator_pool.button_add_stake')}}
                    </template>
                </a>

                <p class="page-nominator-qr-card__text muted">
                    <template v-if="poolInfo.nominator_count === undefined">
                        <span class="skeleton">help text for nomination</span>
                        <span class="skeleton skeleton--inline"/>
                    </template>

                    <template v-else-if="buttonDisabled">
                        {{$t('nominator_pool.help_text_disabled')}}
                    </template>

                    <span v-else v-html="$t('nominator_pool.help_text_add_stake', [ $ton(poolInfo.min_nominator_stake) ])"/>
                </p>
            </div>

            <div class="card page-nominator-info-card">
                <div class="card-title">
                    {{$t('nominator_pool.title')}}
                    <a class="card-title__link" v-bind:href="$t('nominator_pool.title_help_link')" target="_blank" style="margin-left: auto;">
                        <icon-title-help class="card-title__icon" style="width: auto; height: auto;"/> How to use
                    </a>
                </div>

                <div style="flex-grow: 1;">
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('common.address')"/>
                        <div class="card-row__value">
                            <ui-copy-button v-bind:copy="address" v-bind:successMessage="$t('address.info.copy_success')">
                                {{address}}
                            </ui-copy-button>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nominator_pool.validator')"/>
                        <div class="card-row__value" style="display: flex; align-items: center;">
                            <template v-if="poolInfo.validator_address">
                                <icon-dot-filled class="page-nominator-validator-activity" v-bind:class="{
                                    'page-nominator-validator-activity--active': poolInfo.state === 2,
                                    'page-nominator-validator-activity--pending': poolInfo.state === 1,
                                    'page-nominator-validator-activity--inactive': poolInfo.state === 0,
                                }"/>

                                <ui-address v-bind:address="poolInfo.validator_address"/>
                            </template>

                            <span v-else class="skeleton">EQDCH6....Loh</span>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nominator_pool.nominator_count')"/>
                        <div class="card-row__value">
                            <span v-if="poolInfo.nominator_count === undefined" class="skeleton">100 of 100</span>
                            <span v-else v-text="$t('nominator_pool.nominator_count_value', {
                                count: poolInfo.nominator_count,
                                total: poolInfo.max_nominators_count,
                            })"/>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nominator_pool.stake')"/>
                        <div class="card-row__value card-row__value--flex-row">
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.stake_total')"/>
                                <div class="card-row__value">
                                    <span v-if="totalStake === undefined" class="skeleton">10000 TON</span>
                                    <template v-else>
                                        {{$ton(totalStake)}} TON
                                    </template>
                                </div>
                            </div>
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.stake_validator')"/>
                                <div class="card-row__value">
                                    <span v-if="poolInfo.validator_amount === undefined" class="skeleton">10000 TON</span>
                                    <template v-else>
                                        {{$ton(poolInfo.validator_amount)}} TON
                                    </template>
                                </div>
                            </div>
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.stake_nominators')"/>
                                <div class="card-row__value">
                                    <span v-if="totalNominatorStake === undefined" class="skeleton">10000 TON</span>
                                    <template v-else>
                                        {{$ton(totalNominatorStake)}} TON
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nominator_pool.reward_share')"/>
                        <div class="card-row__value card-row__value--flex-row">
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.reward_share_validator')"/>
                                <div class="card-row__value">
                                    <span v-if="poolInfo.validator_reward_share === undefined" class="skeleton">100%</span>
                                    <template v-else>
                                        {{poolInfo.validator_reward_share * 100}}%
                                    </template>
                                </div>
                            </div>
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.reward_share_nominators')"/>
                                <div class="card-row__value">
                                    <span v-if="poolInfo.validator_reward_share === undefined" class="skeleton">100%</span>
                                    <template v-else>
                                        {{100 - poolInfo.validator_reward_share * 100}}%
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('nominator_pool.min_stake')"/>
                        <div class="card-row__value card-row__value--flex-row">
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.min_stake_validator')"/>
                                <div class="card-row__value">
                                    <span v-if="poolInfo.min_validator_stake === undefined" class="skeleton">10000</span>
                                    <template v-else>{{$ton(poolInfo.min_validator_stake)}} TON</template>
                                </div>
                            </div>
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('nominator_pool.min_stake_nominator')"/>
                                <div class="card-row__value">
                                    <span v-if="poolInfo.min_nominator_stake === undefined" class="skeleton">10000</span>
                                    <template v-else>{{$ton(poolInfo.min_nominator_stake)}} TON</template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <pool-tabs v-bind:address="address"
            v-on:showVotingResults="handleShowVotingResultsEvent"
            v-on:totalStakeUpdated="handleNominatorListLoaded"/>

        <ui-modal align-top v-bind:isOpen.sync="proposalHashModalVisible">
            <voting-results
                v-bind:address="address"
                v-bind:weights="weights"
                v-bind:proposalHash="viewProposalHash"/>
        </ui-modal>
    </section>
</template>

<script>
import { getNominatorPoolInfo } from '~/api';
import IconTitleHelp from '@primer/octicons/build/svg/info-16.svg?inline';
import IconDotFilled from '@primer/octicons/build/svg/dot-fill-16.svg?inline';
import VotingResults from './ModalVotingResults.vue';
import PoolTabs from './PoolTabs.vue';
import UiQr from '~/components/UiQr.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            poolInfo: {},
            activeTab: 'transactions',
            totalNominatorStake: undefined,
            viewProposalHash: undefined,
            weights: {},
        };
    },

    computed: {
        nominateLink() {
            return `ton://transfer/${this.address}?text=d`;
        },

        buttonDisabled() {
            // Also disabled if both are undefined (loading state):
            return this.poolInfo.nominator_count == this.poolInfo.max_nominators_count;
        },

        totalStake() {
            // Show skeleton until both values are loaded:
            if (this.totalNominatorStake === undefined || this.poolInfo.validator_amount === undefined) {
                return undefined;
            }

            return parseInt(this.totalNominatorStake, 10) + parseInt(this.poolInfo.validator_amount, 10);
        },

        proposalHashModalVisible: {
            get()  { return !!this.viewProposalHash },
            set(v) { this.viewProposalHash = v },
        },
    },

    watch: {
        '$route': 'loadData',
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            return Number.isInteger(this.poolInfo.state)
                ? Promise.resolve() // Pool info is already loaded
                : this.refreshData();
        },

        refreshData() {
            return getNominatorPoolInfo(this.address)
                .then((info) => {
                    info.min_nominator_stake = parseInt(info.min_nominator_stake, 10) + 1000000000;
                    info.min_validator_stake = parseInt(info.min_validator_stake, 10) + 1000000000;
                    this.poolInfo = info;
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        this.$bus.$emit('showToast', this.$t('nominator_pool.error.redirect_invalid'));
                        this.$router.push({
                            name: 'address',
                            params: {
                                address: this.address,
                                lang: this.$i18n.locale,
                            },
                        });
                    }
                });
        },

        async handleNominatorListLoaded({ nominators, total_stake }) {
            this.totalNominatorStake = parseInt(total_stake, 10);

            // Wait until pool info is loaded, since we need to know the total stake:
            await this.loadData();

            // The weight of the nominator is returned without taking into account the share of the validator.
            // We fix this by reducing the weight of the nominator by the weight of the validator stake:
            const nominatorsWeight = this.totalNominatorStake / this.totalStake;
            const validatorWeight = 1 - nominatorsWeight;
            const weights = nominators.map(nominator => [ nominator.address, nominator.weight * nominatorsWeight ]);

            // Validator is also capable of voting:
            weights.push([ this.poolInfo.validator_address, validatorWeight ]);

            this.weights = Object.freeze(Object.fromEntries(weights));
        },

        handleShowVotingResultsEvent(proposalHash) {
            this.viewProposalHash = proposalHash;
        },
    },

    components: {
        UiQr, PoolTabs, VotingResults, IconTitleHelp, IconDotFilled,
    },
};
</script>

<style lang="scss">
.page-nominator-top {
    display: flex;
    flex-direction: row;
}
.page-nominator-qr-card {
    padding: 14px;
    margin-right: 18px;
    flex-shrink: 0;
    flex-grow: 0;
    justify-content: space-between;
    &__qr-code {
        border-radius: 4px;
        margin-bottom: 14px;
    }
    &__text {
        margin: 10px auto -4px;
        font-size: 13px;
        text-align: center;
        width: 100%;
        overflow: hidden;
        max-width: 235px;
        display: block;
        b {
            font-weight: 500;
        }
    }
}
// Override .card + .card
.page-nominator-info-card {
    margin-top: 0 !important;
    flex-grow: 1;
}

.page-nominator-validator-activity {
    width: 16px;
    height: 16px;
    margin-right: 2px;
    margin-bottom: -1px;
    &--active {
        fill: var(--green-bright);
    }
    &--pending {
        fill: var(--yellow-bright);
    }
    &--inactive {
        fill: var(--badge-grey-color);
    }
}

@media screen and (max-width: 740px) {
    .page-nominator-top {
        flex-direction: column-reverse;
    }
    .page-nominator-qr-card {
        margin: 18px 0 0 0;
        &__qr-code {
            display: none;
        }
        &__text {
            max-width: unset;
        }
    }
}
</style>
