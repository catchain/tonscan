<template>
    <section>
        <div class="card">
            <div class="card-title">
                {{ $t('vesting.address') }}
                <a class="card-title__link" v-bind:href="$t('vesting.title_help_link')" target="_blank"
                    style="margin-left: auto;">
                    <icon-title-help class="card-title__icon" style="width: auto; height: auto;" />
                    {{ $t('common.what_is_this') }}
                </a>
            </div>

            <div style="flex-grow: 1;">
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('common.address')" />
                    <div class="card-row__value">
                        <ui-copy-button v-bind:copy="address" v-bind:successMessage="$t('address.info.copy_success')">
                            {{ address }}
                        </ui-copy-button>

                        <span class="card-main-qr-button" v-on:click="qrModalVisible = true">
                            <svg v-pre class="card-main-qr-button__icon" width="14" height="14" viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h14v14H0z" />
                                    <path
                                        d="M8.6 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm0 3.8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm3.8 0h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Zm-1.9-1.9h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6ZM12.4 8h.5a.6.6 0 0 1 .6.6v.5a.6.6 0 0 1-.6.6h-.5a.6.6 0 0 1-.6-.6v-.5a.6.6 0 0 1 .6-.6Z"
                                        fill="currentColor" />
                                    <path
                                        d="M2.15.65h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm0 7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Zm7.5-7.5h2.2a1.5 1.5 0 0 1 1.5 1.5v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.2a1.5 1.5 0 0 1-1.5-1.5v-2.2a1.5 1.5 0 0 1 1.5-1.5Z"
                                        stroke="currentColor" stroke-width="1.3" />
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('vesting.owner')" />
                    <div class="card-row__value" style="display: flex; align-items: center;">
                        <template v-if="vesting.owner_address">
                            <ui-address v-bind:address="vesting.owner_address" />
                        </template>

                        <span v-else class="skeleton">EQDCH6....Loh</span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('address.info.balance')" />
                    <div class="card-row__value" v-if="wallet.balance == '0' || wallet.balance">
                        {{ $ton(wallet.balance) }}
                        <span v-text="addressMeta.tonIcon || 'TON'" title="TON" />

                        <template v-if="wallet.balance != '0'">
                            <span v-if="$store.state.exchangeRate" style="color: #717579">
                                ≈ <ui-fiat v-bind:tonValue="wallet.balance" />
                            </span>
                        </template>

                        <span class="muted">&bull;</span> <a v-bind:href="vestingLink" target="_blank">{{ $t('vesting.link') }}</a>
                    </div>
                    <div v-else class="card-row__value">
                        <span class="skeleton">00000 TON ≈ 00000 USD</span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('nominator_pool.start_date')" />
                    <div class="card-row__value">
                        <span v-if="startTime">{{ startTime }}</span>
                        <span v-else class="skeleton">26.07.2023, 16:30:00</span>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('vesting.vesting')" />
                    <div class="card-row__value card-row__value--flex-row">
                        <div class="card-row">
                            <div class="card-row__name" v-text="$t('vesting.total')" />
                            <div class="card-row__value">
                                <span v-if="vesting.vesting_total_amount === undefined" class="skeleton">10000 TON</span>
                                <template v-else>
                                    {{ $ton(vesting.vesting_total_amount) }} TON
                                </template>
                            </div>
                        </div>
                        <div class="card-row">
                            <div class="card-row__name" v-text="$t('vesting.available')" />
                            <div class="card-row__value">
                                <span v-if="vestingAvailable === undefined" class="skeleton">10000 TON</span>
                                <template v-else>
                                    {{ $ton(vestingAvailable) }} TON
                                </template>
                            </div>
                        </div>
                        <div class="card-row">
                            <div class="card-row__name" v-text="$t('vesting.locked')" />
                            <div class="card-row__value">
                                <span v-if="vesting.locked_amount === undefined" class="skeleton">10000 TON</span>
                                <template v-else>
                                    {{ $ton(vesting.locked_amount) }} TON
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('vesting.duration')" />
                    <div class="card-row__value card-row__value--flex-row">
                        <div class="card-row">
                            <div class="card-row__name" v-text="$t('vesting.total')" />
                            <div class="card-row__value">
                                <span v-if="vestingDuration === undefined" class="skeleton">100 Days</span>
                                <template v-else>
                                    {{ vestingDuration }}
                                </template>
                            </div>
                        </div>
                        <div class="card-row">
                            <div class="card-row__name" v-text="$t('vesting.cliff_period')" />
                            <div class="card-row__value">
                                <span v-if="cliffDuration === undefined" class="skeleton">10 Days</span>
                                <template v-else>
                                    {{ cliffDuration }}
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-row">
                    <div class="card-row__name" v-text="$t('vesting.unlock')" />
                    <div class="card-row__value">
                        <span v-if="unlockPeriod === undefined" class="skeleton">10 Days</span>
                        <template v-else>
                            {{ $tc('vesting.unlock_text', unlockPeriod) }}
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <ui-modal class="qr-modal" v-bind:isOpen.sync="qrModalVisible">
            <ui-qr show-logo v-bind:value="`ton://transfer/${addressCanonical}`" v-bind:size="300" />
        </ui-modal>

        <div style="display: none">
            <a ref="devExplorerLink" target="_blank" v-bind:href="devExplorerUrl">View in Toncoin Explorer</a>
        </div>

        <address-tabs v-bind:address="addressCanonical" v-bind:isActive="isActive"
            v-on:lastActivityUpdate="handleLastActivityUpdate" style="margin-top: 18px;" />
    </section>
</template>

<script>
import { DEV_EXPLORER_ADDRESS } from '~/config.js';
import { getAddressInfo, checkAddress, getVestingData } from '~/api';
import { canonizeAddress } from '~/tonweb.js';
import AddressTabs from '../address/AddressTabs.vue';
import IconTitleHelp from '@primer/octicons/build/svg/info-16.svg?inline';
import UiQr from '~/components/UiQr.vue';

export default {
    props: {
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            addressCanonical: undefined,
            qrModalVisible: false,
            wallet: {},
            vesting: {},
            startTime: undefined,
            vestingAvailable: undefined,
            vestingDuration: undefined,
            cliffDuration: undefined,
            unlockPeriod: undefined,
            lastActivity: undefined,
            contractExtendedInfo: undefined,
        };
    },

    computed: {
        addressMeta() {
            return this.$store.getters.getAddressMeta(this.address);
        },

        isScam() {
            return this.addressMeta.isScam || this.contractExtendedInfo?.meta?.is_scam;
        },

        devExplorerUrl() {
            return `${DEV_EXPLORER_ADDRESS}/account?account=${this.address}`;
        },

        isActive() {
            if (this.wallet.is_active === undefined) {
                return undefined; // keep loading state
            }

            return this.wallet.is_active;
        },

        vestingLink() {
            return `https://vesting.ton.org/#${this.address}`;
        }
    },

    watch: {
        $route() {
            this.loadData();
        },

        address: {
            immediate: true,
            handler: 'canonizeAddress',
        },
    },

    created() {
        this.loadData();
        this.$bus.$on('ctrl-alt-z', this.goToDevExplorer);
    },

    beforeDestroy() {
        this.$bus.$off('ctrl-alt-z', this.goToDevExplorer);
    },

    methods: {
        canonizeAddress() {
            this.addressCanonical = canonizeAddress(this.address);
        },

        async loadData() {
            this.wallet = await getAddressInfo(this.address);
            const { vesting_wallet } = await getVestingData(this.address).catch((error) => {
                if (error.response.status === 400 || error.response.status === 500) {
                    this.$bus.$emit('showToast', this.$t('vesting.error.redirect_invalid'));
                    this.$router.push({
                        name: 'address',
                        params: {
                            address: this.address,
                            lang: this.$i18n.locale,
                        },
                    });
                }
            });
            this.vesting = vesting_wallet;

            this.startTime = this.formatDate((vesting_wallet.vesting_start_time) * 1000);
            this.vestingAvailable = vesting_wallet.vesting_total_amount - vesting_wallet.locked_amount;
            this.vestingDuration = this.formatPeriod(vesting_wallet.vesting_total_duration);
            this.cliffDuration = this.formatPeriod(vesting_wallet.cliff_duration);
            this.unlockPeriod = this.formatPeriod(vesting_wallet.unlock_period);

            if (this.wallet.invalid) {
                return;
            }

            this.contractTypeVisible = this.wallet.is_active;

            checkAddress(this.address)
                .then((info) => this.contractExtendedInfo = Object.freeze(info))
                .catch(e => void e);
        },

        formatDate(timestamp) {
            const dateTime = new Intl.DateTimeFormat(this.$i18n.locale, {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
                year: 'numeric',
                hourCycle: 'h23',
            });
            return dateTime.format(timestamp);
        },

        formatPeriod(seconds) {
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor(seconds % (3600 * 24) / 3600);
            const m = Math.floor(seconds % 3600 / 60);
            const s = Math.floor(seconds % 60);

            const arr = [];

            if (this.$i18n.locale == 'ru') {
                arr.push(d === 0 ? '' : d + ' дней',
                    h === 0 ? '' : h + ' часов',
                    m === 0 ? '' : m + ' минут',
                    s === 0 ? '' : s + ' секунд');
            } else {
                arr.push(d === 0 ? '' : d + ' days',
                    h === 0 ? '' : h + ' hours',
                    m === 0 ? '' : m + ' min',
                    s === 0 ? '' : s + ' sec');
            }

            return arr.filter(s => s !== '').join(' ');
        },

        handleLastActivityUpdate(timestamp) {
            this.lastActivity = timestamp;
        },

        goToDevExplorer() {
            this.$refs.devExplorerLink.click();
        },
    },

    components: {
        AddressTabs, IconTitleHelp, UiQr
    },
};
</script>

<style lang="scss"></style>
