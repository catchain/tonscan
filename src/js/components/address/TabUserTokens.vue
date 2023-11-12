<template>
    <section>
        <div v-if="emptyHistory"
            class="tx-history-empty-panel"
            v-text="$t('address.tokens.no_tokens')"/>

        <div v-else class="tx-history-wrap">
            <table class="tx-table">
                <thead>
                    <tr>
                        <th width="200">
                            <div class="tx-table__cell">
                                <ui-round-image v-once class="jetton-list__icon jetton-list__icon--rastopyrka"/>
                                {{$t('address.tokens.table_token_name')}}
                            </div>
                        </th>
                        <th width="200">
                            <div class="tx-table__cell" v-text="$t('address.tokens.table_token_balance')"/>
                        </th>
                        <th>
                            <div class="tx-table__cell tx-table__cell--align-right" v-text="$t('address.tokens.table_token_jetton_wallet')"/>
                        </th>
                    </tr>
                </thead>

                <tbody v-show="!address || jettons.length == 0">
                    <tr v-for="i in 5">
                        <td>
                            <div class="tx-table__cell">
                                <ui-round-image class="jetton-list__icon" size="tiny"/>
                                <span v-pre class="tx-table-cell-skeleton" style="width: 100%;"></span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell">
                                <span class="tx-table-cell-skeleton" style="width: 100%;"></span>
                            </div>
                        </td>
                        <td v-pre>
                            <div class="tx-table__cell">
                                <span class="tx-table-cell-skeleton" style="width: 100%;"></span>
                            </div>
                        </td>
                    </tr>
                </tbody>


                <tr v-for="wallet in jettons" v-bind:key="wallet.address">
                    <td>
                        <ui-link v-bind:to="{ name: 'jetton', params: { address: wallet.jetton_address }}" class="tx-table__cell">
                            <ui-round-image class="jetton-list__icon" size="tiny" v-bind:src="wallet.jetton_meta.image.w72"/>
                            <template v-if="wallet.jetton_meta.name">
                                {{wallet.jetton_meta.name}}
                            </template>
                            <ui-address disabled v-else v-bind:address="wallet.jetton_address"/>
                        </ui-link>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <b>{{$ton(wallet.balance, wallet.jetton_meta.decimals)}}</b>
                            <span style="margin-left: 4px; opacity: .5">{{wallet.jetton_meta.symbol}}</span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <ui-address v-bind:address="wallet.address"/>
                        </div>
                    </td>
                </tr>

                <tr v-show="emptyJettonsVisible" v-for="wallet in emptyJettons" v-bind:key="wallet.address">
                    <td>
                        <ui-link v-bind:to="{ name: 'jetton', params: { address: wallet.jetton_address }}" class="tx-table__cell">
                            <ui-round-image class="jetton-list__icon" size="tiny" v-bind:src="wallet.jetton_meta.image.w72"/>
                            <template v-if="wallet.jetton_meta.name">
                                {{wallet.jetton_meta.name}}
                            </template>
                            <ui-address disabled v-else v-bind:address="wallet.jetton_address"/>
                        </ui-link>
                    </td>
                    <td>
                        <div class="tx-table__cell">
                            <b>{{$ton(wallet.balance, wallet.jetton_meta.decimals)}}</b>
                            <span style="margin-left: 4px; opacity: .5">{{wallet.jetton_meta.symbol}}</span>
                        </div>
                    </td>
                    <td>
                        <div class="tx-table__cell tx-table__cell--align-right">
                            <ui-address v-bind:address="wallet.address"/>
                        </div>
                    </td>
                </tr>
            </table>  
        </div>

        <div v-if="emptyJettons.length > 0 && !emptyJettonsVisible" class="block-empty-jettons">
            <div class="card-row__name" style="padding-left: 12px">
                <div class="block-boring-expand" v-on:click="emptyJettonsVisible = true">
                    {{$t('address.tokens.show_empty_tokens', [emptyJettons.length])}}

                    <svg v-pre xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" d="m1.5 4.75 5.5 5.5 5.5-5.5"/>
                    </svg>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import { getJettonBalances as getJettonWalletsTonscan } from '~/api/extenderContracts.js';
import { getJettonBalances as getJettonWalletsTonapi } from '~/api/tonapi.js';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            jettons: [],
            emptyJettons: [],
            emptyJettonsVisible: false,
            isLoading: true,
            emptyHistory: false,
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        loadData() {
            getJettonWalletsTonapi(this.address).then((data) => {
                // push unnamed tokens to the end of the list:
                data.sort((a, b) => !b.jetton_meta.name ? -1 : 1);

                data.forEach(jetton => {
                    if (jetton.balance == 0){
                        this.emptyJettons.push(jetton)
                    } else {
                        this.jettons.push(jetton)
                    }
                });
                
                this.emptyHistory = data.length === 0;
            });
        },
    },
};
</script>

<style lang="scss">
.jetton-list__icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    &--rastopyrka {
        visibility: hidden;
        height: 0;
    }
}
</style>
