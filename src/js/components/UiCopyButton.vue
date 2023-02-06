<template>
    <span class="ui-copy-button" v-clipboard:copy="dataToCopy" v-clipboard:success="addressCopied">
        <slot>{{value}}</slot>

        <template v-if="!hideIcon">
            <icon-copy v-show="!successVisible" class="ui-copy-button__icon"/>
            <icon-success v-if="successVisible" class="ui-copy-button__icon" viewBox="0 0 16 16"/>
        </template>
    </span>
</template>

<script>
import IconCopy from '@img/icons/tonscan/copy-14.svg?inline';
import IconSuccess from '@primer/octicons/build/svg/check-16.svg?inline';

export default {
    props: {
        hideIcon: {
            type: Boolean,
            default: false,
        },
        successMessage: {
            type: String,
            default: 'Copied!',
        },
        copy: {
            type: [String, Number],
            required: true,
        },
        value: {
            type: [String, Number],
            required: false,
        },
    },

    data() {
        return {
            successVisible: false,
        };
    },

    computed: {
        dataToCopy() {
            return (this.copy || this.value || '').toString();
        },
    },

    methods: {
        addressCopied() {
            this.$bus.$emit('showToast', this.successMessage);

            this.successVisible = true;
            setTimeout(() => this.successVisible = false, 1800);
        },
    },

    components: {
        IconCopy, IconSuccess,
    },
};
</script>

<style lang="scss">
.ui-copy-button {
    position: relative;
    cursor: text;
    &__icon {
        fill: currentColor;
        user-select: none;
        opacity: .65;
        cursor: pointer;
        padding: 6px;
        margin: -6px -6px -8px -4px;
        width: 14px;
        height: 14px;
    }
    &:hover .ui-copy-button__icon {
        opacity: 1;
    }
    .clickable + & {
        margin-left: 0.5ex;
    }
}
</style>
