<script>
export default {
    name: 'TContainer',

    render(h) {
        const classes = {
            't-container': true,
            't-container--fluid': this.fluid,
        };

        return h('section', { class: classes }, this.$slots.default);
    },

    props: {
        fluid: Boolean,
    },
};
</script>

<style lang="scss">
    .t-container {
        width: 100%;
        max-width: 1200px;

        &--fluid {
            max-width: 100%;
        }
    }
</style>
