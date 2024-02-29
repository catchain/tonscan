<template>
    <div class="page-apps-mobile-navigation-container">
        <div class="page-apps-mobile-navigation"
            v-bind:class="{ 'page-apps-mobile-navigation--open': mobileNavigationExpanded }">

            <!-- Currently selected category: -->
            <category-pill
                v-show="!mobileNavigationExpanded"
                v-bind:isActive="currentCategory !== undefined"
                v-bind:routeName="activeCategory?.slug"
                v-bind:icon="activeCategory?.icon"
                v-bind:text="activeCategory?.name"
                v-on:click.prevent.native="toggleMobileNavigation()"/>

            <!-- Other categories: -->
            <category-pill
                v-show="mobileNavigationExpanded"
                v-for="category in categories"
                v-bind:key="category.slug"
                v-bind:isActive="currentCategory === category.slug"
                v-bind:routeName="category.slug"
                v-bind:icon="category.icon"
                v-bind:text="category.name"
                v-on:click.native="toggleMobileNavigation(category)"/>
        </div>

        <div class="page-apps-mobile-navigation-filters" v-show="!mobileNavigationExpanded">
            <slot name="filters"/>
        </div>
    </div>
</template>

<script>
import CategoryPill from '~/components/apps/Navigation/NavigationMobileBtn.vue';

export default {
    name: 'AppsListNavigation',

    inject: [
        'getAppsFilters',
        'getCategories',
        'getCurrentCategory',
        'getCurrentFilter',
        'setCurrentFilter',
    ],

    data() {
        return {
            mobileNavigationExpanded: false,
        };
    },

    computed: {
        currentCategory() {
            return this.getCurrentCategory();
        },

        categories() {
            return this.getCategories();
        },

        activeCategory() {
            return this.categories.find(category => category.slug === this.currentCategory);
        },
    },

    methods: {
        toggleMobileNavigation() {
            this.mobileNavigationExpanded = !this.mobileNavigationExpanded;
        },
    },

    components: { CategoryPill },
};
</script>

<style lang="scss">
.page-apps-mobile-navigation-container {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
}

.page-apps-mobile-navigation {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    overflow: hidden;
    max-height: 40px;
    transition-property: max-height;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    &--open {
        max-height: 500px;
    }
}

.page-apps-mobile-navigation-filters {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
