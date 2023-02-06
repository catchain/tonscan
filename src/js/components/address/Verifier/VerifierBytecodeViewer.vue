<template>
    <section class="source-viewer source-viewer--tabbed">
        <nav class="source-viewer-nav">
            <template v-for="tab in tabs">
                <span class="source-viewer-nav__tab"
                    v-bind:class="{ 'source-viewer-nav__tab--active': currentTab === tab }"
                    v-on:click="currentTab = tab"
                    v-text="$t(`address.contract.source_${tab}`)"/>
            </template>
        </nav>

        <main class="source-viewer-code">
            <ui-copy-button class="source-viewer-code__copy" v-if="content" v-bind:copy="content"/>

            <div v-if="isLoading" class="source-viewer-code__skeletons">
                <span v-pre class="skeleton" style="width: 10%"></span>
                <span v-pre class="skeleton" style="width: 60%"></span>
                <span v-pre class="skeleton" style="width: 30%"></span>
                <span v-pre class="skeleton" style="width: 20%"></span>
                <span v-pre class="skeleton" style="width: 80%"></span>
                <span v-pre class="skeleton" style="width: 60%"></span>
            </div>

            <pre v-else class="source-viewer-code__pre" v-html="content"
                v-bind:class="{
                    [`source-viewer-code__pre--${currentTab}`]: true, 
                }"/>
        </main>
    </section>
</template>

<script>
export default {
    props: {
        sourceBase64: String,
        sourceDecompiled: String,
        sourceHex: String,
        sourceCells: String,
    },

    data() {
        return {
            currentTab: 'base64',
        };
    },

    computed: {
        isLoading() {
            return !this.sourceBase64;
        },

        tabs() {
            const tabs = ['base64'];

            this.sourceHex && tabs.push('hex');
            this.sourceCells && tabs.push('cells');
            this.sourceDecompiled && tabs.push('tvm');

            return tabs;
        },

        content() {
            switch (this.currentTab) {
                case 'base64': return this.sourceBase64;
                case 'cells': return this.sourceCells;
                case 'tvm': return this.sourceDecompiled;
                case 'hex': return this.sourceHex;
            };
        },
    },

    watch: {
        sourceBase64() {
            this.currentTab = this.tabs[0];
        },
    },
};
</script>

<style lang="scss">
.source-viewer-nav {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: -1px;
    z-index: 800;
    overflow: auto;
    scrollbar-width: none;
    &__tab {
        background: var(--code-viewer-tab-inactive-background);
        padding: 8px 18px 8px;
        border: 1px solid var(--code-viewer-border-color);
        border-left-width: 0;
        color: #666;
        overflow: hidden;
        font-size: 13px;
        white-space: nowrap;
        flex-shrink: 0;
        transition: .16s all ease;
        &:first-child {
            border-left-width: 1px;
            border-top-left-radius: 6px;
        }
        &:last-child {
            border-top-right-radius: 6px;
        }
        &--active {
            color: var(--body-text-color);
            background: var(--code-viewer-background);
            border-bottom-color: var(--code-viewer-background);
            pointer-events: none;
            z-index: 1000;
        }
        @media (hover: hover) {
            &:hover {
                color: var(--body-text-color);
            }
        }
    }
}
.source-viewer-code {
    position: relative;
    background: var(--code-viewer-background);
    border: 1px solid var(--code-viewer-border-color);
    border-radius: 6px;

    .source-viewer--tabbed & {
        border-top-left-radius: 0;
    }

    &__copy {
        position: absolute !important;
        right: 5px;
        top: 6px;
        z-index: 1200;
        background: var(--code-viewer-background);
        padding: 5px 8px 6px 5px;
        border-radius: 6px;
    }
    &__pre {
        margin: 8px 14px;
        padding: 0;
        z-index: 900;
        white-space: pre;
        word-wrap: break-word;
        word-break: break-all;
        overflow: auto;
        font-family: 'Ubuntu Mono', monospace;
        font-size: 15px;
        line-height: 25px;

        &--base64, &--hex {
            white-space: pre-wrap;
        }
    }
    &__skeletons {
        .skeleton {
            height: 1em;
            margin: 1em;
        }
    }
}
</style>
