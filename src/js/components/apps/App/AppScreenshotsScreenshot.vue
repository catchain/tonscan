<template>
    <div class="app-screenshot">
        <div v-if="showSkeleton" class="app-screenshot__image app-screenshot__image--portrait app-screenshot-skeleton">
            <t-skeleton-loader
                type="rectangle"
                width="inherit"
                height="100%"/>
        </div>

        <img class="app-screenshot__image" loading="lazy" decoding="async"
            v-if="url"
            v-bind:src="src"
            v-on:load="checkOrientation"
            v-bind:class="{
                [`app-screenshot__image--${orientation}`]: true,
                'app-screenshot__image--loading': !isLoaded,
            }"/>
    </div>
</template>

<script>
import { makeImageUrl } from '~/components/apps/index.js';

export default {
    props: {
        url: String,
    },

    data() {
        return {
            orientation: 'portrait',
            isLoaded: false,
        };
    },

    computed: {
        showSkeleton() {
            return !this.url || !this.isLoaded;
        },

        showImage() {
            return !this.showSkeleton;
        },

        src() {
            return makeImageUrl(this.url, {
                height: 352,
            });
        },
    },

    methods: {
        checkOrientation($event) {
            this.isLoaded = true;

            const img = $event.target;

            this.orientation = img.naturalWidth > img.naturalHeight
                ? 'landscape'
                : 'portrait';
        },
    },
};
</script>

<style lang="scss">
.app-screenshot {
    border-radius: 12px;
    position: relative;
    scroll-snap-align: center;
    &:first-child {
        margin-left: 25px;
    }
    &__image {
        border-radius: 12px;
        object-fit: cover;
        object-position: center top;

        &--portrait {
            max-width: 372px;
            height: 372px;
        }

        &--landscape {
            max-width: 659px;
            height: 372px;
        }

        &--loading {
            position: absolute;
            top: 0;
            visibility: hidden;
            width: 210px;
            height: 372px;
        }
    }
}

.app-screenshot-skeleton {
    width: 210px;
    height: 372px;
}
</style>
