<template>
    <nav class="t-breadcrumbs">
        <span v-if="items === undefined" class="skeleton">Breadcrumbs > Item > Skeleton</span>

        <template v-else>
            <div class="t-breadcrumbs-crumb"
                v-for="(item, index) in items"
                v-bind:key="index"
                v-bind:class="{
                    't-breadcrumbs-crumb--selected': isLastBreadCrumb(index),
                }">
                <i v-if="item.name === undefined" class="skeleton">Some App Name</i>

                <ui-link v-else-if="item.to" v-bind:to="item.to">
                    {{item.name}}
                </ui-link>

                <span v-else>
                    {{item.name}}
                </span>

                <icon-arrow-right-breadcrumb class="t-breadcrumbs-crumb__chevron"
                    v-if="!isLastBreadCrumb(index)"/>
            </div>
        </template>
    </nav>
</template>

<script>
import IconArrowRightBreadcrumb from '@img/icons/tonscan/arrow-right-breadcrumb.svg?vue';

export default {
    name: 'TBreadcrumbs',

    props: {
        items: {
            type: Array,
        },
    },

    methods: {
        isLastBreadCrumb(index) {
            return index === this.items.length - 1;
        },
    },

    components: {
        IconArrowRightBreadcrumb,
    },
};
</script>

<style lang="scss">
.t-breadcrumbs {
    display: flex;
    gap: 8px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    overflow: hidden;
    overflow-x: overlay;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.t-breadcrumbs-crumb {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--breadcrumbs-text-color);

    :last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    a, span {
        color: var(--breadcrumbs-text-color);
        cursor: pointer;
        text-decoration: none;
        transition: all .2s;
    }

    a:hover {
        color: var(--body-text-color);
        text-decoration: none;
    }

    &__chevron {
        color: var(--breadcrumbs-text-color);
        width: 5px;
        height: 9px;
    }

    &--selected span {
        color: var(--body-text-color);
        cursor: default;
    }
}
</style>
