<template>
    <section>
        <header class="header" v-bind:class="{ 'header--mobile-search-visible': searchVisible }" v-show="$route.name != 'index'">
            <div class="header__container container">
                <router-link v-bind:to="{ name: 'index' }" style="flex-grow: 0">
                    <svg class="header__logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M46.54 19.143c.608.424.92 2.325.605 6.494a42.027 42.027 0 0 1-.606 4.514c1.411 2.459 1.8 5.247 1.167 8.366-.561 2.761-2.398 5.341-5.345 7.805C39.413 48.787 35.995 51 31.969 51c-4.027 0-8.154-2.323-10.66-4.678-2.507-2.354-4.084-4.575-4.813-7.047-.883-2.997-.587-6.038.886-9.124-.313-1.654-.51-3.158-.59-4.514-.296-4.994-.106-5.965.59-6.494.947-.72 3.961 1.13 9.042 5.547 2.327-.421 4.186-.631 5.576-.631 1.39 0 3.228.21 5.513.63 5.114-4.326 8.123-6.175 9.026-5.546Z" stroke="currentColor" stroke-width="2.5"/><path d="M31.932 43.822c-1.234.024-2.896-1.649-2.896-2.333 0-.685 1.948-.888 3.037-.888 1.09 0 2.897.116 2.897.888 0 .771-1.804 2.309-3.038 2.333ZM23.985 37.338c1.785.695 3.59.315 4.03-.85.44-1.165-.65-2.674-2.435-3.37-1.784-.695-3.305-.775-3.746.39-.44 1.165.367 3.134 2.151 3.83ZM39.96 37.137c-1.687.815-3.525.516-3.965-.65-.44-1.164.65-2.673 2.434-3.369 1.785-.695 3.127-.775 3.567.39.44 1.165-.349 2.813-2.036 3.629Z" fill="currentColor"/></g></svg>
                </router-link>

                <div class="header-search-mobile" v-on:click="searchVisible = true">
                    <svg class="header-search-mobile__loopa" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
                </div>

                <div class="header-search">
                    <svg class="header-search__loopa" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>

                    <input class="header-search__input" type="search" ref="search" spellcheck="false"
                        enterkeyhint="search" autocomplete="off" tabindex="1"
                        v-bind:placeholder="$t('header.search_placeholder')"
                        v-model.trim="searchValue"
                        v-on:blur="handleBlur()"
                        v-on:keyup.enter="search()"
                        v-on:keyup.esc="reset()">

                    <svg v-show="addressLoading" class="header-search__loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18">
                        <circle v-pre cx="9" cy="9" fill="none" stroke="currentColor" stroke-width="2" r="8" stroke-dasharray="34 12">
                            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 9 9;360 9 9" keyTimes="0;1"/>
                        </circle>
                    </svg>
                </div>
            </div>
        </header>

        <div class="content">
            <router-view/>
        </div>

        <toast-container/>
    </section>
</template>

<script>
import { matchAddress } from '~/search.js';
import ToastContainer from './UiToastContainer.vue';

export default {
    data() {
        return {
            searchVisible: false,
            searchValue: undefined,
            addressLoading: false,
        };
    },

    watch: {
        searchVisible(isVisible) {
            if (isVisible) {
                this.$nextTick(() => this.$refs.search.focus());
            }
        },
    },

    methods: {
        async search() {
            this.addressLoading = true;
            const match = await matchAddress(this.searchValue);
            this.addressLoading = false;

            if (! match) {
                // Иначе сначала показывается алерт, а потом останавливается спиннер:
                return this.$nextTick(() => alert('Invalid address format'));
            }

            this.$router.push({
                name: 'address',
                params: { address: match },
            });

            this.reset();
        },

        reset() {
            this.searchValue = '';
            this.searchVisible = false;
            this.$refs.search.blur();
        },

        handleBlur() {
            if (!this.searchValue || this.searchValue.length == 0) {
                this.searchVisible = false;
            }
        },
    },

    components: { ToastContainer },
};
</script>
