<template>
    <div class="card" style="margin-top: 0">
        <div class="tx-history-wrap desktop-table">
            <div class="card-title">
                <ui-link class="card-title__icon" v-bind:to="{ name: 'blocks' }">
                    <icon-back fill="currentColor"/>
                </ui-link>

                <template v-if="workchain === -1">
                    {{$t('blocks.last_masterchain_blocks_title')}}
                </template>

                <template v-else>
                    {{$t('blocks.last_workchain_blocks_title')}}
                </template>
            </div>

            <table class="last-blocks-table">
                <thead>
                    <tr>
                        <th v-text="$t('blocks.block')"/>
                        <th v-text="$t('blocks.transactions')"/>
                        <th v-if="!isMobile" v-text="$t('tx.hash')"/>
                        <th v-text="$t('common.time')"/>
                    </tr>
                </thead>

                <tbody v-if="blocks.length > 0">
                    <tr class="new-row-animation"
                        v-for="block in blocks"
                        v-bind:key="`${block.workchain}:${block.seqno}`">
                        <td>
                            <ui-link
                                v-bind:to="{ name: 'block', params: { ...block }}"
                                v-text="block.seqno"/>
                        </td>
                        <td v-text="block.tx_count"/>
                        <td v-if="!isMobile" v-text="block.root_hash"/>
                        <td v-text="getTime(block.gen_utime)"/>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr v-for="i of 40">
                        <td>
                            <span class="skeleton">123456789</span>
                        </td>
                        <td>
                            <span class="skeleton">9999</span>
                        </td>
                        <td v-if="!isMobile">
                            <span class="skeleton">AbAbAbAbAbAbAbAbAbAbAAbAbAbAbAbA</span>
                        </td>
                        <td>
                            <span class="skeleton">00:00:00 AM</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <mugen-scroll class="mugen-scroll" v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll">
                <div ref="infiniteLoader" class="mugen-scroll__button" v-on:click="loadMore">
                    <template v-if="isLoading">
                        {{$t('common.loading')}}
                    </template>
                    <template v-else>
                        {{$t('common.load_more')}}
                    </template>
                </div>
            </mugen-scroll>
        </div>
    </div>
</template>

<script>
import { getPreviousBlocks } from '~/api';
import IconBack from '@primer/octicons/build/svg/arrow-left-24.svg?inline';
import MugenScroll from 'vue-mugen-scroll';

export default {
    timerHandle: undefined,

    props: {
        workchain: [Number, String],
    },

    data() {
        return {
            blocks: [],
            limit: 64,
            isLoading: false,
            // Whether to keep the size of the block table when new blocks appear.
            // Default is true, so that the table won't grow indefinetely if user opens the page and leaves.
            // Should be set to false if user intentionally requests more blocks (scrolls down or requests new page).
            truncateBlockList: true,
        };
    },

    computed: {
        shouldHandleScroll() {
            return !this.isLoading;
        },
    },

    async created() {
        this.blocks = await getPreviousBlocks({
            wc: this.workchain,
            limit: this.limit,
        });

        this.$options.timerHandle = setInterval(() => this.loadLatestBlock(), 2800);
    },

    beforeDestroy() {
        clearInterval(this.$options.timerHandle);
    },

    methods: {
        async loadLatestBlock() {
            const newBlocks = await getPreviousBlocks({
                wc: this.workchain,
                limit: 2,
            });

            if (newBlocks[1].seqno === this.blocks[0].seqno + 1) {
                this.blocks.unshift(newBlocks[0], newBlocks[1]);

            } else if (newBlocks[0].seqno !== this.blocks[0].seqno) {
                this.blocks.unshift(newBlocks[0]);
            }

            if (this.truncateBlockList) {
                this.blocks.splice(this.limit);
            }
        },

        async loadMore() {
            this.truncateBlockList = false;
            this.isLoading = true;

            const newBlocks = await getPreviousBlocks({
                wc: this.workchain,
                limit: this.limit,
                endUtime: this.blocks.at(-1).gen_utime - 1,
            });

            this.blocks = this.blocks.concat(newBlocks);
            this.isLoading = false;

            this.offset += this.limit;
        },

        getTime(timestamp) {
            return new Date(timestamp * 1000).toLocaleTimeString(this.$i18n.locale);
        },
    },

    components: {
        MugenScroll, IconBack,
    },
};
</script>

<style lang="scss">
.last-blocks-table {
    overflow: hidden;
    border-collapse: collapse;
    width: 100%;

    td, th {
        white-space: nowrap;
        overflow: hidden;
        padding: 10px 16px;
        border-top: 1px solid var(--card-border-color);
        font-size: 14px;
        max-width: 250px;
        text-align: center;
        &:first-child {
            text-align: left;
        }
    }

    th {
        font-weight: 500;
        border: none;
    }

    tr:last-child > td {
        border-bottom: 1px solid var(--card-border-color);
    }

    thead {
        background-color: var(--tx-table-thead-alt-background);
        color: #6c757e;
        border: none;
    }
}
</style>
