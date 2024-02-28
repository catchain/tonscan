<template>
    <div class="page-apps-not-found-kitty">
        <icon-search-not-found class="page-apps-not-found-kitty__icon"/>

        <span class="page-apps-not-found-kitty__text">
            {{$t('apps.app.nothing_found')}}
        </span>
    </div>
</template>

<script>
import IconSearchNotFound from '@img/icons/tonscan/apps/search-not-found.svg?vue';

export default {
    name: 'AppsSearchNotFound',
    components: {
        IconSearchNotFound,
    },
};
</script>

<style lang="scss">
.page-apps-not-found-kitty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    color: var(--apps-navigation-inactive-color);
    height: 240px;

    &__icon {
        margin: 0 auto;
        width: 150px;
    }

    &__text {
        font-size: 16px;
        font-weight: 400;
        color: var(--apps-navigation-inactive-color);
    }
}
</style>
