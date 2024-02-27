<template>
    <div>
        <div class="param-value" style="margin-bottom: 6px;">
            <div class="muted">{{ $t('config.suspended_until') }}</div>
            <div style="margin-top: 6px;"><ui-datetime v-bind:timestamp="content.suspended_until" /></div>
        </div>
        <div v-for="(address, index) in content.accounts" v-bind:key="index" class="config-viewer-address-item">
            <span class="config-viewer-address-item--id muted">{{ index + 1 }}</span>
            <ui-address v-bind:address="address" v-bind:hide-name="true" />
        </div>
        <div class="show-more-container show-more-container--config">
            <ui-link v-bind:to="{ name: 'suspended' }">
                <button>{{ $t('common.show_more') }}
                    <svg v-pre xmlns="http://www.w3.org/2000/svg" fill="none"
                        style="margin-left: 4px; width: 16px; height:12px; transform: scale(.8);">
                        <path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
                            d="m1.5 4.75 5.5 5.5 5.5-5.5" />
                    </svg>
                </button>
            </ui-link>
        </div>
    </div>
</template>
<!-- suspended_until -->
<script>
export default {
    props: {
        content: Array,
    },
};
</script>
