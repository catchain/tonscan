<template>
    <div class="page-address-contract-info">
        <span class="page-address-contract-info__block">
            {{$t('address.contract_type.domain_name')}}
        </span>

        <span class="page-address-contract-info__block">
            <ui-link v-if="resolved_value" v-bind:to="routerParams" v-text="displayedDomain"/>
            <strong v-else v-text="displayedDomain"/>
        </span>

        <span class="page-address-contract-info__block" v-if="auction_active">
            <i18n path="address.contract_type.sale.sale_info" tag="span" class="muted">
                <a target="_blank" ref="nofollow"
                    v-bind:href="`https://dns.ton.org/#${domain_name}`"
                    v-text="$t('address.contract_type.sale.on_auction')"/>

                <template>{{$ton(currentPrice)}} TON</template>
            </i18n>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        domain_name: {
            type: String,
            requried: true,
        },
        resolved_value: String,
        auction_active: Boolean,
        auction: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        routerParams() {
            if (!this.resolved_value) return undefined;

            return Object.freeze({
                name: 'address',
                params: {
                    address: this.resolved_value,
                },
            });
        },

        displayedDomain() {
            let domain = this.domain_name;

            if (domain.length >= 28) {
                domain = domain.substr(0, 12) + '…' + domain.substr(domain.length - 6);
            }

            return domain + '.ton';
        },

        currentPrice() {
            return this.auction.top_bid * 1.05;
        },
    },
};
</script>
