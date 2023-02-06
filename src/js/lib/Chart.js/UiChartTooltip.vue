<template>
    <aside class="chart-tooltip" v-bind:style="style">
        <header class="chart-tooltip__header" v-text="title"/>
        <ul class="chart-tooltip__items">
            <li class="chart-tooltip__column" v-for="legend in values">
                <span class="chart-tooltip__line" v-bind:style="{ background: legend.color }"/>
                <footer class="chart-tooltip__footer">
                    <header>
                        {{legend.value}}<template v-if="legend.suffix">{{legend.suffix}}</template>
                    </header>

                    <!-- Don't show empty labels and pie/donut labels: -->
                    <div v-if="legend.label && values.length > 1" v-text="legend.label"/>
                </footer>
            </li>
        </ul>
    </aside>
</template>

<script>
export default {
    formatter: undefined,

    props: {
        left: Number,
        top: Number,
        header: [Number, String],
        suffix: String,
        tickDiff: Number,
        visible: {
            type: Boolean,
            default: false,
        },
        values: {
            type: Array,
            default: () => [{}],
        },
    },

    watch: {
        tickDiff: {
            immediate: true,
            handler(diff) {
                if (!diff) return;

                let hourFormat = undefined;
                let minuteFormat = undefined;

                // If previous/next tick has the same date, also show the time:
                if (diff < (86400 - 30)) {
                    hourFormat = '2-digit';
                    minuteFormat = '2-digit';
                }

                this.$options.formatter = new Intl.DateTimeFormat(this.$i18n.locale, {
                    day: 'numeric',
                    month: 'long',
                    hour: hourFormat,
                    minute: minuteFormat,
                    hourCycle: 'h24',
                });

                console.log('dateFormatter changed');
            },
        },
    },

    created() {
        this.$options.formatter = new Intl.DateTimeFormat();
    },

    beforeDestroy() {
        this.$options.formatter = undefined;
    },

    computed: {
        style() {
            return {
                left: this.left ? `${this.left}px` : undefined,
                top: this.top ? `${this.top}px` : undefined,
                opacity: this.visible ? 1 : 0,
            };
        },

        title() {
            return this.tickDiff
                ? this.$options.formatter.format(this.header)
                : this.header;
        },
    },
};
</script>

<style lang="scss">
.chart-tooltip {
    opacity: 0;
    top: 50%;
    position: absolute;
    z-index: 99999;
    font-size: 13px;
    color: #fff;
    background: #2c2c2c;
    border-radius: 6px;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.65);
    border: 1px solid var(--card-border-color);    
    pointer-events: none;
    transition: .12s all ease;
    &__items {
        display: flex;
        flex-direction: row;
        list-style: none;
        appearance: none;
        margin: 0;
        padding: 0;
    }
    &__column {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        min-width: 96px;
    }
    &__header {
        padding: 6px 12px;
        font-weight: 500;
    }
    &__line {
        height: 2px;
        width: 100%;
    }
    &__footer {
        padding: 6px 12px;
    }
}
</style>
