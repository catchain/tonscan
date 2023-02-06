<template>
    <div class="page-address-contract-info">
        <span class="page-address-contract-info__block" v-text="$t('address.contract_type.storage_provider.name')"/>
        <span class="page-address-contract-info__block">
            <i18n path="address.contract_type.storage_provider.rate_template">
                <template v-slot:period>
                    <span class="storage-provider-param-selector"
                        v-on:click="changeTimeframe"
                        v-text="$t(`address.contract_type.storage_provider.rate_value_${currentTimeframe}`)"/>
                </template>
            </i18n>
            
            <strong style="margin: 0 0.6ex">{{ratePerBytesPerTimeframe}} TON</strong>

            <i18n path="address.contract_type.storage_provider.bytes_template">
                <template v-slot:value>
                    <span class="storage-provider-param-selector"
                        v-on:click="changeBytePrefix"
                        v-text="$t(`address.contract_type.storage_provider.bytes_value_${currentBytePrefix}`)"/>
                </template>
            </i18n>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        acceptsNewContracts: Boolean,
        dailyRatePerMegabyte: String,
    },

    data() {
        return {
            bytePrefixIndex: 1,
            timeframeIndex: 2,
        };
    },

    computed: {
        bytePrefixes() {
            return Object.freeze([
                ['mb', 1],
                ['gb', 1024],
                ['tb', 1024 * 1024],
            ]);
        },

        currentBytePrefix() {
            return this.bytePrefixes[this.bytePrefixIndex][0];
        },

        timeframes() {
            return Object.freeze([
                ['hour',  0.042],
                ['day', 1],
                ['month', 30],
                ['year', 365],
            ]);
        },

        currentTimeframe() {
            return this.timeframes[this.timeframeIndex][0];
        },

        ratePerBytesPerTimeframe() {
            const [ byteKey, byteMultiplier ] = this.bytePrefixes[this.bytePrefixIndex];
            const [ timeframeKey, timeframeMultiplier ] = this.timeframes[this.timeframeIndex];

            const nanoTonsRate = this.dailyRatePerMegabyte * byteMultiplier * timeframeMultiplier;

            if (nanoTonsRate.toString().length < 10) {
                return nanoTonsRate / 10 ** 9;
            }

            return Math.round(nanoTonsRate / 10 ** 9);
        },
    },

    methods: {
        changeBytePrefix() {
            if (this.bytePrefixIndex === this.bytePrefixes.length - 1) {
                this.bytePrefixIndex = 0;
            } else {
                this.bytePrefixIndex += 1;
            }
        },

        changeTimeframe() {
            if (this.timeframeIndex === this.timeframes.length - 1) {
                this.timeframeIndex = 0;
            } else {
                this.timeframeIndex += 1;
            }
        },
    },
};
</script>

<style lang="scss">
.storage-provider-param-selector {
    color: var(--blue-bright);
    cursor: pointer;
    border-bottom: 1px dotted;
}
</style>