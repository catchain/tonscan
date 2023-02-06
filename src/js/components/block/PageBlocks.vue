<template>
    <section>
        <div class="card">
            <div class="card-title" v-text="$t('blocks.last_masterchain_blocks_title')"/>

            <div class="card-row" v-for="i in 24">
                <router-link v-if="latestBlock" v-bind:to="{ name: 'block', params: {
                    workchain: -1,
                    shard: 8000000000000000,
                    seqno: latestBlock - i,
                }}">
                    {{latestBlock - i}}
                </router-link>
                <span v-else class="skeleton">12345678</span>
            </div>
        </div>
    </section>
</template>

<script>
import { getLastBlock } from '~/api';

let timerHandle = undefined;

export default {
    data() {
        return {
            latestBlock: undefined,
        };
    },

    created() {
        this.loadData();
        timerHandle = setInterval(() => this.loadData(), 1800);
    },

    beforeDestroy() {
        clearInterval(timerHandle);
    },

    methods: {
        async loadData() {
            const { seqno } = await getLastBlock();
            this.latestBlock = seqno;
        },
    },
};
</script>
