<template>
    <ui-link class="page-apps-mobile-navigation-pill"
        v-bind:to="getToByCategory(routeName)"
        v-bind:class="{
            'page-apps-mobile-navigation-pill--open': isActive,
        }">

        <component v-bind:is="icon" class="page-apps-mobile-navigation-pill__icon"/>

        <div class="page-apps-mobile-navigation-pill__text" v-text="text"/>
    </ui-link>
</template>

<script>
export default {
    inject: ['getToByCategory'],

    props: {
        routeName: String,
        icon: Object,
        text: String,
        isActive: Boolean,
    },
};
</script>

<style lang="scss">
.page-apps-mobile-navigation-pill {
    user-select: none;
    box-sizing: border-box;
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: var(--apps-navigation-btn-background);
    padding: 10px 15px 10px 12px;
    border-radius: 12px;
    font-weight: 500;
    color: var(--app-list-nav-btn-text);
    border: 1px solid var(--apps-navigation-btn-border-color);
    height: 40px;
    text-decoration: none;

    &:active {
        background: var(--apps-navigation-btn-active-background-color);
    }

    &:hover {
        text-decoration: none;
    }

    &__icon {
        width: 20px;
        height: 20px;
        color: inherit;
    }

    &__text {
        font-size: 14px;
        margin-left: 8px;
        line-height: 20px;
        color: inherit;
    }

    &--open {
        border: 2px solid var(--apps-navigation-btn-selected-border-color);
        padding: 10px 14px 10px 11px;
        background: var(--apps-navigation-btn-selected-background);
        color: var(--apps-navigation-btn-selected-text-color);
    }
}
</style>
