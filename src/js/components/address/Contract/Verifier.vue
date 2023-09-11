<template>
    <section>
        <verifier-admonition
            v-bind:contractAddress="address"
            v-bind:isVerified="isVerified"
            v-bind:isActive="isActive"
            v-bind:compilerName="compilerName"
            v-bind:compilerVersion="compilerVersion"
            v-bind:compilerCmd="compilerCmd"/>

        <section class="verifier-sources" v-show="isLoading || isActive">
            <aside class="verifier-sources__files">
                <div class="verifier-sources__files__elevator">
                    <verifier-file-list v-if="tree === undefined || tree.length > 0"
                        v-bind:files="tree"
                        v-on:selectFile="selectFile"/>

                    <verifier-file-list
                        v-bind:files="rawFiles"
                        v-on:selectFile="selectRaw"/>
                </div>
            </aside>

            <div class="verifier-sources__code">
                <verifier-bytecode-viewer
                    v-if="currentTab.filename === 'raw_data' || currentTab.filename === 'raw_source'"
                    v-bind:source-base64="currentTab.content.base64"
                    v-bind:source-decompiled="currentTab.content.decompiled"
                    v-bind:source-cells="currentTab.content.cells"
                    v-bind:source-hex="currentTab.content.hex"/>

                <verifier-source-code v-else
                    v-bind:fullPath="currentTab.fullPath"
                    v-bind:filename="currentTab.filename"
                    v-bind:content="currentTab.content"
                    v-bind:url="currentTab.content_url"/>
            </div>
        </section>
    </section>
</template>

<script>
import { getVerifiedSourceByAddress } from '~/api/extenderContracts.js';
import { getAddressContractInfo } from '~/api';
import { base64ToHex } from '~/utils.js';
import VerifierSourceCode from './VerifierSourceCode.vue';
import VerifierFileList from './VerifierFileList.vue';
import VerifierAdmonition from './VerifierAdmonition.vue';
import VerifierBytecodeViewer from './VerifierBytecodeViewer.vue';

const generateFileTree = function(sources) {
    // we need flat map of source file references for easier access:
    const flatMap = [];

    // backup fullPath because we'll change filename prop:
    for (let i = 0; i < sources.length; i++) {
        sources[i].fullPath = sources[i].filename;
    }

    const makeTree = (files) => {
        const tree = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const frags = file.filename.split('/');

            flatMap.push(file);

            if (frags.length === 1) {
                file.isActive = false; // set reactivity on
                tree.push(file);
                continue;
            }

            const dirName = frags[0];

            // get all files in the directory:
            const directoryContents = files
                .filter((source) => source.filename.startsWith(dirName))
                .map((source) => {
                    const fullPath = source.filename;
                    const filename = fullPath.replace(`${dirName}/`, '');
                    return { ...source, filename };
                });

            // push directories in the beginning:
            tree.unshift({
                name: frags[0],
                isCollapsed: true,
                fullPath: file.fullPath,
                files: makeTree(directoryContents),
            });

            // as the files are sorted and processing is sequential, we can skip all
            // with names starting with directory name:
            i += (directoryContents.length - 1);
        }

        return tree;
    };

    return { flatMap, treeMap: makeTree(sources) };
};

/**
 * @type {Promise<Object>}
 */
let rawInfoPromise = undefined;

export default {
    props: {
        isActive: Boolean,
        address: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            sources: [],
            tree: undefined,
            isVerified: undefined,
            rawFiles: [],
            currentTab: {},
            isLoading: true,
            compilerName: undefined,
            compilerVersion: undefined,
            compilerCmd: undefined,
        };
    },

    created() {
        rawInfoPromise = undefined;

        this.rawFiles = [{
            filename: 'raw_source',
            isActive: false,
            content: {},
            text: this.$t('address.contract.tab_raw_source'),
        }, {
            filename: 'raw_data',
            isActive: false,
            content: {},
            text: this.$t('address.contract.tab_raw_data'),
        }];
    },

    beforeDestroy() {
        rawInfoPromise = undefined;
    },

    watch: {
        isActive: {
            immediate: true,
            // wait until we have address activity info:
            handler() {
                return this.loadData();
            },
        },
    },

    methods: {
        loadData() {
            if (this.isActive === undefined) {
                return;
            }

            if (this.isActive === false) {
                this.isLoading = false;
                this.isVerified = false;
                return;
            }

            getVerifiedSourceByAddress(this.address).then((response) => {
                this.isLoading = false;
                this.isVerified = response.source_item_data?.verifier_id !== undefined;

                this.compilerName = response.source_item_data?.content?.compiler?.name || null;
                this.compilerVersion = response.source_item_data?.content?.compiler?.version;
                this.compilerCmd = response.source_item_data?.content?.compiler?.cmd;

                if (!response.source_item_data?.content?.sources) {
                    this.tree = [];
                    return this.selectRaw(this.rawFiles[0]);
                }

                const { flatMap, treeMap } = generateFileTree(response.source_item_data.content.sources);

                // root level should have reverse order (files first, directories last):
                treeMap.sort((a, b) => b.files ? -1 : 1);
                treeMap.sort((a, b) => a.is_entrypoint ? -1 : 1);

                this.tree = treeMap;
                this.sources = flatMap;

                this.selectFile(flatMap[0]);
            });
        },

        selectFile(selectedFile) {
            this.sources.concat(this.rawFiles).forEach((tab) => {
                tab.isActive = Object.is(tab, selectedFile);
            });

            this.currentTab = selectedFile;
        },

        selectRaw(rawSource) {
            this.selectFile(rawSource);

            this.loadRawInfo().then((contract) => {
                this.currentTab.content = rawSource.filename === 'raw_data'
                    ? contract.data
                    : contract.code;
            });
        },

        loadRawInfo() {
            if (!rawInfoPromise) {
                rawInfoPromise = getAddressContractInfo(this.address);
            }

            return rawInfoPromise.then(({ code, data, meta }) => ({
                code: Object.freeze({ ...code, hex: base64ToHex(code.base64) }),
                data: Object.freeze({ ...data, hex: base64ToHex(data.base64) }),
            }));
        },
    },

    components: {
        VerifierSourceCode, VerifierBytecodeViewer, VerifierAdmonition, VerifierFileList,
    },
};
</script>

<style lang="scss">
.verifier-sources {
    display: flex;
    flex-direction: row;
    &__files {
        margin: 0 0 12px 12px;
        width: 240px;
        flex-shrink: 0;
        &__elevator {
            position: sticky;
            top: 12px;
        }
    }
    &__code {
        flex-grow: 1;
        overflow: auto;
        margin: 0 12px 12px 12px;
    }
}

.source-viewer-code__pre {
    display: flex;
    flex-direction: row;
    overflow: auto;
}

.hljs-hack-lines {
    padding: 0 10px 0 0;
    text-align: right;
    color: var(--body-muted-text-color);
}

.hljs-hack-code {
    padding: 0 10px 0 4px;
}

@media all and (max-width: 480px) {
    .verifier-sources {
        flex-direction: column;
        &__files {
            width: unset;
            margin-right: 12px;
        }
        &__code {
            margin-top: 0;
        }
    }
}
</style>
