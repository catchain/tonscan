<template>
    <div class="app__info">
        <app-info-item v-bind:title="$t('apps.app.category')" v-bind:loading="loading">
            <ui-link v-bind:to="{
                name: 'apps-category',
                params: { category: this.getCategoryBySlug(categorySlug, true) },
            }">
                {{categoryTitle}}
            </ui-link>
        </app-info-item>

        <app-info-item v-bind:title="$t('apps.app.website')" v-bind:loading="loading">
            <a v-bind:href="link" target="_blank" v-text="website"/>
        </app-info-item>

        <app-info-item v-if="address" v-bind:loading="loading" v-bind:title="$t('apps.app.blockchain_address')">
            <ui-copy-button class="card-main-address"
                v-bind:successMessage="$t('address.info.copy_success')"
                v-bind:copy="address">
                <ui-address hide-name v-bind:address="address"/>
            </ui-copy-button>
        </app-info-item>
    </div>
</template>

<script>
import AppInfoItem from '~/components/apps/App/AppInfoItem.vue';

export default {
    name: 'AppInfo',

    props: {
        address: {
            type: String,
        },
        categorySlug: {
            type: String,
        },
        link: {
            type: String,
        },
        loading: {
            type: Boolean,
        },
    },

    inject: ['getCategories', 'getCategoryBySlug'],

    data() {
        return {
            website: null,
        };
    },

    computed: {
        categoryTitle() {
            const category = this.getCategoryBySlug(this.categorySlug, true);
            return this.$t(`apps.categories.${category}`);
        },
    },

    watch: {
        loading() {
            if (this.loading === false) {
                this.setInfo();
            }
        },
    },

    methods: {
        setInfo() {
            this.setLink();
        },

        setLink() {
            let link = this.link;

            if (!link.includes('https://') && !link.includes('http://')) {
                link = 'https://' + link;
            }

            const linkURL = new URL(link);

            // Telegram links must contain only @name
            if (linkURL.hostname === 't.me') {
                let telegramLink = `@${linkURL.pathname}`;
                telegramLink = telegramLink.replace('/', '');
                this.website = telegramLink.split('/')[0];
            } else if (linkURL.pathname === '/') {
                this.website = `${linkURL.hostname}`;
            } else if (linkURL.hostname === 'github.com') {
                // GitHub links must contain path name
                this.website = `${linkURL.hostname}${linkURL.pathname}`;
            } else {
                this.website = `${linkURL.hostname}`;
            }
        },
    },

    components: {
        AppInfoItem,
    },
};
</script>

<style lang="scss" scoped>
.address-link:hover {
  text-decoration: underline;
}
</style>
