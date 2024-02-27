<template>
    <section class="source-viewer source-viewer--tabbed">
        <nav class="source-viewer-nav">
            <div
                v-for="(tab, index) in tabs"
                v-bind:key="'tab-' + index"
                class="source-viewer-nav__tab"
                v-on:click="currentTab = tab"
                v-bind:class="{ 'source-viewer-nav__tab--active': currentTab === tab }">
                <span>
                    {{ tab }}
                </span>
            </div>
        </nav>

        <main class="source-viewer-code">
            <ui-copy-button class="source-viewer-code__copy" v-if="configType === 'unknown' || currentTab !== 'content'"
                v-bind:copy="content" />

            <div v-if="isLoading" class="source-viewer-code__skeletons">
                <span v-pre class="skeleton" style="width: 10%"></span>
                <span v-pre class="skeleton" style="width: 60%"></span>
                <span v-pre class="skeleton" style="width: 30%"></span>
                <span v-pre class="skeleton" style="width: 20%"></span>
                <span v-pre class="skeleton" style="width: 80%"></span>
                <span v-pre class="skeleton" style="width: 60%"></span>
            </div>

            <div v-else-if="currentTab === 'content'" class="config-content-viewer">
                <!-- Special case: address -->
                <config-viewer-address v-if="configType === 'address'" v-bind:address="content" />

                <!-- Special case: address list -->
                <config-viewer-address-list v-else-if="configType === 'address_list'" v-bind:content="content" />

                <!-- Special case: suspended list -->
                <config-viewer-suspended-list v-else-if="configType === 'suspended_list'" v-bind:content="content" />

                <!-- Special case: toncoin bridge -->
                <config-viewer-toncoin-bridge v-else-if="configType === 'toncoin_bridge'" v-bind:content="content" />

                <!-- Special case: eth bridge -->
                <config-viewer-eth-bridge v-else-if="configType === 'eth_bridge'" v-bind:content="content" />

                <!-- Special case: list -->
                <config-viewer-list v-else-if="configType === 'list'" v-bind:content="content" />

                <!-- Special case: validators tables -->
                <config-viewer-validators v-else-if="configType === 'validators'" v-bind:validators="content" />

                <!-- Any other case -->
                <p v-else>{{ content }}</p>
            </div>

            <div v-else>
                <pre class="source-viewer-code__pre" v-html="content" v-bind:class="{
                    [`source-viewer-code__pre--${currentTab}`]: true,
                }" />
            </div>
        </main>
    </section>
</template>

<script>
import ConfigViewerAddress from './ConfigViewerAddress.vue';
import ConfigViewerAddressList from './ConfigViewerAddressList.vue';
import ConfigViewerSuspendedList from './ConfigViewerSuspendedList.vue';
import ConfigViewerToncoinBridge from './ConfigViewerToncoinBridge.vue';
import ConfigViewerEthBridge from './ConfigViewerEthBridge.vue';
import ConfigViewerList from './ConfigViewerList.vue';
import ConfigViewerValidators from './ConfigViewerValidators.vue';

export default {
    props: {
        configType: String,
        configContent: undefined,
        configValue: undefined,
        configTlb: String,
    },

    data() {
        return {
            currentTab: 'content',
        };
    },

    computed: {
        isLoading() {
            return !this.configContent;
        },

        tabs() {
            const tabs = ['content'];

            if (this.configValue) {
                tabs.push('value');
            }
            if (this.configTlb) {
                tabs.push('TL-B');
            }

            return tabs;
        },

        content() {
            switch (this.currentTab) {
                case 'content': return this.configContent;
                case 'value': return this.configValue;
                case 'TL-B': return this.configTlb;
                default: return null;
            }
        },
    },

    watch: {
        configContent() {
            this.currentTab = this.tabs[0];
        },
    },

    components: {
        ConfigViewerAddress,
        ConfigViewerAddressList,
        ConfigViewerSuspendedList,
        ConfigViewerToncoinBridge,
        ConfigViewerEthBridge,
        ConfigViewerList,
        ConfigViewerValidators,
    },
};
</script>

<style>
.config-content-viewer {
    margin: 10px 14px;
    padding: 0;
    z-index: 900;
}

.semi-transparent-spoiler {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, . 5);
    backdrop-filter: blur(6px);
    border-radius: 0 .5rem .5rem .5rem;

    div {
        text-align: center;
    }
}
</style>
