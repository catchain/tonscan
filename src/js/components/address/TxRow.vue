<template>
    <tbody>
        <tr v-on:click="open()">
            <td>
                <router-link class="tx-table-cell-icon" v-bind:to="{ name: 'tx', params: txLinkRouteParams }">
                    <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M7.665 9.301c-.155-.067-.338-.206-.549-.417a2.6 2.6 0 0 1 0-3.677l1.768-1.768a2.6 2.6 0 0 1 3.677 3.677l-1.167 1.167m-3.06-1.584c.156.067.339.206.55.417a2.6 2.6 0 0 1 0 3.677l-1.768 1.768A2.6 2.6 0 1 1 3.44 8.884l1.167-1.167" stroke="currentColor" stroke-linecap="round" stroke-width="1.3"/></svg>
                </router-link>
            </td>
            <td>
                <div class="tx-table__cell">
                    <ui-timeago v-bind:timestamp="timestamp"/>
                </div>
            </td>
            <td>
                <div class="tx-table__cell tx-table__cell--align-right">
                    <span v-if="!from">hidden</span>
                    <ui-address v-else v-bind:address="from" v-bind:disabled="is_out"/>
                </div>
            </td>
            <td>
                <div class="tx-table__cell" style="padding: 0;">
                    <span v-if="is_service" class="tx-table__badge tx-table__badge--service">OUT</span>
                    <span v-else-if="is_out" class="tx-table__badge tx-table__badge--out">OUT</span>
                    <span v-else class="tx-table__badge tx-table__badge--in">IN</span>
                </div>
            </td>
            <td>
                <div class="tx-table__cell">
                    <ui-address v-bind:address="to" v-bind:disabled="!is_out"/>
                </div>
            </td>
            <td>
                <div class="tx-table__cell tx-table__cell--align-right" style="position: relative; padding-right: 26px;" v-bind:title="message">
                    {{$ton(amount)}} TON

                    <svg v-if="message" style="position: absolute; right: 1px;" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h14v14H0z"/><path d="M3.375 1.35h7.3a2 2 0 0 1 2 2v5.3a2 2 0 0 1-2 2H7.6l-2.77 2.424a.5.5 0 0 1-.83-.376V10.65h-.625a2 2 0 0 1-2-2v-5.3a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></g></svg>
                </div>
            </td>
            <td>
                <div class="tx-table__cell">
                    <svg class="tx-table-expand-caret" xmlns="http://www.w3.org/2000/svg" fill="none"
                        v-bind:class="{ 'tx-table-expand-caret--expanded': isVisible }">
                        <path stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" d="m1.5 4.75 5.5 5.5 5.5-5.5"/>
                    </svg>
                </div>
            </td>
        </tr>

        <tr v-show="isVisible" class="tx-table-row-details">
            <td colspan="10">
                <div class="tx-table-inner-container">
                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.timestamp')"/>
                        {{dateTime.toLocaleString()}}
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.hash')"/>

                        <ui-copy-button show-button v-bind:copy="txHash" v-bind:successMessage="$t('tx.hash_copy_success')">
                            {{txHash}}
                        </ui-copy-button>
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.lt')"/>

                        <ui-copy-button show-button v-bind:copy="txLt" v-bind:successMessage="$t('tx.lt_copy_success')">
                            {{txLt}}
                        </ui-copy-button>
                    </div>

                    <div class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.fee')"/>
                        {{$ton(fee)}} TON
                    </div>

                    <div v-if="message" class="tx-table-inner">
                        <div class="tx-table-inner__header" v-text="$t('tx.message')"/>
                        {{message}}
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
export default {
    props: {
        date: String,
        from: String,
        is_out: Boolean,
        is_service: Boolean,
        to: String,
        amount: String,
        message: String,
        timestamp: Number,
        fee: String,
        txHash: String,
        txLt: String,
    },

    data() {
        return {
            isVisible: false,
        };
    },

    computed: {
        txLinkRouteParams() {
            return {
                lt: this.txLt,
                hash: this.txHash,
                address: this.is_out ? this.from : this.to,
            };
        },

        dateTime() {
            return new Date(this.timestamp);
        },
    },

    created() {
        this.$bus.$on('tx-close-all', () => this.isVisible = false);
    },

    beforeDestroy() {
        this.$bus.$off('tx-close-all');
    },

    methods: {
        open() {
            !this.isVisible && this.$bus.$emit('tx-close-all');
            this.isVisible = !this.isVisible;
        },
    },
};
</script>
