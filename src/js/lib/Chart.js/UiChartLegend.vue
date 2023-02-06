<template functional>
    <div class="chart-legend" v-bind:class="{ 'chart-legend--table': props.layout === 'table' }">
        <template v-if="props.items.length > 0">
            <div class="chart-legend-row"
                v-for="item in props.items"
                v-on:click="item.onclick"
                v-bind:class="{ 'chart-legend-row--disabled': item.hidden }">
                <div class="chart-legend-item">
                    <div class="chart-legend-item__pipka" v-bind:style="{ backgroundColor: item.color }"/>
                    {{item.text}}
                </div>
                <div class="chart-legend-item chart-legend-item--align-right" v-if="item.value" v-text="item.value"/>
            </div>
        </template>

        <template v-else>
            <div class="chart-legend-row" v-for="_ in 7">
                <div class="chart-legend-item">
                    <span class="skeleton">metric name - metric value</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        items: Array,
        layout: {
            type: String,
            default: 'row',
        },
    },
};
</script>

<style lang="scss">
.chart-legend-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0;
    padding: 0;
}
.chart-legend {
    margin: 0 6px 4px;
    width: auto;
    display: flex;
    flex-direction: row;
    flex-shrink: 1;
    &--table {
        margin: 12px 0 8px;
        flex-direction: column;
        justify-content: flex-start;
    }
}
.chart-legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0 8px;
    white-space: nowrap;
    border-radius: 4px;
    &--disabled {
        filter: saturate(0%);
        text-decoration: line-through;
        opacity: .4;
    }
    &:hover {
        background: rgba(255, 255, 255, 0.04);
    }
}
.chart-legend-item {
    display: flex;
    align-items: center;
    padding: 5px 4px;
    color: inherit;
    font-size: 13px;
    &__pipka {
        height: 8px;
        width: 8px;
        margin-right: 8px;
        border-radius: 6px;
    }
    &--align-right {
        justify-content: flex-end;
    }
}
</style>
