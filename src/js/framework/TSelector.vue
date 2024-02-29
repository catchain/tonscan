<template>
    <div class="t-selector" v-bind:style="selectorStyles">
        <div ref="selectorItems" class="t-selector__item"
            v-for="(item, index) in items"
            v-bind:class="{ 't-selector__item--selected': selectedItem === item.value }"
            v-bind:key="index"
            v-on:click="selectItem(item.value)">
            <component class="t-selector__item-icon"
                v-if="item.icon"
                v-bind:is="item.icon"/>

            <span class="t-selector__item-name">
                {{ item.name }}
            </span>
        </div>
        <div class="t-selector__selected-background" v-bind:style="borderStyle"/>
    </div>
</template>

<script>
export default {
    name: 'TSelector',

    props: {
        // Sets width to 100%
        block: {
            type: Boolean,
            required: false,
            default: false,
        },
        delimiter: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * Array of objects:
         * {
         *   name: 'Name',
         *   value: 'name'
         *   icon: IconComponent
         * }
         *
         */
        items: {
            type: Array,
            required: true,
        },
        selectedItem: {
            type: String,
        },
    },

    data() {
        return {
            elementsWidths: [0],
            currentElementWidth: 0,
            previousSelectedItemIndex: null,
        };
    },

    methods: {
        selectItem(value) {
            for (let i = 0; i < this.items.length; i += 1) {
                if (this.selectedItem === this.items[i].value) {
                    this.previousSelectedItemIndex = i;
                    break;
                }
            }
            this.$emit('select', value);
            this.$emit('input', value);
        },

        setElementsWidths() {
            this.elementsWidths = [];
            if (this.$refs.selectorItems && this.$refs.selectorItems.length > 0) {
                this.$refs.selectorItems.forEach((element) => {
                    this.elementsWidths.push(element.offsetWidth);
                });
            }
        },
    },

    computed: {
        selectorStyles() {
            return {
                width: this.block ? 'auto' : 'fit-content',
            };
        },

        borderStyle() {
            this.setElementsWidths();

            const values = this.items.map(item => item.value);
            const selectedItemIndex = values.indexOf(this.selectedItem);

            let width = 0;
            if (this.isMobile || this.isTablet) {
                width = this.elementsWidths[selectedItemIndex] - 5;
            } else {
                width = this.elementsWidths[selectedItemIndex] - 0;
            }

            // if element width is not int
            // if (!this.block) {
            //   width -= 1;
            // }

            let translateXPx = 0;
            if (selectedItemIndex !== 0) {
                for (let i = 0; i < selectedItemIndex; i += 1) {
                    if (this.isMobile || this.isTablet) {
                        translateXPx += this.elementsWidths[i] + 3;
                    } else {
                        translateXPx += this.elementsWidths[i] + 0;
                    }
                }
            } else if (this.isMobile || this.isTablet) {
                translateXPx += 3;
            }

            return { transform: `translateX(${translateXPx}px)`, width: `${width}px` };
        },
    },

    watch: {
        'isMobile': {
            handler() {
                this.setElementsWidths();
            },
            immediate: true,
        },
        'isTablet': {
            handler() {
                this.setElementsWidths();
            },
            immediate: true,
        },
        '$store.state.appLocale': {
            handler(newVal) {
                console.log(newVal);
                this.$nextTick(() => {
                    this.setElementsWidths();
                });
            },
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.setElementsWidths();
        });
    },

    beforeMount() {
        this.previousSelectedItemIndex = this.items.find(item => item.name === this.selectItem);
    },
};
</script>

<style lang="scss" scoped>

  .t-selector {
    display: flex;
    line-height: 24px;
    width: fit-content;
    align-items: center;
    max-height: 40px;
    position: relative;
    padding: 3px;
    //background: var(--card-background);
    background: var(--body-light-muted-color);
    border-radius: 12px;
    &__item {
      //height: calc(46px - 2px);
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      //border: 2px solid transparent;
      flex: 1;
      //padding: 16px 20px;
      padding: 0 20px;
      color: var(--selected-big-text);
      cursor: pointer;
      font-weight: 500;
      height: 100%;
      &-icon {
        margin-right: 8px;
      }

      &--selected {
        color: var(--selector-big-selected-text);
        //background: var(--selector-big-selected-background);
        //background: var(--card-background);
      }

      &-name {
        z-index: 10003;
      }
    }

    //&__border {
    //  position: absolute;
    //  bottom: 0;
    //  left: 0;
    //  height: calc(100% - 4px);
    //  //border: 2px solid var(--selector-big-selected-border);
    //  border: 2px solid transparent;
    //  transition: all 0.3s ease-in-out;
    //  border-radius: 17px;
    //}

    &__selected-background {
      position: absolute;
      bottom: 3px;
      height: calc(100% - 6px);
      transition: all 0.3s ease-in-out;
      border-radius: 10px;
      background: var(--selector-active);
      z-index: 10002;
      width: calc(100% + 3px);
    }
  }

  @media screen and (max-width: 991px) {
    .t-selector {
      padding: 0;
      border-radius: 12px;
      height: 100%;
      font-size: 14px;
      &__selected-background {
        border-radius: 10px;
      }
    }
  }

  @media screen and (max-width: 480px) {

    .t-selector {
      padding: 0;
      border-radius: 12px;

      &__item {
        padding: 8px 16px;
      }

      &__border {
        height: calc(100% - 2px);
        bottom: -1px;
      }

    }
  }

</style>
