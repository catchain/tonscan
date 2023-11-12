<style lang="scss">
.chart-change-indicator {
    display: flex;
    align-items: center;
    font-weight: 400;
    margin-left: -1px;
    &--red {
        color: #f74b4c;
        .chart-change-indicator__arrow {
            transform: none;
            background: #f74b4c3b;
            &__svg {
                bottom: -1px;
            }
        }
    }
    &--green {
        color: #42bd62;
        .chart-change-indicator__arrow {
            transform: rotate(180deg);
            background: #42bd623b;
        }
    }
    &__arrow {
        margin-right: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0;
        padding: 0;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        &__svg {
            position: relative;
            width: 10px;
            height: 9px;
        }
    }
    &__range {
        color: var(--body-muted-text-color) !important;
        margin-left: 0.8ex;
        opacity: .7;
    }
}
</style>

<template>
    <div class="chart-change-indicator" v-bind:class="`chart-change-indicator--${color}`">
        <div class="chart-change-indicator__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 9" class="chart-change-indicator__arrow__svg">
                <path d="M1.008 5 4.01 8.003 6.992 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.01 8.002V0" stroke="currentColor" stroke-width="2"/>
            </svg>
        </div>
        {{sign}}{{value}}%
        <span class="chart-change-indicator__range">({{range}})</span>
    </div>
</template>

<script>
export default {
    props: {
        change: Number,
        rangeDays: Number,
    },

    computed: {
        color() {
            return this.change < 0 ? 'red' : 'green';
        },
        sign() {
            return this.change < 0 ? '−' : '+';
        },
        value() {
            return Math.abs(this.change * 100).toFixed(2);
        },
        range() {
            if (this.rangeDays <= 2) {
                return (this.rangeDays * 24) + this.$t('common.h');

            } else if (this.rangeDays < 365) {
                return this.rangeDays + this.$t('common.d');

            } else {
                return Math.round(this.rangeDays / 365) + this.$t('common.y');
            }
        },
    },
};
</script>
