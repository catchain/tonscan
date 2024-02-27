<template>
    <div class="param-container">
        <template v-for="(properties, index) in list">
            <h4
                v-bind:key="'heading-' + index"
                style="margin-bottom: 6px;"
                v-if="properties[0] != ''"
            >{{ $t(`config.${properties[0]}`) }}</h4>
            <div v-for="(property, keyIndex) in Object.entries(properties[1])" v-bind:key="'property-' + index + '-' + keyIndex" class="param-value">
                <div class="muted">
                    {{ $t(`config.${property[0]}`) }}
                </div>

                <ui-address v-if="checkAddress(property[1])" v-bind:address="property[1]" />
                <div v-else style="margin-top: 6px">
                    {{ property[1] }}
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { isValidAddress } from '~/tonweb.js';

export default {
    props: {
        content: Object,
    },
    data() {
        return {
            list: Array,
        };
    },
    created() {
        this.list = Object.entries(this.content);
    },
    methods: {
        checkAddress(address) {
            return isValidAddress(address);
        },
    },
};
</script>

<style lang="scss">
.param-container {
  position: relative;
  width: auto;
  white-space: nowrap;
  overflow-x: auto;
  padding: 4px 0;
}

.param-container>h4:first-child {
  margin-top: 4px;
}

.param-value {
  display: inline-block;
  padding-right: 16px;
}
</style>
