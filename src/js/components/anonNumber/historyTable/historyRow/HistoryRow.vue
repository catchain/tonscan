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
            
            <td-type v-bind:type="type" />
            <td-price v-bind:price="price" />
            
            <td>
                <div class="tx-table__cell">
                    <icon-expand class="tx-table-expand-caret" v-bind:class="{
                        'tx-table-expand-caret--expanded': isVisible,
                    }"/>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
import IconExpand from '@img/icons/tonscan/chevron-bottom-14.svg?inline';
import TransactionDetail from '../TransactionDetail.vue';
import TdLink from './TdLink.vue';
import TdFrom from './TdFrom.vue';
import TdReceiver from './TdReceiver.vue';
import TdType from './TdType.vue';
import TdPrice from './TdPrice.vue';


export default {
    props: {
        address: String,
        from: String,
        to: String,
        price: String,
        timestamp: Number,
        type: String,
        
        // is_external: Boolean,
        // is_aggregated: Boolean,
        // is_success: Boolean,
        // is_bounced: Boolean,

        // outputCount: Number,
        // message: String,
        // timestamp: Number,

        // fee: String,
        // txHash: String,
        // txLt: String,
        // exitCode: Number,
        // op: [Number, String],
        // source_type: String,
        // destination_type: String,
        // action: Object
    },

    data() {
        return { isVisible: false };
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

    components: {
        IconExpand,
        TdLink, TdFrom, TdReceiver, TdType, TdPrice,
        TransactionDetail
    },
};
</script>
