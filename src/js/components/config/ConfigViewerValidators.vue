<template>
    <div class="tx-history-wrap">
        <table class="ui-table validators-config-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Public key</th>
                    <th>ADNL</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody v-if="validators">
                <tr v-for="(validator, index) in validators" v-bind:key="index">
                    <td><span class="muted">{{ index + 1 }}</span></td>
                    <td>
                        {{ formatPublicKey(validator.public_key) }}
                    </td>
                    <td class="adnl-cell">
                        {{ formatADNL(validator.adnl_addr) }}
                        <ui-copy-button class="copy-adnl-icon" v-bind:successMessage="$t('address.info.copy_success')"
                            v-bind:copy="validator.adnl_addr">
                        </ui-copy-button>
                    </td>
                    <td>{{ validator.weight }}</td>
                </tr>
            </tbody>
            <div class="show-more-container show-more-container--config">
                <ui-link v-bind:to="{ name: 'validators' }">
                    <button>{{ $t('common.show_more') }}
                        <svg v-pre xmlns="http://www.w3.org/2000/svg" fill="none"
                            style="margin-left: 4px; width: 16px; height:12px; transform: scale(.8);">
                            <path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
                                d="m1.5 4.75 5.5 5.5 5.5-5.5" />
                        </svg>
                    </button>
                </ui-link>
            </div>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        validators: undefined,
    },

    methods: {
        formatADNL(adnl) {
            return adnl.substr(0, 5) + '...' + adnl.substr(-5);
        },

        formatPublicKey(adnl) {
            return adnl.substr(0, 10) + '...' + adnl.substr(-10);
        },
    },
};
</script>

<style lang="scss">
.validators-config-table {
    width: 100%;

    thead {
        background-color: transparent !important;
    }

    th {
        border-radius: 0.5rem 0.5rem 0 0;
        padding-top: 0;
    }

    th,
    td {
        padding: 10px 12px !important;
    }

    td {
        border-top: none;
    }

    tr>td:first-child {
        width: 26px;
    }

    .copy-adnl-icon {
        opacity: 0;
        transition: .2s;
    }

    .adnl-cell:hover {
        cursor: default;

        .copy-adnl-icon {
            opacity: 1;
        }
    }
}
</style>
