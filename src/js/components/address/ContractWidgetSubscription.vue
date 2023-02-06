<template>
    <div class="card">
        <div class="modal-banner">
            <aside class="modal-banner-icon">
                <icon-subscription class="modal-banner-icon__svg"/>
            </aside>
            <div class="modal-banner__text" v-html="$t('subscription.contract_description_html')"/>
        </div>

        <div class="card-row">
            <div class="card-row__name" v-text="$t('subscription.subscriber')"/>
            <div class="card-row__value">
                <ui-address v-if="subscriber" v-bind:address="subscriber"/>
            </div>
        </div>
        <div class="card-row">
            <div class="card-row__name" v-text="$t('subscription.beneficiary')"/>
            <div class="card-row__value">
                <ui-address v-if="beneficiary" v-bind:address="beneficiary"/>
            </div>
        </div>
        <div class="card-row">
            <div class="card-row__name" v-text="$t('subscription.price')"/>
            <div class="card-row__value">
                {{$ton(amount)}} TON
                <template v-if="paymentPeriod">
                    {{$t(`subscription.period.${paymentPeriod}`)}}
                </template>
            </div>
        </div>
        <div class="card-row" v-if="startDateTs > 0">
            <div class="card-row__name" v-text="$t('subscription.first_payment_date')"/>
            <div class="card-row__value">
                <ui-timeago v-bind:timestamp="startDateTs"/>
                <span class="muted">
                    ({{startDate}})
                </span>
            </div>
        </div>
        <div v-if="paymentDateTs > 0" class="card-row">
            <div class="card-row__name" v-text="$t('subscription.last_payment_date')"/>
            <div class="card-row__value">
                <ui-timeago v-bind:timestamp="paymentDateTs"/>
                <span class="muted">
                    ({{paymentDate}})
                </span>
            </div>
        </div>
        <div class="card-row">
            <div class="card-row__name" v-text="$t('subscription.subscription_id')"/>
            <div class="card-row__value">
                <span v-text="subscriptionId"/>
            </div>
        </div>
    </div>
</template>

<script>
import { checkAddress } from '~/api';
import IconSubscription from '@img/icons/material-duotone/currency-exchange.svg?inline';

const detectInterval = function(timeRange) {
    // from 28 to 31 days
    if (timeRange >= 2332800 && timeRange <= 2764800) {
        return 'monthly';
    }

    return null;
};

export default {
    props: {
        wallet: String,
        beneficiary: String,
        amount: [Number, String],
        period: Number,
        start_time: Number,
        last_payment_time: Number,
        subscription_id: [Number, String],
    },

    data() {
        return {
            subscriber: undefined,
            paymentPeriod: undefined,
            startDateTs: 0,
            startDate: undefined,
            paymentDateTs: 0,
            paymentDate: undefined,
            subscriptionId: undefined,
        };
    },

    mounted() {
        this.subscriber = this.wallet;
        this.paymentPeriod = detectInterval(this.period);

        const startDate = new Date(this.start_time * 1000);
        this.startDateTs = this.start_time * 1000;
        this.startDate = startDate.toLocaleString();

        const paymentDate = new Date(this.last_payment_time * 1000);
        this.paymentDateTs = this.last_payment_time * 1000;
        this.paymentDate = paymentDate.toLocaleString();

        this.subscriptionId = this.subscription_id;
    },

    components: {
        IconSubscription,
    },
};
</script>
