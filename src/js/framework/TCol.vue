<script>
/**
 * @param  {String|Number} value
 * @return {Boolean}
 */
const screenSizePropValidator = value => (value === 'hidden') || (value > 0 && value <= 12);

export default {
    name: 'TCol',

    render(h) {
        return h('div', {
            style: this.style,
            class: 't-col',
        }, this.$slots.default);
    },

    props: {
        /**
         * 'cols' prop stands for desktop screen size
         * 'cols' prop is a fallback if mobile prop or tablet prop are not passed
         */
        cols: {
            type: [Number, String],
            required: true,
            default: 12,
            validator: screenSizePropValidator,
        },
        mobile: {
            type: [Number, String],
            default: 12,
            required: false,
            validator: screenSizePropValidator,
        },
        tablet: {
            type: [Number, String],
            default: 12,
            required: false,
            validator: screenSizePropValidator,
        },
    },

    inject: ['gap'],

    data() {
        return {
            colsActive: this.cols,
        };
    },

    computed: {
        style() {
            const mobileHidden = this.mobile === 'hidden' && this.isMobile;
            const tabletHidden = this.tablet === 'hidden' && this.isTablet;
            const desktopHidden = this.cols === 'hidden' && (!this.isMobile && !this.isTablet);

            // Hide col on certain screen size:
            if (mobileHidden || tabletHidden || desktopHidden) {
                return {
                    display: 'none',
                };
            }

            this.handleMediaQueries();

            const widthPercentage = (this.colsActive / 12) * 100;
            const padding = this.gap / 2;

            return {
                flex: `0 0 ${widthPercentage}%`,
                maxWidth: `${widthPercentage}%`,
                paddingLeft: padding ? `${padding}px` : undefined,
                paddingRight: padding ? `${padding}px` : undefined,
            };
        },
    },

    mounted() {
        this.handleMediaQueries();
    },

    methods: {
        handleMediaQueries() {
            if (this.isMobile) {
                this.colsActive = this.mobile;
            } else if (this.isTablet) {
                this.colsActive = this.tablet;
            } else {
                this.colsActive = this.cols;
            }
        },
    },
};
</script>

<style lang="scss">
.t-col {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    min-height: 1px; // Prevent collapsing
    padding-right: 15px; // Half gutter
    padding-left: 15px; // Half gutter
}
</style>
