<template>
    <div class="mugen-scroll">
        <slot>
            <button class="mugen-scroll__button" v-show="showButton" v-on:click="handler">
                <template v-if="!isLoading">
                    {{$t('common.load_more')}}
                </template>
                <template v-else>
                    {{$t('common.loading')}}
                </template>
            </button>
        </slot>
    </div>
</template>

<script>
export default {
    observer: undefined,

    props: {
        handler: {
            type: Function,
            requried: true,
        },
        shouldHandle: {
            type: Boolean,
            requried: false,
            default: true,
        },
        showButton: {
            type: Boolean,
            requried: false,
            default: false,
        },
        isLoading: {
            type: Boolean,
            requried: false,
            default: false,
        },
    },

    created() {
        this.$options.observer = new IntersectionObserver(([firstEntry]) => {
            if (firstEntry.intersectionRatio > 0 && this.shouldHandle) {
                this.handler();
            }
        });
    },

    mounted() {
        this.$options.observer.observe(this.$el);
    },

    beforeDestroy() {
        this.$options.observer.disconnect();
        this.$options.observer = undefined;
    },
};
</script>

<style lang="scss">
.mugen-scroll {
    display: flex;
    &__button {
        appearance: none;
        text-transform: uppercase;
        cursor: pointer;
        margin: 12px auto;
        text-align: center;
        padding: 10px 22px;
        font-weight: 500;
        background: var(--blue-bright-background);
        color: var(--blue-bright);
        border-radius: 8px;
        font-size: 13px;
        &:hover {
            background: rgba(56, 139, 253, 0.2);
        }
    }
}
</style>
