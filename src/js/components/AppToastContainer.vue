<template>
    <div class="toast-container">
        <div class="toast" v-bind:class="{ visible }" v-text="message"/>
    </div>
</template>

<script>
import $bus from '~/eventBus.js';

export const showToast = message => $bus.$emit('showToast', message);

export default {
    timerHandle: undefined,

    data() {
        return {
            message: undefined,
            visible: false,
        };
    },

    created() {
        $bus.$on('showToast', this.showToast);
    },

    beforeDestroy() {
        $bus.$off('showToast');
    },

    methods: {
        showToast(message) {
            this.message = message;
            this.visible = true;

            clearTimeout(this.$options.timerHandle);
            this.$options.timerHandle = setTimeout(() => {
                this.visible = false;
            }, 2000);
        },
    },
};
</script>
