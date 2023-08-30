<template>
    <section>
        <div v-if="this.isLoading && !items.length" class="tx-history-wrap">
            <table class="tx-table">
                <t-header />
                <tbody>
                    <tx-row-skeleton 
                        v-for="i in this.limit" 
                        v-bind:key="`tx_skeleton_${i}`"
                    />
                </tbody>
            </table>
        </div>

        <div v-else-if="!this.isLoading && this.error"
            class="tx-history-empty-panel"
            v-text="this.error"
        />

        <div v-else-if="!this.isLoading && !this.error && !items.length"
            class="tx-history-empty-panel"
            v-text="$t('address.tx_table.empty')"
        />

        <div v-else-if="items.length" class="tx-history-wrap">
            <table class="tx-table">
                <t-header />
                <history-row 
                    v-for="item in items"
                    v-bind:class="{ 'sub-list': item.id > 0 }"
                    v-bind:key="item.id"
                    v-bind:address="item.address"
                    v-bind:from="item.from"
                    v-bind:to="item.to"
                    v-bind:price="item.price"
                    v-bind:timestamp="item.timestamp"
                    v-bind:type="item.type"
                />
            </table>
        </div>

        <mugen-scroll class="mugen-scroll" v-bind:handler="loadMore" v-bind:should-handle="shouldHandleScroll">
            <div ref="infiniteLoader" class="mugen-scroll__button" v-show="showPreloader" v-on:click="loadMore">
                <template v-if="isLoading">{{$t('common.loading')}}</template>
                <template v-else>{{$t('common.load_more')}}</template>
            </div>
        </mugen-scroll>
    </section>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll';

import TxRowSkeleton from '../../address/TxRowSkeleton.vue';
import HistoryRow from './historyRow/HistoryRow.vue';
import THeader from './THeader.vue';
import { getItemHistory } from '~/api';

export default {
    props: {
        address: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            items: [],
            isLoading: true,
            error: null,

            hasMore: true,
            emptyHistory: false,
            lastActivity: undefined,

            limit: 3,
        };
    },

    computed: {
        shouldHandleScroll() {
            return !this.isLoading
                && this.address
                && this.hasMore
                && this.items.length > 0;
        },

        showPreloader() {
            return this.address && this.items.length > 0 && this.hasMore;
        },
    },

    watch: {
        address: {
            immediate: true,
            handler(address) {
                if (!address) return;

                this.items = []
                this.isLoading = true;
                this.hasMore = true;
                this.emptyHistory = false;

                this.$nextTick(() => this.firstLoad());
            },
        },
    },

    activated() {
        this.emitLastActivity();
    },

    methods: {
        emitLastActivity() {
            this.$emit('lastActivityUpdate', this.lastActivity);
        },

        async loadData(options) {
            try {
                this.isLoading = true;

                const items = await getItemHistory(this.address, options).then((res) => {
                    return res.slice(options.offset, options.offset + this.limit)
                })

                this.items = this.items.concat(items)
                this.emptyHistory = this.items.length === 0;

                this.hasMore = items.length >= this.limit;
            } catch (error) {
                this.error = 'Произошла ошибка загрузки'
                this.emptyHistory = true
                this.hasMore = false 
            } finally {
                this.isLoading = false
            }
        },

        async firstLoad() {
            await this.loadData({ limit: this.limit,offset: 0 })

            this.lastActivity = this.items.length > 0
                ? new Date().getTime() //FIX_ME this.items[0]?.timestamp
                : null;
                
            this.emitLastActivity();
        },

        async loadMore() {
            if (!this.shouldHandleScroll || !this.$refs.infiniteLoader.offsetParent) { 
                return
            }

            await this.loadData({
                limit: this.limit,
                offset: this.items.length,
                end_utime: this.lastActivity, // FIX_ME
            })
        },
    },

    components: {
        THeader, HistoryRow, TxRowSkeleton, MugenScroll,
    },
};
</script>
