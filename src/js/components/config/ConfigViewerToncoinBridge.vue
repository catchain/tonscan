<template>
    <div>
        <div class="param-container" style="margin-bottom: 8px;">
            <div class="param-value">
                <div class="muted">{{ $t('config.bridge_addr') }}</div>
                <div style="margin-top: 6px;"><ui-address v-bind:address="content.bridge_addr" /></div>
            </div>
            <div class="param-value">
                <div class="muted">{{ $t('config.oracle_multisig_address') }}</div>
                <div style="margin-top: 6px;"><ui-address v-bind:address="content.oracle_multisig_address" /></div>
            </div>
            <div class="param-value">
                <div class="muted">{{ $t('config.external_chain_address') }}</div>
                <div style="margin-top: 6px;">{{ content.external_chain_address }}</div>
            </div>
        </div>
        <div v-for="(oracle, index) in content.oracles" v-bind:key="index" class="config-viewer-address-item">
            <span class="config-viewer-address-item--id muted">{{ index + 1 }}</span>
            <ui-address v-bind:address="oracle" v-bind:hide-name="true" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: Object,
    },
};
</script>
