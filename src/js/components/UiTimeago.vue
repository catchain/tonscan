<template>
    <span v-bind:datetime="timestamp" v-text="timeAgoText"/>
</template>

<script>
import { format, render, cancel } from 'timeago.js';

export default {
    props: {
        timestamp: {
            required: true,
            type: Number,
        },
    },

    computed: {
        shouldAutoUpdate() {
            return (Date.now() - this.timestamp) < 604800000; // 1000 * 60 * 60 * 24 * 7 = 7 days in milliseconds
        },

        timeAgoText() {
            return this.shouldAutoUpdate
                ? undefined
                : format(this.timestamp, this.$i18n.locale);
        },
    },

    mounted() {
        this.shouldAutoUpdate && render(this.$el, this.$i18n.locale, {
            minInterval: 10,
        });
    },

    beforeDestroy() {
        this.shouldAutoUpdate && cancel(this.$el);
    },
};
</script>
