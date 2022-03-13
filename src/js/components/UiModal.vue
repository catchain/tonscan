<template>
    <transition name="v-transition-modal">
        <div class="modal-wrap" v-if="isOpen || keepMarkup">
            <transition name="v-transition-modal">
                <div class="modal" tabindex="-1" role="dialog"
                    v-show="isOpen || !keepMarkup"
                    v-bind:class="modalClass"
                    v-on:click="handleModalClick"
                    v-on:keydown="handleModalKeydown">
                    <button class="modal__close" type="button" v-if="!hideCloseButton">
                        <span class="modal__close-icon">Close</span>
                    </button>
                    <div class="modal__wrap">
                        <div class="modal__container" ref="modalContainer" v-bind:class="modalContainerClass">
                            <slot/>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        hideCloseButton: {
            type: Boolean,
            default: false,
        },
        modalClass: {
            type: String,
            default: '',
        },
        modalContainerClass: {
            type: String,
            default: '',
        },
        keepMarkup: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            //
        };
    },

    methods: {
        closeModal() {
            this.$emit('update:isOpen', false);
            this.$emit('modal-close');
        },

        handleModalClick(e) {
            if (this.hideCloseButton) {
                return;
            }

            if (this.$refs.modalContainer && e.target !== this.$refs.modalContainer && !this.$refs.modalContainer.contains(e.target)) {
                this.closeModal();
            }
        },

        handleModalKeydown(e) {
            if (this.hideCloseButton) {
                return;
            }

            if (e.code === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                this.closeModal();
            }
        },
    },
};
</script>
