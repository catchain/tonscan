<template>
    <main class="source-viewer-code">
        <ui-copy-button class="source-viewer-code__copy" v-if="contentToCopy" v-bind:copy="contentToCopy"/>

        <div v-if="!displayedContent" class="source-viewer-code__skeletons">
            <span v-pre class="skeleton" style="width: 10%"></span>
            <span v-pre class="skeleton" style="width: 60%"></span>
            <span v-pre class="skeleton" style="width: 30%"></span>
            <span v-pre class="skeleton" style="width: 20%"></span>
            <span v-pre class="skeleton" style="width: 80%"></span>
            <span v-pre class="skeleton" style="width: 60%"></span>
        </div>

        <pre v-else class="source-viewer-code__pre" v-html="displayedContent"/>
    </main>
</template>

<script>
import axios from 'axios';
import { highlight } from '~/lib/highlight.js';

/**
 * @param  {String} filename
 * @return {String}
 */
const guessLanguageByFileName = (filename) => filename.endsWith('.fif') ? 'fift' : 'func';

export default {
    props: {
        content: String,
        url: String,
        fullPath: String,
        filename: String,
    },

    data() {
        return {
            isLoading: true,
            displayedContent: null,
            contentToCopy: null,
        };
    },

    mounted() {
        this.loadData();
    },

    watch: {
        url() {
            this.loadData();
        },
    },

    methods: {
        async loadData() {
            if (!this.url) return;

            const language = guessLanguageByFileName(this.filename);

            if (this.content) {
                this.displayedContent = await highlight(this.content, language);
                this.contentToCopy = this.content;
                return;
            }

            this.isLoading = true;
            this.displayedContent = null;
            this.contentToCopy = null;

            const url = this.url.replace('ipfs://', 'https://tonsource.infura-ipfs.io/ipfs/');
            const fileContents = await axios.get(url).then(response => response.data);

            // set small timeout to avoid skeleton blink:
            setTimeout(async () => {
                this.displayedContent = await highlight(fileContents, language);
                this.contentToCopy = fileContents;
                this.isLoading = false;
            }, 150);
        },
    },
};
</script>
