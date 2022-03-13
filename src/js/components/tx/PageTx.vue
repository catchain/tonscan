<template>
    <section>
        <section v-if="isError">
            <div class="alert" v-text="$t('error.invalid_tx')"/>
        </section>

        <div v-show="!isError" class="card">
            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.address')"/>
                <div class="card-row__value">
                    <ui-copy-button show-button v-bind:copy="address" v-bind:successMessage="$t('address.info.copy_success')">
                        {{address}}
                    </ui-copy-button>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.lt')"/>
                <div class="card-row__value">
                    <ui-copy-button show-button v-bind:copy="lt" v-bind:successMessage="$t('tx.lt_copy_success')">
                        {{lt}}
                    </ui-copy-button>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.hash')"/>
                <div class="card-row__value">
                    <ui-copy-button show-button v-bind:copy="hash" v-bind:successMessage="$t('tx.hash_copy_success')">
                        {{hash}}
                    </ui-copy-button>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.timestamp')"/>
                <div class="card-row__value">
                    <span v-if="timestamp" v-text="timestamp"/>
                    <span v-else class="skeleton">00/00/2000 10:00</span>
                </div>
            </div>

            <div class="card-row">
                <div class="card-row__name" v-text="$t('tx.fee')"/>
                <div class="card-row__value">
                    <span v-if="isLoading" class="skeleton">000000 TON</span>
                    <span v-else>{{$fee(fee)}} TON</span>
                </div>
            </div>

            <div class="card-row" style="border-bottom: none;">
                <div class="card-row__name" v-text="$t('tx.msgs')"/>
                <div class="card-row__value">
                    <span v-if="isLoading" class="skeleton">1 input, 1 output</span>
                    <span v-else-if="!in_msg && !out_msgs.length" v-text="$t('tx.msgs_empty')"/>
                    <span v-else v-text="$t('tx.msgs_count', [1, out_msgs.length])"/>
                </div>
            </div>

            <div class="tx-page-messages">
                <div v-if="in_msg" class="tx-page-msg">
                    <div class="card-row__name">
                        <span class="tx-table__badge tx-table__badge--in">IN</span>
                    </div>
                    <tx-msg class="tx-page-msg-details"
                        v-bind:source="in_msg.source"
                        v-bind:destination="in_msg.destination"
                        v-bind:value="in_msg.value"
                        v-bind:fwd_fee="in_msg.fwd_fee"
                        v-bind:ihr_fee="in_msg.ihr_fee"
                        v-bind:created_lt="in_msg.created_lt"
                        v-bind:body_hash="in_msg.body_hash"
                        v-bind:message="in_msg.message"/>
                </div>

                <div v-for="msg in out_msgs" class="tx-page-msg"> 
                    <div class="card-row__name">
                        <span class="tx-table__badge tx-table__badge--out">OUT</span>
                    </div>
                    <tx-msg class="tx-page-msg-details"
                        v-bind:source="msg.source"
                        v-bind:destination="msg.destination"
                        v-bind:value="msg.value"
                        v-bind:fwd_fee="msg.fwd_fee"
                        v-bind:ihr_fee="msg.ihr_fee"
                        v-bind:created_lt="msg.created_lt"
                        v-bind:body_hash="msg.body_hash"
                        v-bind:message="msg.message"/>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { getTransaction } from '~/api.js';
import TxMsg from './TxMsg.vue';

export default {
    props: {
        lt: String,
        hash: String,
        address: String,
    },

    data() {
        return {
            fee: undefined,
            timestamp: undefined,
            in_msg: undefined,
            isLoading: true,
            isError: false,
            out_msgs: [],
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            this.isLoading = true;
            this.isError = false;

            getTransaction(this.$props).then(tx => {
                this.fee = tx.fee;
                this.timestamp = new Date(parseInt(tx.utime + '000')).toLocaleString();
                this.in_msg = tx.in_msg ? Object.freeze(tx.in_msg) : undefined;
                this.out_msgs = tx.out_msgs.map(Object.freeze);
            })
            .catch((e) => {
                this.isError = true;
                console.error(e);
            })
            .then(() => {
                this.isLoading = false;
            });
        },
    },

    components: {
        TxMsg,
    },
};
</script>
