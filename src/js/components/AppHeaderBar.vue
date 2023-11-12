<template>
    <header class="header"
        v-show="$route.name != 'index'"
        v-bind:class="{ 'header--mobile-search-visible': searchVisible }">

        <div class="header__container container">
            <ui-link v-bind:to="{ name: 'index' }" style="flex-grow: 0">
                <svg v-pre class="header__logo" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="currentColor" stroke-width="2.5" d="M46.54 19.143c.608.424.92 2.325.605 6.494a42.027 42.027 0 0 1-.606 4.514c1.411 2.459 1.8 5.247 1.167 8.366-.561 2.761-2.398 5.341-5.345 7.805C39.413 48.787 35.995 51 31.969 51c-4.027 0-8.154-2.323-10.66-4.678-2.507-2.354-4.084-4.575-4.813-7.047-.883-2.997-.587-6.038.886-9.124-.313-1.654-.51-3.158-.59-4.514-.296-4.994-.106-5.965.59-6.494.947-.72 3.961 1.13 9.042 5.547 2.327-.421 4.186-.631 5.576-.631 1.39 0 3.228.21 5.513.63 5.114-4.326 8.123-6.175 9.026-5.546Z"/>
                    <path fill="currentColor" d="M31.932 43.822c-1.234.024-2.896-1.649-2.896-2.333 0-.685 1.948-.888 3.037-.888 1.09 0 2.897.116 2.897.888 0 .771-1.804 2.309-3.038 2.333ZM23.985 37.338c1.785.695 3.59.315 4.03-.85.44-1.165-.65-2.674-2.435-3.37-1.784-.695-3.305-.775-3.746.39-.44 1.165.367 3.134 2.151 3.83ZM39.96 37.137c-1.687.815-3.525.516-3.965-.65-.44-1.164.65-2.673 2.434-3.369 1.785-.695 3.127-.775 3.567.39.44 1.165-.349 2.813-2.036 3.629Z"/>
                </svg>
            </ui-link>

            <div class="header-ear-right">
                <ui-search show-loopa class="header-search"
                    v-bind:focusInputField="searchVisible"
                    v-bind:placeholder="$t('header.search_placeholder')"
                    v-on:collapseMobileSearch="searchVisible = false"/>

                <nav class="header-ear-right__buttons">
                    <icon-loopa class="header-ear-right__button header-ear-right__button--loopa"
                        v-on:click="searchVisible = true"/>

                    <icon-settings class="header-ear-right__button header-ear-right__button--settings"
                        v-on:click="$bus.$emit('app:open-settings-modal')"/>
                </nav>
            </div>
        </div>
    </header>
</template>

<script>
import IconLoopa from  '@img/icons/material-duotone/search.svg?inline';
import IconSettings from  '@img/icons/material-duotone/more_vert.svg?inline';
import UiSearch from '~/components/UiSearch.vue';

export default {
    data() {
        return {
            searchVisible: false,
        };
    },

    components: {
        IconLoopa, IconSettings, UiSearch,
    },
};
</script>

<style lang="scss">
.header {
    display: flex;
    background: var(--header-background);
    box-shadow: 0 1px 10px var(--header-box-shadow-color);
    padding: 8px 0;
    margin-bottom: 18px;
    height: 55px; // 54 + border
    border-bottom: 1px solid var(--header-border-bottom-color);
    box-sizing: border-box;
    position: relative;
    z-index: 80000;

    &__container {
        flex-grow: 1;
        max-width: 1200px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__logo {
        width: 46px;
        height: 46px;
        margin: -10px 0;
        position: relative;
        bottom: -1px;
        color: var(--header-logo-color);
        transition: .1s color ease;
        &:hover {
            color: var(--body-text-color);
        }

        .header--mobile-search-visible & {
            display: none;
        }
    }
}

.header-ear-left {
    //
}

.header-ear-right {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;
    &__buttons {
        display: flex;
        align-items: center;
    }
    &__button {
        cursor: pointer;
        color: #797979;
        padding: 16px 4px 16px 12px;
        margin: -12px -2px;
        fill: currentColor;
        width: 24px;
        height: 24px;
        &:hover {
            color: #444;
        }

        &--loopa {
            display: none;
            z-index: 80010;
        }
        &--settings {
            z-index: 80001;
        }
    }
}

@media screen and (max-width: 1200px) {
    .header__container {
        padding: 0 8px;
    }
}

.header-search {
    position: relative;
    width: auto;
    font-size: 14px;

    .search-input {
        min-width: 340px;
        background: var(--body-light-muted-color);
        color: var(--body-text-color);
        border-radius: 6px;
        border: 2px solid transparent;
        transition: .12s min-width ease,
                    .12s border-color ease;
        &__loopa {
            margin: 0 -8px 0 8px;
            opacity: 0.3;
        }
        &__input {
            padding: 9px 0 9px 16px;
            &::placeholder {
                color: #939394;
            }
            &::-webkit-input-placeholder {
                color: #939394;
            }
        }
        &--expanded {
            min-width: 480px;
        }
        &:focus-within {
            min-width: 480px;
            outline: 0 none;
        }
    }
    .search-input-controls {
        &__loader {
            transform: scale(0.9);
        }
    }

    .search-results {
        padding-bottom: 4px;
        padding-top: 4px;
        overflow: hidden;
        &__link {
            margin: 0 0 0 0;
        }
    }
    .search-result {
        &__left {
            margin-left: -4px;
        }
    }
}

@media screen and (max-width: 480px) {
    .header {
        margin-bottom: 12px;
    }

    .header-search {
        flex-grow: 1;
        .search-input {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            &:focus-within {
                max-width: 100%;
                width: 100%;
                min-width: 0;
            }
        }
    }

    // Small screen: hide search input UNLESS user clicked the loopa button:
    .header-search {
        display: none;

        .header--mobile-search-visible & {
            display: flex !important;
        }
    }

    .header-ear-right {
        // Small screen - hide right ear buttons IF the search field is active:
        &__buttons {
            .header--mobile-search-visible & {
                display: none;
            }
        }

        // Small screen - uncover loopa button:
        &__button {
            &--loopa {
                display: flex;
            }
        }
    }
}
</style>
