<template>
  <section>
    <div class="contract-tabs">
      <div class="subtabs">
        <button
            class="subtab"
            v-for="tab in tabs"
            v-bind:key="tab.key"
            v-on:click="activeTab = tab.key"
            v-on:keyup.enter="activeTab = tab.key"
            :class="{ 'subtab--active': tab.key === activeTab }"
        >
          {{tab.text}}
        </button>
      </div>
    </div>
    <div class="tab-pane" role="tabpanel" v-for="tab in tabs" v-show="activeTab === tab.key">
      <keep-alive>
        <component v-bind="tab.props" v-bind:is="tab.component" />
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
    },
  },
  data() {
    return {
      activeTab: "source",
    }
  },
}
</script>
<style lang="scss">
.contract-tabs {
  margin-top: 16px;
  margin-left: 12px;
}
.subtabs {
  display: flex;
  align-items: center;
  gap: 10px;
;
}
.subtab {
  cursor: pointer;
  border-radius: 6px;
  padding: 10px 12px;
  background: var(--code-viewer-file-selector-background-color);
  border: 1px solid var(--code-viewer-file-selector-background-color);

  font-weight: 500;
  text-transform: uppercase;

  &--active {
    border-color: var(--blue-bright);
  }
}
</style>