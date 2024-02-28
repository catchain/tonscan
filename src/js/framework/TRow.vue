<script>
export default {
    name: 'TRow',

    render(h) {
        const style = this.gap === 0 ? undefined : {
            marginLeft: `-${this.gap / 2}px`,
            marginRight: `-${this.gap / 2}px`,
        };

        return h('div', { style, class: 't-row' }, this.$slots.default);
    },

    props: {
        gap: {
            type: Number,
            default: 0,
        },
    },

    provide() {
        return {
            gap: this.gap,
        };
    },
};
</script>

<style lang="scss">
.t-row {
    display: flex;
    flex-wrap: wrap;
}
</style>
