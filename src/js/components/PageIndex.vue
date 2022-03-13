<template>
    <section class="indexpage-container">

        <svg v-pre class="indexpage-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" stroke-width="1" d="M46.54 19.143c.608.424.92 2.325.605 6.494a42.027 42.027 0 0 1-.606 4.514c1.411 2.459 1.8 5.247 1.167 8.366-.561 2.761-2.398 5.341-5.345 7.805C39.413 48.787 35.995 51 31.969 51c-4.027 0-8.154-2.323-10.66-4.678-2.507-2.354-4.084-4.575-4.813-7.047-.883-2.997-.587-6.038.886-9.124-.313-1.654-.51-3.158-.59-4.514-.296-4.994-.106-5.965.59-6.494.947-.72 3.961 1.13 9.042 5.547 2.327-.421 4.186-.631 5.576-.631 1.39 0 3.228.21 5.513.63 5.114-4.326 8.123-6.175 9.026-5.546Z"/>
            <path fill="currentColor" d="M31.932 43.822c-1.234.024-2.896-1.649-2.896-2.333 0-.685 1.948-.888 3.037-.888 1.09 0 2.897.116 2.897.888 0 .771-1.804 2.309-3.038 2.333ZM23.985 37.338c1.785.695 3.59.315 4.03-.85.44-1.165-.65-2.674-2.435-3.37-1.784-.695-3.305-.775-3.746.39-.44 1.165.367 3.134 2.151 3.83ZM39.96 37.137c-1.687.815-3.525.516-3.965-.65-.44-1.164.65-2.673 2.434-3.369 1.785-.695 3.127-.775 3.567.39.44 1.165-.349 2.813-2.036 3.629Z"/>
        </svg>

        <div class="indexpage-search">
            <input type="search" ref="search" class="indexpage-search__input" enterkeyhint="search" spellcheck="false" autocomplete="off"
                v-bind:placeholder="$t('indexpage.search_placeholder')"
                v-model.trim="searchValue"
                v-on:keyup.enter="search()"
                v-on:keyup.esc="reset()">

            <svg v-show="addressLoading" class="indexpage-search__loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18">
                <circle v-pre cx="9" cy="9" fill="none" stroke="currentColor" stroke-width="2" r="8" stroke-dasharray="34 12">
                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 9 9;360 9 9" keyTimes="0;1"/>
                </circle>
            </svg>
        </div>
    </section>
</template>

<script>
import { matchAddress } from '~/search.js';

export default {
    data() {
        return {
            searchValue: undefined,
            addressLoading: false,
        };
    },

    mounted() {
        this.$nextTick(() => this.$refs.search.focus());
    },

    methods: {
        async search() {
            this.addressLoading = true;
            const match = await matchAddress(this.searchValue);
            this.addressLoading = false;

            if (! match) {
                // Otherwise alert is shown before the spinner is hidden:
                return this.$nextTick(() => alert('Invalid address format'));
            }

            this.$router.push({
                name: 'address',
                params: { address: match },
            });

            this.reset();
        },

        reset() {
            this.$refs.search.blur();
            this.searchValue = '';
        },
    },
};
</script>
