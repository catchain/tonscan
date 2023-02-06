<template>
    <section>
        <div v-if="isEmpty"
            class="tx-history-empty-panel"
            v-text="$t('nominator_pool.voting_table_empty')"/>

        <!-- Showing plain text instead of the skeleton: -->
        <div v-else-if="isLoading"
            class="tx-history-empty-panel"
            v-text="$t('common.loading')"/>

        <div v-show="!isEmpty && !isLoading" class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th>
                            <div class="tx-table__cell">
                                {{$t('nominator_pool.voting_table_proposal_hash')}}
                            </div>
                        </th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                {{$t('nominator_pool.voting_table_created_at')}}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="voting in votings">
                        <td>
                            <div class="tx-table__cell">
                                <a v-on:click.prevent="$emit('showVotingResults', voting.proposal_hash)" v-text="voting.shortHash"/>
                            </div>
                        </td>
                        <td>
                            <div class="tx-table__cell tx-table__cell--align-right">
                                <ui-timeago v-bind:timestamp="voting.timestamp"/>
                            </div>    
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import { getNominatorPoolVotings } from '~/api';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            isLoading: true,
            votings: [],
        };
    },

    watch: {
        address: {
            immediate: true,
            handler(address) {
                if (!address) return;

                this.votings = [];
                this.isLoading = true;

                this.$nextTick(() => this.loadData());
            },
        }
    },

    computed: {
        isEmpty() {
            // If the data is loaded, but the list is empty, then there're no votings:
            return !this.isLoading && this.votings.length === 0;
        },
    },

    methods: {
        loadData() {
            getNominatorPoolVotings(this.address).then((data) => {
                this.isLoading = false;

                this.votings = data.map((voting) => Object.freeze({ ...voting,
                    shortHash: voting.proposal_hash.replace(/^0+/, ''),
                }));
            });
        },
    },
};
</script>
