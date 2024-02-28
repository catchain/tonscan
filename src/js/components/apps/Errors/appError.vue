<template>
    <div class="app-wrapper">
        <section class="app">
            <div class="app-error">
                <div class="app-error-title">
                    <span>{{ $t('apps.app.error_app') }}</span>
                </div>
                <div class="app-error-button">
                    <ui-link
                        class="btn"
                        v-bind:to="{
                            name: 'apps',
                        }">
                        <span>{{ $t('apps.go_catalog') }}</span>
                    </ui-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    //
};
</script>

<style lang="scss" scoped>

$app-page-padding-x: 25px;
$app-page-padding-y: 25px;

.app {
    padding:
        $app-page-padding-y
        $app-page-padding-x
        0
        $app-page-padding-x;
    background: var(--card-background);
    border: 1px solid var(--card-border-color);
    border-radius: 13px;
    margin-top: 16px;
    position: relative;
}

.app-error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-bottom: 25px;
}

.app-error-title {
    color: var(--apps-navigation-inactive-color);
    margin-bottom: 20px;
}

.app-error-button {
    .btn {
        display: block;
        line-height: 40px;
        padding: 0 15px;
        background: var(--big-blue-button-background);
        color: #FFF;
        font-weight: 500;
        font-size: 14px;
        border-radius: 6px;
        text-align: center;
        -webkit-transition: all .15s;
        -o-transition: all .15s;
        transition: all .15s;
    }

    .btn:hover {
        text-decoration: none;
        background: var(--big-blue-button-hover-background);
    }
}

@media screen and (max-width: 480px) {

    $app-page-mobile-padding-x: 16px;
    $app-page-mobile-padding-y: 24px;

    .app {
        padding:
            $app-page-mobile-padding-y
            $app-page-mobile-padding-x
            0
            $app-page-mobile-padding-x;
        border: none;
        border-radius: 0;
        margin-left: -$app-page-mobile-padding-x;
        margin-top: 12px;
        width: 100%;
        border-top: 1px solid var(--card-border-color);
        border-bottom: 1px solid var(--card-border-color);

    }
}
</style>
