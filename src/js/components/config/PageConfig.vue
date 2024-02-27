<template>
    <section>
        <div class="config-items">
            <div class="config-container card">

                <template v-if="!config">
                    <div v-for="i in 10" v-bind:key="i">
                        <param-skeleton />
                    </div>
                </template>

                <div class="config-param" v-for="param in config" v-bind:id="param.id" v-bind:key="param.id">
                    <div class="config-param__header" v-bind:id="`parameter-${param.id}`" v-on:mouseover="showChainIcon = param.id" v-on:mouseleave="showChainIcon = false">
                        <span class="config-param__point">
                            <div class="config-param__anchor" v-if="showSuccessIcon === param.id">
                                <icon-success class="config-param__link-icon" />
                            </div>
                            <div class="config-param__anchor" v-else-if="showChainIcon === param.id" v-on:click="scrollToElement(param.id, true)">
                                <icon-chain class="config-param__link-icon config-param__link-icon--chain" />
                            </div>
                            <span v-else>{{ param.id }}</span>
                        </span>
                        <span>{{ $t(`config.param_${param.id}.title`) }}</span>
                    </div>
                    <p class="config-param__description">{{ $t(`config.param_${param.id}.description`) }}</p>

                    <config-viewer
                        v-if="param.content"
                        v-bind:config-type="param.type"
                        v-bind:config-content="param.content"
                        v-bind:config-value="param.raw"
                        v-bind:config-tlb="param.tlb" />

                    <div v-else class="config-no-value">
                        {{ $t('config.no_value') }}
                    </div>
                </div>
            </div>
            <div class="config-sidebar card">
                <div class="config-menu">
                    <div class="config-menu-header" v-on:click="toggleMenu">
                        <div class="config-menu-title">
                            <span>{{ $t('config.menu') }}</span>
                        </div>
                        <div
                            class="config-menu-arrow"
                            v-bind:class="{ 'config-menu-arrow__open': openMenu }"
                        >
                            <up-icon />
                        </div>
                    </div>

                    <div class="config-menu-nav__separator" v-show="openMenu"></div>

                    <div
                        class="config-menu-nav"
                        v-bind:class="{ 'config-menu-nav__open': openMenu }">

                        <template v-if="!config && !isMobile && !isTablet">
                            <div v-for="i in 31" v-bind:key="i">
                                <span class="skeleton" style="margin-bottom: 11px;">param</span>
                            </div>
                        </template>

                        <div
                            v-for="index in config"
                            v-bind:key="index.id"
                            class="config-menu-nav__item"
                            v-on:click="scrollToElement(index.id)"
                        >
                            <span class="muted">{{ index.id }}. </span>
                            <span>{{ $t('config.param_' + index.id + '.title') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import IconChain from '@img/icons/tonscan/chain-no-padding-16.svg?inline';
import IconSuccess from '@primer/octicons/build/svg/check-16.svg?inline';
import UpIcon from '@img/icons/tonscan/top.svg?vue';
import { getAllConfigParams } from '~/api/blockchainConfig.js';
import ConfigViewer from './ConfigViewer.vue';
import ParamSkeleton from './ParamSkeleton.vue';

export default {
    copyTimerHandle: undefined,

    data() {
        return {
            curr_validators: [],
            prev_validators: [],
            openMenu: false,
            config: undefined,
            showChainIcon: false,
            showSuccessIcon: false,
        };
    },

    mounted() {
        this.loadConfig();
    },

    methods: {
        async loadConfig() {
            const configParams = await getAllConfigParams();
            this.config = configParams;
            this.$nextTick(() => this.scrollToHash());
        },

        toggleMenu() {
            this.openMenu = !this.openMenu;
        },

        scrollToHash() {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        },

        async scrollToElement(idValue, copy_url = false) {
            const element = document.getElementById(idValue);
            if (element && !copy_url) {
                element.scrollIntoView({ behavior: 'smooth' });
            }

            window.history.pushState(null, null, `#${idValue}`);
            if (copy_url) {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                } catch {
                    this.copyToClipboardFallback(window.location.href);
                }

                this.showSuccessIcon = idValue;
                this.$bus.$emit('showToast', 'Link copied!');

                clearTimeout(this.$options.copyTimerHandle);
                this.$options.copyTimerHandle = setTimeout(() => {
                    this.showSuccessIcon = false;
                }, 2000);
            }
        },
    },

    components: {
        ConfigViewer, IconChain, UpIcon, ParamSkeleton, IconSuccess,
    },
};
</script>

<style lang="scss">
.config-items {
    display: flex;
    align-items: flex-start;
}

.config-sidebar {
    position: sticky!important;
    max-height: calc(100vh - 30px);
    max-width: 330px;
    width: 100%;
    top: 14px;
    flex-grow: 1;
    min-width: 310px;
}

@media screen and (max-width: 450px) {
    .config-sidebar {
        min-width: auto;
    }
}

.config-items .card + .card {
    margin-top: 0;
}

.config-menu {
    padding: 20px;
    height: 100%;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
}

.config-menu-header {
    display: none;
    justify-content: space-between;
    cursor: pointer;
}

.config-menu-title {
    font-size: 15px;
}

.config-menu-arrow {
    width: 12px;
    fill: var(--body-muted-text-color);
    // -webkit-transition: all .2s;
    // -o-transition: all .2s;
    // transition: all .2s;
    transform: rotate(180deg);

    &__open {
        transform: rotate(360deg);
    }
}

.config-menu-nav {
    &__separator {
        height: 1px;
        width: 100%;
        background-color: var(--card-border-color);
        margin-bottom: 17px;
        display: none;
    }

    &__item {
        display: block;
        color: var(--body-text-color);
        margin-bottom: 10px;
        font-size: 15px;
        cursor: pointer;
    }

    &__item:last-child {
        margin-bottom: 0;
    }

    &__item:hover {
        text-decoration: none;
        color: var(--blue-bright);
    }
}

.config-container {
    flex-grow: 1;
    padding: 32px;
    box-sizing: border-box;
    margin-right: 20px;
}

.config-param {
    scroll-margin-top: 8px;
    padding: 14px 0;

    &__description {
        margin: 8px 0 18px 0;
        line-height: 22px;
    }

    &__point {
        background-color: var(--config-param-point-background-color);
        color: var(--config-param-point-text-color);
        font-size: 14px;
        font-weight: 400;
        height: 24px;
        width: 24px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__number {
        background-color: var(--config-param-number-background-color);
        color: var(--config-param-number-text-color);
        border: 2px solid var(--config-param-number-border-color);
        border-radius: 8px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 22px;
        height: 24px;
        font-size: 18px;

        &-big {
            padding: 0 5px;
        }
    }

    &__header {
        font-size: 18px;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    &__link-icon {
        width: 14px;
        height: 14px;
        opacity: .3;
        transition: .2s;
        fill: var(--body-text-color);

        &--chain {
            transform: scale(0.88);
        }
    }

    &__link {
        color: inherit;
    }

    &__anchor {
        color: var(--body-text-color);
        cursor: pointer;
        height: 14px;
    }

    &__anchor:hover {
        .config-param__link-icon {
            opacity: 1;
        }
    }

    // TODO
    &__link:hover &__link-icon {
        opacity: .8;
    }
}

.config-param:first-child {
    padding-top: 0;
}

.config-param:last-child {
    padding-bottom: 0;
}

.config-no-value {
    width: 100%;
    background-color: var(--config-param-no-value);
    font-style: italic;
    color: var(--body-muted-text-color);
    border: 1px solid var(--card-border-color);
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;
}

@media screen and (max-width: 920px) {
    .config-items {
        flex-direction: column;
    }

    .config-container {
        order: 2;
        width: 100%;
        padding: 20px;
    }

    .config-menu-header {
        display: flex;
        padding: 20px;
    }

    .config-menu {
        padding: 0px;
        overflow: visible;
    }

    .config-menu-nav {
        height: 0;
        overflow: hidden;

        &__separator {
            display: block;
        }

        &__open {
            padding: 0 20px 20px 20px;
            height: auto;
            display: block;
        }
    }

    .config-sidebar {
        order: 1;
        max-width: none;
        position: relative!important;
        top: 0;
        margin-bottom: 15px;
        height: auto;
        max-height: none;
    }
}
</style>
