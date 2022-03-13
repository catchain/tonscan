<template>
    <div class="toast-container">
        <div class="toast" v-bind:class="{ visible }" v-text="message"/>
    </div>
</template>

<script>
let timerHandle = undefined;

export default {
    data() {
        return {
            message: undefined,
            visible: false,
        };
    },

    created() {
        this.$bus.$on('showToast', (message) => {
            this.message = message;
            this.visible = true;

            clearTimeout(timerHandle);
            timerHandle = setTimeout(() => this.visible = false, 2000);
        });
    },

    beforeDestroy() {
        this.$bus.$off('showToast');
    },
}
</script>
