<template>
    <div class="theme-selector">
        <div class="theme-selector-box"
            v-for="langCode in availableLanguages"
            v-bind:class="{ 'theme-selector-box--selected': selected === langCode }"
            v-on:click="selected = langCode">

            <span class="theme-selector-box__tick" v-if="selected === langCode">
                <icon-success class="theme-selector-box__tick__icon"/>
            </span>

            <div class="theme-selector-box__text" style="border: none;" v-text="$t(`settings.language.${langCode}`)"/>
        </div>
    </div>
</template>

<script>
import { APP_MAIN_LOCALE } from '~/config.js';
import IconSuccess from '@primer/octicons/build/svg/check-16.svg?inline';

export default {
    computed: {
        defaultLanguage() {
            return APP_MAIN_LOCALE;
        },

        availableLanguages() {
            return this.$i18n.availableLocales;
        },

        selected: {
            get() {
                return this.$store.state.appLocale;
            },

            set(lang) {
                this.$store.commit('updateLocale', lang);
            },
        },
    },

    components: { IconSuccess },
};
</script>
