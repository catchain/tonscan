<template>
    <nav class="card-title-selector">
        <div v-for="[name, length], index in intervals" class="card-title-selector__item"
            v-bind:class="{ 'card-title-selector__item--active': name == currentInterval.name }"
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
                ['two_weeks', INTERVAL_TWO_WEEKS],
                ['month', INTERVAL_MONTH],
                ['year', INTERVAL_YEAR],
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
