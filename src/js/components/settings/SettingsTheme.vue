<template>
    <section>
        <div class="theme-selector">
            <div class="theme-selector-box"
                v-for="theme in ['light', 'auto', 'dark']"
                v-on:click="selected = theme"
                v-bind:class="{
                    'theme-selector-box--selected': selected === theme,
                    [`theme-selector-box--theme-${theme}`]: true,
                }">

                <span class="theme-selector-box__tick" v-if="selected === theme">
                    <icon-success class="theme-selector-box__tick__icon"/>
                </span>

                <icon-theme-light v-if="theme === 'light'" class="theme-selector-box__image"/>
                <icon-theme-auto v-else-if="theme === 'auto'" class="theme-selector-box__image"/>
                <icon-theme-dark v-else-if="theme === 'dark'" class="theme-selector-box__image"/>

                <div class="theme-selector-box__text" v-text="$t(`settings.theme.${theme}`)"/>
            </div>
        </div>
    </section>
</template>

<script>
import IconSuccess from '@primer/octicons/build/svg/check-16.svg?inline';
import IconThemeLight from '@img/icons/tonscan/theme-light.svg?inline';
import IconThemeAuto from '@img/icons/tonscan/theme-auto.svg?inline';
import IconThemeDark from '@img/icons/tonscan/theme-dark.svg?inline';

export default {
    computed: {
        selected: {
            get() {
                return this.$store.state.appTheme;
            },

            set(theme) {
                this.$store.commit('updateTheme', theme);
            },
        },
    },

    components: {
        IconSuccess, IconThemeLight, IconThemeAuto, IconThemeDark,
    },
};
</script>

<style lang="scss">
.theme-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 0;
}
.theme-selector-box {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    flex: 1;
    border-width: 2px;
    border-style: solid;
    border-color: var(--theme-selector-auto-border-color);
    background: var(--theme-selector-auto-background);
    color: var(--theme-selector-auto-text-color);

    .theme-selector-box__text, .theme-selector-box__image {
        border-color: var(--theme-selector-auto-separator-color);
    }

    &--theme-light {
        background: var(--theme-selector-light-background);
        border-color: var(--theme-selector-light-border-color);
        color: var(--theme-selector-light-text-color);
        .theme-selector-box__text, .theme-selector-box__image {
            border-color: var(--theme-selector-light-separator-color);
        }
    }

    &--theme-dark {
        background: var(--theme-selector-dark-background);
        border-color: var(--theme-selector-dark-border-color);
        color: var(--theme-selector-dark-text-color);
        .theme-selector-box__text, .theme-selector-box__image {
            border-color: var(--theme-selector-dark-separator-color);
        }
    }

    &--selected {
        border-color: var(--blue-bright);
    }

    &__tick {
        position: absolute;
        left: -9px;
        top: -9px;
        width: 22px;
        height: 22px;
        background: var(--blue-bright);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &__icon {
            fill: #FFF;
            width: 14px;
        }
    }
    &__image {
        width: 72px;
        height: 59px;
        margin: 20px auto;
        border-radius: 4px;
        border: 2px solid;
    }
    &__text {
        padding: 12px;
        text-align: center;
        border-width: 1px 0 0 0;
        border-style: solid;
    }
}

@media all and (max-width: 480px) {
    .theme-selector {
        flex-direction: column;
        gap: 12px;
    }
    .theme-selector-box {
        width: 100%;
        flex-direction: row;
        &__image {
            margin: unset;
            margin: 12px 16px;
            height: 46px;
            width: auto;
        }
        &__text {
            border-left-width: 1px;
            border-top-width: 0;
            align-self: center;
            padding: 8px 16px;
        }
    }
}
</style>
