<script>
export default {
    render(h) {
        return h('span', [
            this.formattedValue,
            this.suffix,
        ]);
    },

    props: {
        value: {
            type: Number,
            default: 0,
        },

        suffix: {
            type: String,
            default: undefined,
        },
    },

    data() {
        return {
            intermediateValue: 0,
        };
    },

    computed: {
        formattedValue() {
            return this.intermediateValue.toLocaleString(this.$i18n.locale);
        },
    },

    watch: {
        value(newValue, oldValue) {
            // Do not animate from initial values and single steps:
            if (oldValue === 0 || newValue - oldValue === 1) {
                this.intermediateValue = newValue;

            } else {
                this.animate({ from: oldValue, to: newValue, duration: 500 });
            }
        },
    },

    created() {
        this.intermediateValue = this.value;
    },

    methods: {
        animate({ from, to, duration }) {
            let startTime = null;
            let currentTime = Date.now();

            const step = (currentTime) => {
                if (!startTime) {
                    startTime = currentTime;
                }

                const progress = Math.min((currentTime  - startTime) / duration, 1);

                this.intermediateValue = Math.floor(progress * (to - from) + from);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else{
                    window.cancelAnimationFrame(window.requestAnimationFrame(step));
                }
            };

            window.requestAnimationFrame(step);
        },
    },
};
</script>
