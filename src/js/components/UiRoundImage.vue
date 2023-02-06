<template>
    <div class="ui-round-image" v-bind:class="`ui-round-image--${size}`">
        <img v-show="showImage" class="ui-round-image__image" v-bind:src="src" v-bind:srcset="srcset" v-on:load="loaded = true">

        <div v-show="!showImage" class="ui-round-image-stub">
            <svg v-pre class="ui-round-image-stub__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.444 25.46">
                <path d="M25.005 1.816C24.342.656 23.036 0 21.422 0H4.031C2.408 0 1.114.66.446 1.816-.222 2.97-.136 4.429.678 5.827l10.873 18.947a1.37 1.37 0 0 0 2.375 0l10.847-18.95c.807-1.397.888-2.858.232-4.008ZM2.809 3.18c.232-.4.928-.445 1.215-.445h7.323v16.232L3.029 4.473c-.146-.262-.457-.89-.227-1.292ZM22.41 4.464l-8.32 14.493V2.725h7.332c.288 0 .981.044 1.21.443.23.398-.085 1.045-.229 1.296z"/>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: false,
        },
        srcset: {
            type: String,
            required: false,
            default: undefined,
        },
        size: {
            type: String,
            default: 'normal',
            validator: (value) => ['tiny', 'normal', 'large'].includes(value),
        },
    },

    data() {
        return {
            loaded: false,
        };
    },

    computed: {
        showImage() {
            return this.loaded && this.src;
        },
    },
};
</script>

<style lang="scss">
.ui-round-image {
    color: var(--ui-round-image-color);
    flex-shrink: 0;
    &__image {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.ui-round-image-stub {
    border-radius: 50%;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    border: 3px solid currentColor;
    box-sizing: border-box;
    &__icon {
        width: 44%;
        margin-bottom: -6%;
        fill: currentColor;
    }
}

 .ui-round-image--tiny {
    .ui-round-image-stub {
        border-width: 1px;
        &__icon {
            width: 56%;
        }
    }
}
</style>
