<template>
    <section>
        <nav class="card-title-tabs" role="tablist">
            <span class="card-title-tab" role="tab" tabindex="0"
                v-for="tab in tabs"
                v-bind:key="tab.key"
                v-on:click="activeTab = tab.key"
                v-on:keyup.enter="activeTab = tab.key"
                v-bind:id="`tab_switcher_${tab.key}`"
                v-bind:aria-selected="activeTab === tab.key"
                v-bind:aria-controls="`tab_pane_${tab.key}`"
                v-bind:class="{
                    'card-title-tab--active': activeTab === tab.key,
                    'card-title-tab--disabled': tab.disabled,
                }">
                <component v-once v-bind:is="tab.icon" class="card-title-tab__icon"/>
                {{tab.text}}
            </span>
        </nav>

        <div class="tab-pane" role="tabpanel"
            v-for="tab in tabs"            
            v-bind:aria-labelledby="`tab_switcher_${tab.key}`"
            v-bind:id="`tab_pane_${tab.key}`"
            v-show="activeTab === tab.key">
            <keep-alive v-bind:max="2">
                <component
                    v-if="!tab.disabled && (activeTab === tab.key || tab.content.eager)"
                    v-bind:key="`ui_tab_${tab.content.key}_${tab.key}`"
                    v-bind:is="tab.content.component"
                    v-bind="tab.content.props"
                    v-on="$listeners"/> <!-- passthru all listeners to parent -->
            </keep-alive>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        tabs: {
            type: Array,
            required: true,
            default: () => [],
        },
        changeUrlHash: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            activeTab: undefined,
        };
    },

    watch: {
        $route: {
            immediate: true,
            handler({ hash }) {
                this.activeTab = (hash || this.tabs[0].key).replace('#', '');
            },
        },

        activeTab(tabName) {
            if (this.changeUrlHash) {
                // don't trigger route watchers on hash change:
                history.replaceState(null, null, `${this.$route.path}#${tabName}`);
            }
        },
    },
};
</script>

<style lang="scss">
.card-title-tabs {
    display: flex;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;
    flex-wrap: nowrap;
    flex-direction: row;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 1px solid var(--card-row-separator);
    background: var(--card-header-background);
    color: var(--card-header-color);
    padding: 0 12px;
    &::-webkit-scrollbar {
        display: none;
    }
}
.card-title-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    cursor: pointer;
    transition: .2s all ease;
    white-space: nowrap;
    color: var(--card-header-tab-color);
    &__icon {
        fill: currentColor;
        margin-right: 10px;
        width: 24px;
        height: 24px;
    }
    &:hover, &:focus, &:focus-visible {
        color: var(--body-text-color);
        box-shadow: 0 -2px 0 0 var(--body-muted-text-color) inset;
        outline: none;
    }
    &--active {
        &, &:hover, &:focus {
            color: var(--body-text-color);
            box-shadow: 0 -2px 0 0 var(--blue-bright) inset;
        }
        .card-title-tab__icon {
            fill: var(--blue-bright);
        }
    }
    &--disabled {
        pointer-events: none;
        color: var(--body-muted-text-color);
        opacity: .45;
    }
}

@media all and (max-width: 480px) {
    .card-title-tab {
        flex-grow: 1;
        flex-basis: 150px;
        padding: 13px 26px;
        font-size: 13px;
        &__icon {
            display: none;
        }
    }
}
</style>
