<style lang="scss">
.interval-selector {
    display: flex;
    align-items: center;
    padding: 3px;
    margin: -3px;
    border-radius: 6px;
    background: var(--chart-interval-selector-background);
    color: var(--chart-interval-selector-color);
    text-transform: none;
    margin-left: auto;

    &__item {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
        white-space: nowrap;
        transition: all .3s ease-in-out;

        &--active {
            background: var(--chart-interval-selector-item-background);
            color: var(--chart-interval-selector-item-active-color);
        }
    }
}

</style>

<template>
    <nav class="interval-selector">
        <div v-for="[name, length], index in intervals" class="interval-selector__item"
            v-bind:class="{ 'interval-selector__item--active': name == currentInterval.name }"
            v-on:click="changeIntervalIndex(index)">
            {{name}} 
        </div>
    </nav>
</template>

<script>
export const INTERVAL_TWO_WEEKS = 14;
export const INTERVAL_MONTH = 30;
export const INTERVAL_YEAR = 365;

export default {
    props: {
        value: {
            type: Number,
            validator(value) {
                return [INTERVAL_TWO_WEEKS, INTERVAL_MONTH, INTERVAL_YEAR].includes(value);
            },
        },
    },

    data() {
        return {
            currentIntervalIndex: 0,
        };
    },

    computed: {
        intervals() {
            return [
                [this.$t('common.two_weeks'), INTERVAL_TWO_WEEKS],
                [this.$t('common.month'), INTERVAL_MONTH],
                [this.$t('common.year'), INTERVAL_YEAR],
            ];
        },

        currentInterval() {
            const [ name, length ] = this.intervals[this.currentIntervalIndex];
            return { name, length };
        },
    },

    mounted() {
        const idx = this.value !== undefined
            ? this.intervals.findIndex(([ _, length ]) => length == this.value)
            : 1;

        this.changeIntervalIndex(idx);
    },

    methods: {
        changeIntervalIndex(index) {
            this.currentIntervalIndex = index;
            this.$emit('input', this.currentInterval.length);
        },
    },
};
</script>
