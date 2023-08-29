<template>
    <tbody>
        <tr v-on:click="open()">
            
            <td-link
                v-bind:is_success="is_success" 
                v-bind:is_bounced="is_bounced" 
                v-bind:exitCode="exitCode" 
                v-bind:address="address" 
                v-bind:txHash="txHash"
                v-bind:txLt="txLt"
            />

            <td>
                <ui-timeago class="tx-table__cell" v-bind:timestamp="timestamp"/>
            </td>

            <td-from
                v-bind:action="action"
                v-bind:address="address"
                v-bind:from="from"
                v-bind:is_external="is_external"
                v-bind:source_type="source_type"
            />
            
            <td-message-direction 
                v-bind:address="address" 
                v-bind:is_service="is_service"
                v-bind:from="from" 
                v-bind:to="to" 
            />

            <td-receiver
                v-bind:is_aggregated="is_aggregated" 
                v-bind:outputCount="outputCount" 
                v-bind:destination_type="destination_type" 
                v-bind:address="address" 
                v-bind:to="to" 
                v-bind:timestamp="timestamp" 
                v-bind:action="action"
                v-bind:txHash="txHash"
                v-bind:txLt="txLt"
            />
            
            <td-type />
            <td-price />
            
            <!-- Expand chevron: -->
            <td>
                <div class="tx-table__cell">
                    <icon-expand class="tx-table-expand-caret" v-bind:class="{
                        'tx-table-expand-caret--expanded': isVisible,
                    }"/>
                </div>
            </td>
        </tr>

        <transaction-detail
            v-if="isVisible"
            v-bind:is_success="is_success"
            v-bind:is_bounced="is_bounced"
            v-bind:exitCode="exitCode"
            v-bind:txHash="txHash"
            v-bind:txLt="txLt"
            v-bind:fee="fee"
            v-bind:message="message"
        />
    </tbody>
</template>

<script>
import IconExpand from '@img/icons/tonscan/chevron-bottom-14.svg?inline';
import TdLink from './TdLink.vue';
import TdFrom from './TdFrom.vue';
import TdMessageDirection from './TdMessageDirection.vue';
import TdReceiver from './TdReceiver.vue';
import TdType from './TdType.vue';
import TdPrice from './TdPrice.vue';
import TransactionDetail from './TransactionDetail.vue';


export default {
    props: {
        address: String,
        date: String,
        from: String,
        is_service: Boolean,
        is_external: Boolean,
        is_aggregated: Boolean,
        is_success: Boolean,
        is_bounced: Boolean,
        outputCount: Number,
        to: String,
        amount: String,
        message: String,
        timestamp: Number,
        fee: String,
        txHash: String,
        txLt: String,
        exitCode: Number,
        op: [Number, String],
        source_type: String,
        destination_type: String,
        action: Object,
        meta: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            isVisible: false,
        };
    },

    created() {
        this.$bus.$on('tx-close-all', () => this.isVisible = false);
    },

    beforeDestroy() {
        this.$bus.$off('tx-close-all');
    },

    methods: {
        open() {
            console.log('open', this.isVisible);
            !this.isVisible && this.$bus.$emit('tx-close-all');
            this.isVisible = !this.isVisible;
        },
    },

    components: {
        IconExpand,
        TdLink, TdFrom, TdMessageDirection, TdReceiver, TdType, TdPrice,
        TransactionDetail
    },
};
</script>

<style lang="scss">
.tx-row-msg-action {
    font-size: 13px;
    display: flex;
    align-items: center;
    background: var(--card-row-separator);
    padding: 4px 8px 4px 6px;
    margin: -6px 8px;
    border-radius: 8px;
    cursor: help;
    &--single {
        margin-right: -1px;
    }
    &__icon {
        fill: currentColor;
        opacity: .6;
        margin-right: 6px;
    }
}
</style>
