<template>
    <span class="ui-copy" v-clipboard:copy="copy" v-clipboard:success="addressCopied">
        <slot/>

        <span v-if="showButton">
            <svg v-show="!successVisible" class="ui-copy__icon" viewBox="0 0 14 14" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <g v-pre fill="none" fill-rule="evenodd"><path d="M0 0h14v14H0z"/><path d="M6.36 3.35h3.29a2 2 0 0 1 2 2v5.3a2 2 0 0 1-2 2H6.36a2 2 0 0 1-2-2v-5.3a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M2 10.65V3.3A2.3 2.3 0 0 1 4.3 1h5.4" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></g>
            </svg>

            <svg v-show="successVisible" class="ui-copy__icon" viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path v-pre fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
            </svg>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        showButton: {
            type: Boolean,
            default: true,
        },
        successMessage: {
            type: String,
            default: 'Copied!',
        },
        copy: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
    },

    data() {
        return {
            successVisible: false,
        };
    },

    methods: {
        addressCopied() {
            this.$bus.$emit('showToast', this.successMessage);

            this.successVisible = true;
            setTimeout(() => this.successVisible = false, 1800);
        },
    },
};
</script>
