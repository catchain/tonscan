<template>
    <section>
        <header class="modal-content-title">
            <icon-cast-vote/> {{$t('nominator_pool.votes.cast_vote')}}
        </header>
        <div class="vote-casting-container">
            <div class="vote-casting-container__buttons">
                <a class="bright-blue-button" v-bind:href="voteYesLink">
                    <icon-thumb-up class="vote-casting-button__icon"/>
                </a>
                <a class="bright-blue-button" v-bind:href="voteNoLink">
                    <icon-thumb-down class="vote-casting-button__icon"/>
                </a>
            </div>
            <p class="vote-casting-container__text muted">
                <icon-info viewBox="0 0 16 16"/> {{$t('nominator_pool.votes.disclaimer')}}
            </p>
        </div>

        <header class="modal-content-title">
            <icon-vote-results/> {{$t('nominator_pool.votes_bar.title')}}
        </header>

        <div class="vote-results-bar-container">
            <div class="vote-results-bar">
                <span class="vote-results-bar__stripe vote-results-bar__stripe--green" v-bind:style="{ width: `${totalYesPercent}%`}"/>
                <span class="vote-results-bar__stripe vote-results-bar__stripe--red" v-bind:style="{ width: `${totalNoPercent}%`}"/>
            </div>
            <div class="vote-results-legend">
                <div class="vote-results-legend__result">
                    <span class="vote-results-legend__ricegrain vote-results-legend__ricegrain--green"/>
                    {{$t('nominator_pool.votes_bar.in_favor')}} &ndash; {{totalYesPercent}}%
                </div>
                <div class="vote-results-legend__result">
                    <span class="vote-results-legend__ricegrain vote-results-legend__ricegrain--red"/>
                    {{$t('nominator_pool.votes_bar.against')}} &ndash; {{totalNoPercent}}%
                </div>
                <div class="vote-results-legend__result">
                    <span class="vote-results-legend__ricegrain vote-results-legend__ricegrain--meh"/>
                    {{$t('nominator_pool.votes_bar.abstained')}} &ndash; {{totalAbstainedPercent}}%
                </div>
            </div>
        </div>

        <header class="modal-content-title">
            <icon-votes/> {{$t('nominator_pool.votes.vote_list')}}
        </header>

        <div v-if="isEmpty"
            class="tx-history-empty-panel"
            v-text="$t('nominator_pool.votes.vote_list_empty')"/>

        <div v-show="!isEmpty" class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th><div class="tx-table__cell" v-text="$t('common.address')"/></th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-center">
                                {{$t('nominator_pool.votes.votes_table_supported')}}
                            </div>
                        </th>
                        <th><div class="tx-table__cell tx-table__cell--align-right" v-text="$t('nominator_pool.votes.votes_table_date')"/></th>
                    </tr>
                </thead>

                <tbody v-if="isLoading">
                    <tr v-for="i in 5">
                        <td v-pre>
                            <div class="tx-table__cell">
                                <span class="skeleton">SomeCoolBouncableAddress</span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell tx-table__cell--align-center">
                                <span class="skeleton">Maybe</span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                <span class="skeleton">1 minute ago</span>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr v-for="vote in votes">
                        <td>
                            <div class="tx-table__cell">
                                <ui-address v-bind:address="vote.address"/>
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-center">
                                {{ vote.support ? $t('common.yes') : $t('common.no') }}
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                <ui-timeago v-bind:timestamp="vote.timestamp"/>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import IconCastVote from '@primer/octicons/build/svg/checklist-16.svg?inline';
import IconVotes from '@primer/octicons/build/svg/list-unordered-16.svg?inline';
import IconInfo from '@primer/octicons/build/svg/info-16.svg?inline';
import IconVoteResults from '@primer/octicons/build/svg/law-16.svg?inline';
import IconThumbUp from '@img/icons/material-duotone/thumb-up.svg?inline';
import IconThumbDown from '@img/icons/material-duotone/thumb-down.svg?inline';
import { getNominatorPoolVotingVotes } from '~/api';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
        proposalHash: {
            type: String,
            required: true,
        },
        weights: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            isLoading: true,
            votes: [],
            totalYesPercent: 0,
            totalNoPercent: 0,
            totalAbstainedPercent: 100,
        };
    },

    computed: {
        voteYesLink() {
            return `ton://transfer/${this.address}?text=y${this.proposalHash}&amount=1000000000`;
        },

        voteNoLink() {
            return `ton://transfer/${this.address}?text=n${this.proposalHash}&amount=1000000000`;
        },

        isEmpty() {
            return !this.isLoading && this.votes.length === 0;
        },
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            getNominatorPoolVotingVotes(this.address, this.proposalHash).then((data) => {
                this.isLoading = false;

                const votes = [];
                let totalYes = 0;
                let totalNo = 0;

                data.forEach((vote) => {
                    const weight = this.weights[vote.address];

                    // Count only current nominators and validator:
                    if (!weight) return;

                    vote.support
                        ? totalYes += weight
                        : totalNo += weight;

                    votes.push(Object.freeze({ ...vote, weight }));
                });

                this.totalYesPercent = Math.round(totalYes * 100 * 100) / 100;
                this.totalNoPercent = Math.round(totalNo * 100 * 100) / 100;
                this.totalAbstainedPercent = Math.round((1 - totalYes - totalNo) * 100 * 100) / 100;

                // If the rounded values are equal, increase the displayed value a bit
                // to explicitly show the voting result:
                if (this.totalYesPercent == this.totalNoPercent) {
                    totalYes > totalNo
                        ? this.totalYesPercent += 0.1
                        : this.totalNoPercent += 0.1;
                }

                this.votes = votes;
            });
        },
    },

    components: {
        IconCastVote, IconVotes, IconVoteResults, IconInfo, IconThumbUp, IconThumbDown,
    },
};
</script>

<style lang="scss">
.vote-casting-button {
    &__icon {
        width: 24px;
        height: 24px;
        fill: currentColor;
    }
}
.vote-casting-container {
    margin: 0 16px;
    &__buttons {
        margin: 16px 0 0 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 14px;
        .bright-blue-button {
            font-size: 24px;
        }
    }
    &__text {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin: 0;
        padding: 14px 0;
        svg {
            fill: currentColor;
            flex-shrink: 0;
            margin-right: 5px;
            width: 14px;
            height: 14px;
        }
    }
}
@media all and (max-width: 480px) {
    .vote-casting-container {
        margin: 0 10px;
        &__buttons {
            .bright-blue-button {
                font-size: 18px;
            }
        }
        &__text {
            padding: 10px 0 14px;
            font-size: 13px;
            svg {
                display: none;
            }
        }
    }
}

.vote-results-bar-container {
    padding: 16px 18px 8px;
}
.vote-results-bar {
    display: flex;
    align-items: center;
    background: var(--stacked-bar-background);
    height: 12px;
    width: 100%;
    border-radius: 36px;
    overflow: hidden;
    &__stripe {
        width: 24%;
        height: 100%;
        border-right: 1px solid var(--stacked-bar-background);
        box-sizing: border-box;
        min-width: 2px;
        transition: .4s width ease;
        &:first-child {
            min-width: 3px;
        }
        &--green {
            background: var(--stacked-bar-green);
        }
        &--red {
            background: var(--stacked-bar-red);
        }
    }
}
.vote-results-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
    &__result {
        display: flex;
        align-items: center;
        margin-right: 24px;
        line-height: 1.8;
        &:last-child {
            margin-right: 0;
        }
    }
    &__ricegrain {
        width: 10px;
        height: 4px;
        margin-right: 6px;
        display: inline-block;
        border-radius: 18px;
        &--red {
            background: var(--stacked-bar-red);
        }
        &--green {
            background: var(--stacked-bar-green);
        }
        &--meh {
            background: var(--stacked-bar-meh);
        }
    }
}
</style>
