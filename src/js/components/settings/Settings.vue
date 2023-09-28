<template>
    <section>
        <section class="ui-settings-section">
            <h4 class="ui-settings-section__title" v-text="$t('settings.language.title')"/>
            <settings-language/>
        </section>

        <section class="ui-settings-section">
            <h4 class="ui-settings-section__title" v-text="$t('settings.theme.title')"/>
            <settings-theme/>
        </section>
    </section>
</template>

<script>
import SettingsTheme from './SettingsTheme.vue';
import SettingsLanguage from './SettingsLanguage.vue';

export default {
    components: {
        SettingsTheme, SettingsLanguage,
    },
};
</script>

<style lang="scss">
.ui-settings-section {
    margin: 12px 18px;
    &__title {
        padding: 4px 2px 2px;
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 500;
        margin: 0;
        opacity: .6;
    }
}
</style>
