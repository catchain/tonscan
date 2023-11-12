<template>
    <section>
        <app-header-bar/>

        <main class="content">
            <router-view/>
        </main>

        <ui-modal align-top v-bind:isOpen.sync="settingsModalVisible">
            <template v-slot:header>{{$t('settings.title')}}</template>
            <ui-settings/>
        </ui-modal>

        <toast-container/>
    </section>
</template>

<script>
import ToastContainer from '~/components/UiToastContainer.vue';
import AppHeaderBar from '~/components/AppHeaderBar.vue';
import UiSettings from '~/components/settings/Settings.vue';

export default {
    data() {
        return {
            settingsModalVisible: false,
        };
    },

    created() {
        this.$bus.$on('app:open-settings-modal', () => {
            this.settingsModalVisible = true;
        });
    },

    beforeDestroy() {
        this.$bus.$off('app:open-settings-modal');
    },

    metaInfo() {
        return {
            // Add alternate lang links to every page:
            // @see https://developers.google.com/search/docs/specialty/international/localized-versions
            link: this.$i18n.availableLocales.map((lang) => Object.freeze({
                rel: 'alternate',
                hreflang: lang,
                href: this.$localizedUrl(lang),
            })),
        };
    },

    components: { ToastContainer, AppHeaderBar, UiSettings },
};
</script>
