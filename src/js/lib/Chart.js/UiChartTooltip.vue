<template>
    <aside class="chart-tooltip" v-bind:style="style">
        <header class="chart-tooltip__header" v-text="title" />
        <table class="chart-tooltip__footer">
            <tr v-for="legend in values">
                <td class="chart-tooltip__line" v-bind:style="{ background: legend.color }"></td>
                <td><template v-if="legend.label && values.length > 1">{{ legend.label }}: </template></td>
                <td>{{ legend.value }}<template v-if="legend.suffix">{{ legend.suffix }}</template>
                </td>
            </tr>
        </table>
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

                // console.log('dateFormatter changed');
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
    color: var(--chart-tooltip-color);
    background: var(--chart-tooltip-background);
    ;
    border-radius: 6px;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.65);
    border: 1px solid var(--card-border-color);
    pointer-events: none;
    transition: .12s all ease;
    padding: 2px;


    &__header {
        padding: 4px;
        font-weight: 500;
    }

    &__line {
        margin-right: 10px;
    }

    &__footer {
        padding: 4px 0;
        border-spacing: 4px;
    }
}
</style>
