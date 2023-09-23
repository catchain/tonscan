<template>
    <div class="ui-select input-material" @click="toggle" v-outside-click="onClickOutside">
        <div class="ui-select__label_container">
            <div class="ui-select__placeholder" v-bind:class="{
                'ui-select__placeholder--active': selected !== undefined,
            }">
                {{ placeholder }}
            </div>
            <div class="ui-select__label">
                {{ label }}
            </div>
            <icon-down v-if="!active" class="ui-select__icon" />
            <icon-up v-else class="ui-select__icon" />
        </div>
        <div class="ui-select__options"
             v-bind:class="{
                'ui-select__options--active': active,
             }"
             ref="options"
        >
            <div class="ui-select__option"
                 v-for="option in options"
                 v-bind:key="option.value"
                 v-bind:class="{
                     'ui-select__option--active': option.value === selected,
                 }"
                 @click="select(option.value)"
            >
                {{ option.label }}
                <icon-check v-if="option.value === selected" />
            </div>
        </div>
    </div>
</template>

<script>
import outsideClick from '~/directives/outsideClick';
import IconDown from '@primer/octicons/build/svg/chevron-down-16.svg?inline';
import IconUp from '@primer/octicons/build/svg/chevron-up-16.svg?inline';
import IconCheck from '@primer/octicons/build/svg/check-16.svg?inline';

export default {
    model: {
        prop: 'modelValue',
        event: 'input'
    },

    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            required: true,
            default: () => []
        }
    },

    created () {
        this.selected = this.modelValue;
    },

    computed: {
        label () {
            if (this.selected === undefined) {
                return this.placeholder;
            }

            const option = this.options.find(option => option.value === this.selected);
            if (option === undefined) {
                return this.placeholder;
            }

            return option.label;
        }
    },

    data () {
        return {
            selected: undefined,
            active: false
        }
    },

    methods: {
        toggle () {
            this.active = !this.active;

            // move options to the end of the body
            // so they are not affected by overflow: hidden
            if (this.active) {
                document.body.appendChild(this.$refs.options);

                // set position
                const rect = this.$el.getBoundingClientRect();
                this.$refs.options.style.top = `${rect.bottom + window.scrollY}px`;
                this.$refs.options.style.left = `${rect.left + window.scrollX}px`;

                // set width
                this.$refs.options.style.width = `${rect.width}px`;
            }
        },

        select ( value ) {
            this.active = false;

            this.selected = value;
            this.$emit('input', value);
        },

        onClickOutside () {
            if (! this.active) {
                return;
            }

            this.active = false;
        }
    },

    directives: { outsideClick },

    components: { IconDown, IconUp, IconCheck }
}
</script>

<style scoped lang="scss">
.ui-select {
    position: relative;
    min-height: 18px;
    min-width: 80px;
    cursor: pointer;
}

.ui-select__options {
    display: none;
    position: absolute;
    background: var(--input-bg);
    border-radius: 12px;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
    margin-top: 2px;
    z-index: 20;

    &.ui-select__options--active {
        display: block;
    }
    .ui-select__option {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        cursor: pointer;
        border-radius: 8px;
        margin: 0 5px;
        font-size: 14px;
        transition: .15s background ease;
        &:first-child {
            margin-top: 5px;
        }
        &:last-child {
            margin-bottom: 5px;
        }
        &:hover {
            background: var(--body-light-muted-color);
        }
        svg {
            fill: var(--body-muted-text-color);
            width: 16px;
            height: 16px;
            margin-left: auto;
        }
    }
}
.ui-select__label_container {
    display: flex;
    align-items: center;
}
.ui-select__placeholder {
    display: none;
    &--active {
        display: block;
    }
}
.ui-select__icon {
    fill: var(--body-muted-text-color);
    margin-left: auto;
    width: 16px;
    height: 16px;
}
</style>
