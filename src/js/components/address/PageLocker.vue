<template>
    <section>
        <section v-show="!wallet.invalid">
            <div class="page-nominator-top">
                <div class="card page-nominator-qr-card">
                    <ui-qr class="page-nominator-qr-card__qr-code" show-logo v-bind:value="lockerLink" v-bind:size="242" />

                    <a class="bright-blue-button" v-bind:href="lockerLink" style="padding: 8px 0;">
                        {{ $t('nominator_pool.button_send_ton') }}
                    </a>
                    <p class="page-nominator-qr-card__text muted">
                        <span v-html="$t('nominator_pool.help_text_add_stake', [$ton(50000000000)])" />
                    </p>
                </div>

                <div class="card page-nominator-info-card">
                    <div class="card-title">
                        {{ $t('locker.title') }}
                        <a class="card-title__link" v-bind:href="$t('locker.title_help_link')" target="_blank"
                            style="margin-left: auto;">
                            <icon-title-help class="card-title__icon" style="width: auto; height: auto;" />
                            {{ $t('common.what_is_this') }}
                        </a>
                    </div>
                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('address.info.address')" />
                        <div class="card-row__value">
                            <span v-if="isScam" class="card-main-address-badge card-main-address-badge--scam">SCAM</span>
                            <ui-copy-button class="card-main-address"
                                v-bind:successMessage="$t('address.info.copy_success')" v-bind:copy="address">
                                {{ address }}
                            </ui-copy-button>
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
                        </div>
                        <div v-else class="card-row__value">
                            <span class="skeleton">00000 TON ≈ 00000 USD</span>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('address.info.last_activity')" />
                        <div class="card-row__value">
                            <span v-if="lastActivity === undefined" class="skeleton">99 minutes ago</span>
                            <span v-else-if="!lastActivity" v-text="this.$t('address.info.no_activity')" />
                            <ui-timeago v-else v-bind:timestamp="lastActivity" />
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('locker.storage')" />
                        <div class="card-row__value card-row__value--flex-row">
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('locker.total_deposits')" />
                                <div class="card-row__value">
                                    <span v-if="locker.total_coins_locked === undefined" class="skeleton">10000 TON</span>
                                    <template v-else>
                                        {{ $ton(locker.total_coins_locked) }} TON
                                    </template>
                                </div>
                            </div>

                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('locker.total_rewards')" />
                                <div class="card-row__value">
                                    <span v-if="locker.total_reward === undefined" class="skeleton">10000 TON</span>
                                    <template v-else>
                                        {{ $ton(locker.total_reward) }} TON
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('vesting.duration')" />
                        <div class="card-row__value card-row__value--flex-row">
                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('locker.deposits_until')" />
                                <div class="card-row__value">
                                    <span v-if="locker.deposits_end_time === undefined" class="skeleton">January 20 at
                                        18:40</span>
                                    <template v-else>
                                        {{ depositsUntil }}
                                    </template>
                                </div>
                            </div>

                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('vesting.start')" />
                                <div class="card-row__value">
                                    <span v-if="locker.vesting_start_time === undefined" class="skeleton">January 20 at
                                        18:40</span>
                                    <template v-else>
                                        {{ vestingStart }}
                                    </template>
                                </div>
                            </div>

                            <div class="card-row">
                                <div class="card-row__name" v-text="$t('vesting.vesting_duration')" />
                                <div class="card-row__value">
                                    <span v-if="locker.vesting_total_duration === undefined" class="skeleton">January 20 at
                                        18:40</span>
                                    <template v-else>
                                        {{ vestingDuration }}
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-row">
                        <div class="card-row__name" v-text="$t('locker.unlock')" />
                        <div class="card-row__value">
                            <span v-if="unlockPeriod === undefined" class="skeleton">Every n days after vesting period</span>
                            <template v-else>
                                {{ $tc('locker.unlock_text', unlockPeriod) }}
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <address-tabs v-bind:address="addressCanonical" v-bind:isActive="isActive"
                v-on:lastActivityUpdate="handleLastActivityUpdate" style="margin-top: 18px;" />
        </section>

        <div style="display: none">
            <a ref="devExplorerLink" target="_blank" v-bind:href="devExplorerUrl">View in Toncoin Explorer</a>
        </div>
    </section>
</template>

<script>
import { DEV_EXPLORER_ADDRESS } from '~/config.js';
import { getAddressInfo, checkAddress, getLockerData } from '~/api';
import { canonizeAddress } from '~/tonweb.js';
import AddressTabs from './AddressTabs.vue';
import UiQr from '~/components/UiQr.vue';
import IconTitleHelp from '@primer/octicons/build/svg/info-16.svg?inline';

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
            wallet: {},
            locker: {},
            depositsUntil: undefined,
            vestingStart: undefined,
            vestingDuration: undefined,
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

        lockerLink() {
            return `ton://transfer/${this.address}?text=d`;
        },
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

            const { locker } = await getLockerData(this.address).catch((error) => {
                if (error.response.status === 400 || error.response.status === 500) {
                    this.$bus.$emit('showToast', this.$t('locker.error.redirect_invalid'));
                    this.$router.push({
                        name: 'address',
                        params: {
                            address: this.address,
                            lang: this.$i18n.locale,
                        },
                    });
                }
            });

            this.locker = locker;
            this.depositsUntil = this.formatDate(locker.deposits_end_time * 1000);
            this.vestingStart = this.formatDate(locker.vesting_start_time * 1000);
            this.vestingDuration = this.formatPeriod(locker.vesting_total_duration);
            this.unlockPeriod = this.formatPeriod(locker.unlock_period);

            if (this.wallet.invalid) {
                return;
            }

            checkAddress(this.address)
                .then((info) => this.contractExtendedInfo = Object.freeze(info))
                .catch(e => void e);
        },

        formatDate(timestamp) {
            const dateTime = new Intl.DateTimeFormat(this.$i18n.locale, {
                day: 'numeric',
                month: 'short',
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
        UiQr, AddressTabs, IconTitleHelp,
    },
};
</script>

<style lang="scss"></style>
