<template>
    <div class="app-screenshots-container">
        <div class="app-screenshots">
            <app-screenshot
                v-for="(screenshot, index) in screenshots"
                v-bind:key="`app_screenshot_${index}`"
                v-bind:url="screenshot"/>
        </div>
    </div>
</template>

<script>
import AppScreenshot from './AppScreenshotsScreenshot.vue';

export default {
    name: 'AppScreenshots',

    props: {
        screenshots: {
            type: Array,
            default: () => Array(4).fill(undefined),
        },
    },

    components: {
        AppScreenshot,
    },
};
</script>

<style lang="scss">
.app-screenshots-container {
    //
}

.app-screenshots {
    margin: 25px -25px 32px -25px;
    padding-right: 25px;
    gap: 16px;
    overflow: auto;
    white-space: nowrap;
    display: flex;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }

    &__wrapper {
        //
    }

    &:empty {
        display: none;
    }
}

 @media screen and (max-width: 480px) {
    .app-screenshots {
        margin-right: -16px;
        padding-right: 16px;
    }
}
</style>
