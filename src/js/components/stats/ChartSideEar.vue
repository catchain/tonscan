<style lang="scss">
.line-chart-ear {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 8px 0 0;
  width: 165px;
  box-sizing: border-box;
}

.line-chart-ear-box {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 0 16px;

  header {
    margin-bottom: 6px;
    font-size: 14px;
    color: var(--card-header-color);
  }

  &__value {
    font-size: 22px;
    margin-bottom: 5px;
  }

  footer {
    font-size: 13px;
  }
}

.data-container {
  display: flex;
  height: 100%;
  flex-direction: row;
}

@media screen and (max-width: 599px) {
  .data-container {
    flex-direction: column;

    .chart-bar {
      max-height: calc(100% - 93px);
    }
  }

  .line-chart-ear {
    flex-direction: row;
    width: unset;
    padding: 0;
    margin: 0 0 20px 0;
  }

  .line-chart-ear-box {
    padding: 0;
  }
}
</style>

<template>
  <aside class="line-chart-ear">
    <div class="line-chart-ear-box">
      <i18n :path="paramTop.localization" tag="header" />
      <div class="line-chart-ear-box__value">
        {{ paramTop.value }}
      </div>
      <footer>
        <chart-change-indicator v-bind:change="paramTop.change || 0" v-bind:rangeDays="interval" />
      </footer>
    </div>
    <div class="line-chart-ear-box">
      <i18n :path="paramMiddle.localization" tag="header" />
      <div class="line-chart-ear-box__value">
        {{ paramMiddle.value }}
      </div>
      <footer>
        <chart-change-indicator v-bind:change="paramMiddle.change || 0" v-bind:rangeDays="interval" />
      </footer>
    </div>
    <div class="line-chart-ear-box">
      <i18n :path="paramBottom.localization" tag="header" />
      <div class="line-chart-ear-box__value">
        {{ paramBottom.value }}
      </div>
      <footer>
        <chart-change-indicator v-bind:change="paramBottom.change || 0" v-bind:rangeDays="interval" />
      </footer>
    </div>
  </aside>
</template>

<script>
import ChartChangeIndicator from "./ChartChangeIndicator.vue";

export default {
  props: {
    paramTop: {
      type: Object,
      default: {}
    },
    paramMiddle: {
      type: Object,
      default: {}
    },
    paramBottom: {
      type: Object,
      default: {}
    },
    interval: {
      type: Number,
      default: 0
    },
  },
  components: {
    ChartChangeIndicator
  }
};
</script>