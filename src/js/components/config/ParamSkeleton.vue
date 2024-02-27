<template>
    <div class="param-skeleton-container">
        <div class="param-skeleton__header-container">
            <div class="skeleton param-skeleton param-skeleton__number">1</div>
            <div class="skeleton param-skeleton param-skeleton__header">header</div>
        </div>
        <div class="skeleton param-skeleton param-skeleton__sub">sub header</div>
        <div class="skeleton param-skeleton__viewer">
            viewer
        </div>
    </div>
</template>

<style lang="scss">
.param-skeleton-container {
    margin-bottom: 30px;
}

.param-skeleton {
    margin-bottom: 10px;

    &__header {
        width: 200px;
        height: 24px;
    }

    &__number {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    &__header-container {
        display: flex;
    }

    &__sub {
        width: 75%;
    }

    &__viewer {
        margin-top: 22px;
        height: 80px;
    }
}
</style>
