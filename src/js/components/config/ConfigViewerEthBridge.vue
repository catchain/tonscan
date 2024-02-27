<template>
    <div>
        <div class="param-container" style="margin-bottom: 8px;">
            <div class="param-value">
                <div class="muted">{{ $t('config.state_flags') }}</div>
                <div style="margin-top: 6px;">{{ content.state_flags }}</div>
            </div>
            <div class="param-value">
                <div class="muted">{{ $t('config.bridge_addr') }}</div>
                <div style="margin-top: 6px;"><ui-address v-bind:address="content.bridge_address" /></div>
            </div>
            <div class="param-value">
                <div class="muted">{{ $t('config.oracle_multisig_address') }}</div>
                <div style="margin-top: 6px;"><ui-address v-bind:address="content.oracles_address" /></div>
            </div>
            <h4 style="margin-bottom: 6px;">{{ $t('config.prices') }}</h4>
            <div v-for="(value, name) in content.prices" v-bind:key="name" class="param-value">
                <div class="muted">{{ $t(`config.${name}`) }}</div>
                <div style="margin-top: 6px;">{{ value }}</div>
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
