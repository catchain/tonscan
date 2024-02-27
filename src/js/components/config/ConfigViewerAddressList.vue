<template>
    <div>
        <div v-for="(address, index) in content" v-bind:key="index" class="config-viewer-address-item">
            <span class="config-viewer-address-item--id muted">{{ index + 1 }}</span>
            <ui-address v-bind:address="address" v-bind:hide-name="true" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: Array,
    },
};
</script>

<style lang="scss">
.config-viewer-address-item {
    display: flex;
    border-bottom: 1px solid var(--card-border-color);
    padding: 10px 10px 10px 0;

    &--id {
        margin: 0 30px 0 10px;
    }
}

.config-viewer-address-item:last-child {
    padding-bottom: 10;
    border: none;
}
</style>
