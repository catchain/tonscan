<template>
    <button v-bind:class="buttonClasses" v-bind:style="buttonStyles">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'TBtn',
    props: {
        color: {
            type: String,
            default: 'primary', // primary, secondary, etc.
        },
        textColor: {
            type: String,
            default: '#FFFFFF',
        },
        size: {
            type: String,
            default: 'md', // xs, sm, md, xl, xxl
        },
        block: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            availableColors: [
                'primary',
                'blue',
            ],
        };
    },
    computed: {
        buttonClasses() {
            const classes = [
                'btn',
                `btn--${this.size}`,
                { 'btn--block': this.block },
                { 'btn--rounded': this.rounded },
            ];

            if (this.definedColorSelected) {
                classes.push(`btn--${this.color}`);
            }

            return classes;
        },
        buttonStyles() {
            const styles = {};
            if (!this.definedColorSelected) {
                styles.background = this.color;
            }
            styles.color = this.textColor;
            return styles;
        },
        definedColorSelected() {
            return this.availableColors.includes(this.color);
        },
    },
};
</script>

<style lang="scss" scoped>
  .btn {
    min-width: 64px;
    padding: 0 16px;
    height: 36px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: 500;
    border-radius: 6px;

    // Force width to 100%
    &--block {
       width: 100% !important;
     }

    // Button sizes
      &--xs {
         height: 20px;
         min-width: 36px;
         padding: 0 8px;
         font-size: 0.685rem;
       }

    &--sm {
       height: 28px;
       padding: 0 12px;
       min-width: 50px;
       font-size: 0.75rem;
     }

    &--md {
     // Same as default
     }

    &--lg {
       font-size: 1rem;
       height: 44px;
       min-width: 78px;
       padding: 0 20px;
     }

    &--xl {
       padding: 1.50rem 2rem;
     }

    &--xxl {
       padding: 1.75rem 2.25rem;
     }

    &--large {
       padding: 20px 40px;
       font-size: 18px;
     }

    &--rounded {
      // TODO: this
       border-radius: 8px;
     }

    // Child elements of button
      &__icon {
         margin-right: 8px;
       }

    &__text {
       font-weight: bold;
     }

    // Modifier classes
      &--primary {
         background-color: var(--m3-container-primary);
         color: white;

    &:hover {
       background-color: #0056b3;
     }
    }

    &--grey-lighten {
       background-color: #FAFAFA;
       color: #4f4f4f;

    &:hover {
       background-color: #F0F0F0;
     }
    }

    &--secondary {
       background-color: #6c757d;
       color: white;

    &:hover {
       background-color: #5a6268;
     }
    }

    // TODO: add more colors from app.scss
    &--blue {
      background: var(--big-blue-button-background);
      color: #FFF;
      font-weight: 500;
      //padding: 10px 0;
      font-size: 14px;
      text-transform: uppercase;
      border-radius: 6px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      //width: 100%;
      cursor: pointer;
      transition: .15s background ease;
      text-decoration: none;
      &:hover {
        text-decoration: none;
        background: var(--big-blue-button-hover-background);
      }
      &--disabled {
        background: var(--big-blue-button-disabled-background);
        color: var(--big-blue-button-disabled-color);
        pointer-events: none;
      }
    }
  }
</style>
