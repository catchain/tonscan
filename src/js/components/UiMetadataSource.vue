<template>
    <span class="nft-metadata-badge">
        <span v-if="url === undefined" class="skeleton">somewhere</span>

        <span v-else-if="isIpfs" class="nft-metadata-badge__label">
            <icon-ipfs class="nft-metadata-badge__label__icon"/>
            <span v-pre class="nft-metadata-badge__label__text">IPFS</span>
        </span>

        <span v-else-if="isOnchain" class="nft-metadata-badge__label">
            <icon-onchain class="nft-metadata-badge__label__icon"/>
            <span class="nft-metadata-badge__label__text" v-text="$t('nft.item.metadata_source_onchain')"/>
            <span class="muted" style="margin-right: 0.35em;">&bull;</span>
            <a v-on:click.prevent="sourceModalVisible = true" v-text="$t('nft.item.metadata_view_source')"/>
        </span>

        <span v-else class="nft-metadata-badge__label">
            <icon-offchain class="nft-metadata-badge__label__icon"/>
            <span class="nft-metadata-badge__label__text" v-text="$t('nft.item.metadata_source_offchain')"/>
        </span>

        <template v-if="displayedUrl">
            <span class="muted" style="margin-right: 0.35em;">&bull;</span>
            <a target="_blank" rel="nofollow noreferrer"
                v-bind:href="displayedUrl"
                v-text="$t('nft.item.metadata_view_source')"/>
        </template>

        <ui-modal v-if="isOnchain && loader" v-bind:isOpen.sync="sourceModalVisible">
            <template slot="header">
                {{$t('common.raw_metadata')}}
            </template>

            <div class="source-viewer" style="margin: 12px">
                <div class="source-viewer-code">
                    <div v-if="!rawSource" class="source-viewer-code__skeletons">
                        <span v-pre class="skeleton" style="width: 10%"></span>
                        <span v-pre class="skeleton" style="width: 60%"></span>
                        <span v-pre class="skeleton" style="width: 30%"></span>
                        <span v-pre class="skeleton" style="width: 20%"></span>
                        <span v-pre class="skeleton" style="width: 80%"></span>
                        <span v-pre class="skeleton" style="width: 60%"></span>
                    </div>

                    <pre v-else class="source-viewer-code__pre" v-text="rawSource"/>
                </div>
            </div>
        </ui-modal>
    </span>
</template>

<script>
import IconOffchain from '@primer/octicons/build/svg/globe-16.svg?inline';
import IconOnchain from '@primer/octicons/build/svg/file-binary-16.svg?inline';
import IconIpfs from '@primer/octicons/build/svg/package-16.svg?inline';

export default {
    props: {
        url: String,
        loader: Function,
    },

    data() {
        return {
            sourceModalVisible: false,
            rawSource: null,
        };
    },

    watch: {
        async sourceModalVisible(isVisible) {
            if (isVisible && !this.rawSource) {
                this.rawSource = await this.loader();
            }
        },
    },

    computed: {
        isIpfs() {
            return this.url && (
                this.url.match(/[\/\.]ipfs[\/\.]/) ||
                this.url.startsWith('ipfs://'));
        },

        displayedUrl() {
            return this.isIpfs
                ? this.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                : this.url;
        },

        isOnchain() {
            return this.url === null;
        },
    },

    components: {
        IconOffchain, IconIpfs, IconOnchain,
    },
};
</script>

<style lang="scss">
.nft-metadata-badge {
    display: flex;
    align-items: center;
    &__label {
        display: inline-flex;
        align-items: center;
        &__icon {
            fill: currentColor;
            margin-right: 0.35em;
        }
        &__text {
            font-weight: 500;
            margin-right: 0.35em;
        }
    }
}
</style>
