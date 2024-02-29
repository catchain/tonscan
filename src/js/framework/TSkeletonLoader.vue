<template>
    <div class="skeleton-loader" v-bind:style="skeletonStyles">
        <div class="skeleton-loader__bar"/>
    </div>
</template>

<script>

const skeletonTypes = [
    'button',
    'rectangle',
    'circle',
    'paragraph',
    // 'chip',
    // 'image',
];

const skeletonTypeValidator = value => skeletonTypes.includes(value);

const defaultPropValues = {
    borderRadius: '8px',
    width: '0',
    height: '0',
};

export default {
    name: 'TSkeletonLoader',

    props: {
        type: {
            type: String,
            required: true,
            validator: skeletonTypeValidator,
        },
        borderRadius: {
            type: String,
            default: defaultPropValues.borderRadius,
            required: false,
        },
        width: {
            type: String,
            default: defaultPropValues.width,
            required: false,
        },
        height: {
            type: String,
            default: defaultPropValues.height,
            required: false,
        },
        circle: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            buttonDefaults: {
                width: '100px',
                height: '40px',
            },
            paragraphDefaults: {
                width: '100%',
                height: '16px',
            },
            circleDefaults: {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
            },
        };
    },
    methods: {
        checkPropPassed(prop) {
            return Object.hasOwn(this.$props, prop);
        },
    },
    computed: {
        skeletonStyles() {
            let styles = defaultPropValues;

            if (this.type === 'button') {
                styles = { ...styles, ...this.buttonDefaults };
            }

            if (this.type === 'paragraph') {
                styles = { ...styles, ...this.paragraphDefaults };
            }

            // Merge styles to final object that differs from defaults
            Object.keys(styles).forEach((rule) => {
                if (this.checkPropPassed(rule)) {
                    styles[rule] = this[rule];
                }
            });

            return styles;
        },
    },
};
</script>

<style scoped>

  .skeleton-loader {
    background: var(--skeleton-loader-background);
    cursor: wait;
    position: relative;
    z-index: 0;
  }

  .skeleton-loader__bar {
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.04) 8%, rgba(255, 255, 255, 0.08) 18%, rgba(255, 255, 255, 0.04) 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
    width: 100%;
    height: 100%;
  }

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }

</style>
