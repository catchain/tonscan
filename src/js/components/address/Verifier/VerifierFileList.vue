<template>
    <ul class="file-list">
        <template v-if="files === undefined">
            <li v-pre class="file-list__file">
                <span class="skeleton">stub-entrypoint.fc</span>
            </li>
            <li v-pre class="file-list__file">
                <span class="skeleton">stub-include.fc</span>
            </li>
        </template>

        <template v-else>
            <template v-for="source in files">
                <!-- Display directory name and file list: -->
                <template v-if="source.files">
                    <li class="file-list__file file-list__file--directory"
                        v-on:click="source.isCollapsed = !source.isCollapsed">
                        <icon-directory class="file-list__file__svg"/>
                        {{source.name}}
                    </li>

                    <verifier-file-list
                        v-show="!source.isCollapsed"
                        v-bind:files="source.files"
                        v-on:selectFile="handleSelectFile"/>
                </template>

                <!-- display file name: -->
                <li v-else class="file-list__file"
                    v-bind:key="source.fullPath"
                    v-on:click="handleSelectFile(source)"
                    v-bind:class="{
                        'file-list__file--active': source.isActive,
                    }">

                    <icon-binary v-if="source.filename.startsWith('raw_')" class="file-list__file__svg"/>
                    <icon-file v-else class="file-list__file__svg"/>

                    <span class="file-list__file__name" v-text="source.text || source.filename"/>
                </li>
            </template>
        </template>
    </ul>
</template>

<script>
import IconDirectory from '@primer/octicons/build/svg/file-directory-fill-16.svg?inline';
import IconBinary from '@primer/octicons/build/svg/file-binary-16.svg?inline';
import IconFile from '@primer/octicons/build/svg/file-16.svg?inline';

export default {
    name: 'VerifierFileList',

    props: {
        files: {
            type: Array,
            optional: true,
        },
    },

    methods: {
        handleSelectFile(source) {
            this.$emit('selectFile', source);
        },
    },

    components: {
        IconDirectory, IconFile, IconBinary,
    },
};
</script>

<style lang="scss">
.file-list {
    margin: 0; 
    padding: 1px 0 0 0; // compensate code viewer border
    list-style: none;
    & > & {
        margin-left: 12px;
    }
    & + & {
        margin-top: 12px;
    }
    &__file {
        padding: 8px 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-radius: 6px;
        margin-bottom: 4px;
        border: 1px solid transparent;
        position: relative;
        &:hover, &--active {
            background: var(--code-viewer-file-selector-background-color);
            border-color: var(--code-viewer-file-selector-border-color);
        }
        &::before {
            content: '';
            width: 2px;
            height: 0;
            background: var(--blue-bright);
            position: absolute;
            left: 3px;
            border-radius: 4px;
            transition: .15s height ease;
        }
        &--active::before {
            height: 70%;
        }

        &__svg {
            fill: currentColor;
            margin-right: 6px;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            .file-list__file--directory & {
                opacity: .7;
                padding-left: 1px;
            }
        }
        &__name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            min-width: 0;
        }
    }
}
</style>
