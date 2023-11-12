<template>
    <section class="indexpage-container">
        <svg v-on:click="$bus.$emit('app:open-settings-modal')" class="indexpage-settings-button" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>

        <svg v-pre class="indexpage-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" stroke-width="1" d="M46.54 19.143c.608.424.92 2.325.605 6.494a42.027 42.027 0 0 1-.606 4.514c1.411 2.459 1.8 5.247 1.167 8.366-.561 2.761-2.398 5.341-5.345 7.805C39.413 48.787 35.995 51 31.969 51c-4.027 0-8.154-2.323-10.66-4.678-2.507-2.354-4.084-4.575-4.813-7.047-.883-2.997-.587-6.038.886-9.124-.313-1.654-.51-3.158-.59-4.514-.296-4.994-.106-5.965.59-6.494.947-.72 3.961 1.13 9.042 5.547 2.327-.421 4.186-.631 5.576-.631 1.39 0 3.228.21 5.513.63 5.114-4.326 8.123-6.175 9.026-5.546Z"/>
            <path fill="currentColor" d="M31.932 43.822c-1.234.024-2.896-1.649-2.896-2.333 0-.685 1.948-.888 3.037-.888 1.09 0 2.897.116 2.897.888 0 .771-1.804 2.309-3.038 2.333ZM23.985 37.338c1.785.695 3.59.315 4.03-.85.44-1.165-.65-2.674-2.435-3.37-1.784-.695-3.305-.775-3.746.39-.44 1.165.367 3.134 2.151 3.83ZM39.96 37.137c-1.687.815-3.525.516-3.965-.65-.44-1.164.65-2.673 2.434-3.369 1.785-.695 3.127-.775 3.567.39.44 1.165-.349 2.813-2.036 3.629Z"/>
        </svg>

        <ui-search focus-on-load show-search-button class="indexpage-search" v-bind:placeholder="$t('indexpage.search_placeholder')"/>
    </section>
</template>

<script>
import UiSearch from '~/components/UiSearch.vue';

export default {
    metaInfo() {
        return {
            title: this.$t('indexpage.meta.title'),
            meta: [{
                property: 'description',
                content: this.$t('indexpage.meta.description'),
            }],
        };
    },

    components: { UiSearch },
};
</script>

<style lang="scss">
.indexpage-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    padding: 16px;
    box-sizing: border-box;
    position: relative;
}
.indexpage-settings-button {
    position: absolute;
    top: 18px;
    right: 8px;
    opacity: .8;
    cursor: pointer;
    stroke: #797979;
    width: 18px;
    height: 18px;
    &:hover {
        opacity: 1;
    }
}
.indexpage-logo {
    display: block;
    width: 180px;
    height: 180px;
    margin: 0 auto 24px;
}

@media screen and (max-width: 480px) {
    .indexpage-container {
        padding: 16px 8px;
    }
}

.indexpage-search {
    max-width: 600px;
    font-size: 16px;
    .search-input {
        border-radius: 12px;
        border: 2px solid var(--card-border-color);
        box-shadow: 0 0.5rem 1.2rem var(--card-box-shadow-color);
        background: var(--indexpage-search-background-color);
        &__input {
            padding: 12px 24px;
            background: transparent;
        }
    }
    .search-results {
        padding-bottom: 8px;
        &__link {
            margin: 4px 4px -4px 6px;
            border-radius: 8px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .search-result {
        &__left {
            margin-left: -4px;
        }
    }
}

@media screen and (max-width: 480px) {
    .indexpage-search {
        .search-input__input {
            padding-left: 18px;
            padding-right: 18px;
        }
        .search-results {
            &__link {
                margin-left: 0;
                margin-right: 0;
            }
        }
    }
}
</style>
