<template>
    <transition name="v-transition-modal">
        <div class="modal-wrap"
            v-if="isOpen || keepMarkup"
            v-on:click="handleModalClick">

            <div class="modal" tabindex="-1" role="dialog"
                v-show="isOpen || !keepMarkup"
                v-bind:class="modalClasses"
                v-on:keydown="handleModalKeydown"
                v-bind:style="{ width: `${width}px` }"
                v-on:click.prevent.stop>
                <header class="modal__header" v-bind:class="{
                    'modal__header--has-title': $slots.header !== undefined,
                }">
                    <section v-if="$slots.header" class="modal__header__title">
                        <slot name="header"/>
                    </section>
                    <button class="modal__close" type="button"
                        v-if="!hideCloseButton"
                        v-on:click="handleModalClick">
                        <span class="modal__close-icon">
                            <icon-close/> Close
                        </span>
                    </button>
                </header>
                <div class="modal__wrap">
                    <div class="modal__container" ref="modalContainer" v-bind:class="modalContainerClass">
                        <slot/>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import IconClose from '@primer/octicons/build/svg/x-24.svg?inline';

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
        alignTop: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: 480,
        },
    },

    computed: {
        modalClasses() {
            const classnames = {
                'modal--align-top': this.alignTop,
            };

            if (this.modalClass) {
                classnames[this.modalClass] = true;
            }

            return classnames;
        },
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

            if (this.$refs.modalContainer
                && e.target !== this.$refs.modalContainer
                && !this.$refs.modalContainer.contains(e.target)) {
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

    components: {
        IconClose,
    },
};
</script>

<style lang="scss">
.modal-wrap {
    position: fixed;
    display: flex;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    transition: .15s all ease;
    margin-bottom: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translate3d(0);
}
.modal {
    display: flex;
    flex-direction: column;
    z-index: 15;
    color: var(--body-text-color);
    -webkit-tap-highlight-color: transparent;
    outline: none;
    margin: auto;
    &--align-top {
        margin-top: 72px;
    }
    button, a {
        -webkit-tap-highlight-color: initial;
    }
    &__header {
        position: relative;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--card-background);
        border-top-right-radius: 11px;
        border-top-left-radius: 11px;
        &--has-title {
            border-bottom: 2px solid var(--card-border-color);
        }
        &__title {
            font-size: 17px;
            padding: 17px 16px 15px;
            display: flex;
            align-items: center;
            font-weight: 500;
            flex-grow: 1;
        }
    }

    ///
    background: var(--card-background);
    border: 2px solid var(--modal-border-color);
    border-radius: 12px;

    .card {
        border: none;
        border-radius: 0;
        background-color: transparent;
    }

    &__container {
        width: 100%;
    }
}

.qr-modal {
    .modal {
        border: none;
        background: transparent;
        &__wrap {
            width: auto;
        }
        &__close {
            display: none;
        }
    }
}

.v-transition-modal-enter-to, .v-transition-modal-leave {
    opacity: 1;
    backdrop-filter: blur(6px);
}
.v-transition-modal-enter, .v-transition-modal-leave-to {
    opacity: 0;
    backdrop-filter: none;
}

@media all and (max-width: 480px) {
    .v-transition-modal-enter-to, .v-transition-modal-leave {
        opacity: 1;
        bottom: 0;
    }
    .v-transition-modal-enter, .v-transition-modal-leave-to {
        opacity: 1;
        bottom: -100%;
        background: rgba(0, 0, 0, 0) !important;
    }
}

.modal__wrap {
    display: flex;
    width: 100%;
    overflow: auto;
    margin: auto;
    justify-content: center;
    border-radius: 12px;
}

.modal__close {
    font-size: 0;
    cursor: pointer;
    color: inherit;
    opacity: .4;
    transition: .15s opacity ease;
    position: absolute;
    right: -44px;
    top: 6px;
    .modal__header--has-title & {
        position: unset;
        margin-right: 8px;
    }

    &:hover {
        opacity: 1;
    }
    &-icon {
        svg {
            fill: currentColor;
            width: 32px;
            height: 32px;
        }
    }
}

.modal__title {
    margin-bottom: 10px;
}
.modal__text {
    max-width: 480px;
    margin: 0 auto 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.modal__content {
    text-align: left;
    background: var(--card-background);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--card-border-color);
}
.modal-content-title {
    padding: 14px 18px;
    font-weight: 500;
    font-size: 14px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    background: var(--modal-title-background);
    border-bottom: 1px solid var(--card-border-color);
    border-top: 1px solid var(--card-border-color);
    &:first-child {
        border-top: none;
    }
    svg {
        margin-right: 10px;
        fill: currentColor;
    }
}

@media (min-width: 1600px) {
    .modal__close {
        right: 64px;
        top: 64px;
    }
    .modal__close-icon {
        &::before, &::after {
            width: 36px;
            margin-left: -18px;
        }
    }
}
@media all and (max-width: 480px) {
    .modal-wrap {
        display: flex;
        align-content: flex-end;
        justify-content: center;
        flex-direction: column;
        backdrop-filter: none;
        background: rgba(0, 0, 0, 0.75);
        transition: 0.2s background ease, 0.4s bottom cubic-bezier(.08,.82,.17,1);
        opacity: 1;
    }
    .modal {
        width: 100% !important; // override hard-set width
        margin-top: auto;
        margin-bottom: 0;
        max-height: 100%;
        background: var(--body-background);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.2);
        border: none;
        &__header {
            border-bottom: 2px solid var(--card-border-color);
            &__title {
                border-bottom: none;
                font-size: 15px;
                padding: 16px 16px 14px;
            }
        }
        &__close {
            background: none;
            position: unset;
            height: 48px;
            padding-right: 12px;
            margin-left: auto;
            opacity: 1;
            &-icon {
                color: var(--blue-bright);
                font-size: 16px;
                svg {
                    display: none;
                }
            }
            &:hover {
                background: none;
            }
        }
        &__wrap {
            max-width: unset;
            width: 100%;
            border-radius: 0;
        }
        .ui-qr {
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
            padding: 12px;
            border-radius: 8px;
            margin: 28px auto;
        }

        .card {
            background-color: var(--card-background);
        }
    }
    .modal__content {
        margin: 0 12px;
    }

    .qr-modal {
        .modal {
            background: var(--card-background);
            &__wrap {
                width: 100%;
            }
            &__close {
                display: unset;
            }
        }
    }
}
</style>
