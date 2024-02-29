<template>
    <nav class="page-apps-navigation">
        <ui-link class="page-apps-navigation-item"
            v-for="(category, index) in categories"
            v-bind:key="index"
            v-bind:to="getToByCategory(category.slug)"
            v-bind:class="{
                'page-apps-navigation-item--active': currentCategory === category.slug,
            }">

            <div class="page-apps-navigation-item__content">
                <component class="page-apps-navigation-item__icon"
                    v-bind:is="category.icon"/>

                <div class="page-apps-navigation-item__name">
                    {{category.name}}
                </div>
            </div>
        </ui-link>
    </nav>
</template>

<script>
export default {
    name: 'AppsNavigation',

    props: {
        category: {
            type: String,
            required: false,
        },
    },

    inject: ['getCategories', 'getCurrentCategory', 'getToByCategory'],

    computed: {
        categories() {
            return this.getCategories();
        },

        currentCategory() {
            return this.getCurrentCategory();
        },
    },
};
</script>

<style lang="scss">
.page-apps-navigation {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 10px;
}

.page-apps-navigation-item {
    padding-left: 10px;
    display: flex;
    align-items: center;
    height: 48px;
    color: var(--apps-navigation-inactive-color);
    cursor: pointer;
    transition: 0.1s ease-in-out;
    font-weight: 500;

    &:hover {
        color: var(--apps-navigation-hover-color);
        text-decoration: none;
    }

    &__content {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
    }

    &__name {
        margin-left: 16px;
        line-height: 24px;
    }

    &__icon {
        width: 24px;
        height: 24px;
    }

    &--active {
        color: var(--apps-navigation-icon-active);
        &:hover {
            color: var(--apps-navigation-icon-active);
        }
    }
}
</style>
