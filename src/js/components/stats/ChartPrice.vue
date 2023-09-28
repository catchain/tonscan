<template>
  <div class="card" style="height: 100%; max-width: 100%">
    <div class="card-title" style="border: none">
      <i18n path="stats.market_data" />
      <chart-interval-selector v-model="interval" />
    </div>
    <div class="data-container">
      <side-ear v-if="!isDataLoading" v-bind:param-top="marketData.price" v-bind:param-middle="marketData.caps"
        v-bind:param-bottom="marketData.volume" v-bind:interval="interval" />

      <line-chart hide-legend style="flex-grow: 1" v-bind:labels="parsedChartLabels"
        v-bind:datasets="parsedChartDatasets" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "~/lib/Chart.js/UiChartLine.vue";
import SideEar from "./ChartSideEar.vue";
import ChartIntervalSelector, {
  INTERVAL_TWO_WEEKS,
} from "./ChartIntervalSelector.vue";
import { prefixNumber } from "~/lib/Chart.js/helpers.js";
import {
  AMOUNT_OF_DATA_ON_MOBILE,
  AMOUNT_OF_DATA_ON_TABLET,
  decimateDataset
} from "~/helpers.js";
import ChartColorSchemeMixin from '~/mixins/chartColorScheme.js';
import { decimateData } from '~/decimation.js';

const decimatePrice = (dataset, offset) => {
  const updatedDataset = decimateDataset(dataset, offset);

  return {
    ...updatedDataset,
    data: updatedDataset.data.map((y, idx) => ({ x: idx, y })),
  };
};


export default {
  mixins: [ChartColorSchemeMixin],
  props: {
    marketCap: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      interval: INTERVAL_TWO_WEEKS,
      labels: undefined,
      datasets: undefined,
      marketData: {
        price: {},
        caps: {},
        volume: {},
      },
      isDataLoading: true
    };
  },

  watch: {
    interval() {
      this.loadData();
    },
  },

  mounted() {
    setTimeout(() => this.loadData(), 300);
  },

  computed: {
    parsedChartLabels() {
      if (!this.labels) {
        return undefined;
      }

      switch (true) {
        case this.isMobile:
          return decimateData(this.labels, AMOUNT_OF_DATA_ON_MOBILE);
        case this.isTablet:
          return decimateData(this.labels, AMOUNT_OF_DATA_ON_TABLET);
        default:
          return this.labels;
      }
    },
    parsedChartDatasets() {
      if (!this.datasets) {
        return undefined;
      }

      const [_priceDataset, _volumeDataset] = this.datasets;

      const priceDataset = {
        ..._priceDataset,
        backgroundGradient: [
          `${this.chartLineColor}50`,
          `${this.chartLineColor}20`,
          `${this.chartLineColor}00`,
        ],
        borderColor: this.chartLineColor,
      };

      const volumeDataset = {
        ..._volumeDataset,
        backgroundColor: `${this.chartLineColor}70`
      };

      switch (true) {
        case this.isMobile:
          return [
            decimatePrice(priceDataset, AMOUNT_OF_DATA_ON_MOBILE),
            decimatePrice(volumeDataset, AMOUNT_OF_DATA_ON_MOBILE),
          ];
        case this.isTablet:
          return [
            decimatePrice(priceDataset, AMOUNT_OF_DATA_ON_TABLET),
            decimatePrice(volumeDataset, AMOUNT_OF_DATA_ON_TABLET),
          ];
        default:
          return [decimatePrice(priceDataset, 1), decimatePrice(volumeDataset, 1)];
      }
    },
  },

  methods: {
    updateInterval({ length }) {
      this.interval = length;
    },

    async loadMarketData() {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/the-open-network?localization=false&community_data=false&developer_data=false&market_data=true"
      );
    },

    async loadData() {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/the-open-network/market_chart?vs_currency=USD&days=${this.interval}`
      );

      const calculate = (dataset, key, localization) => {
        let latestValue = dataset[key][dataset[key].length - 1][1];
        const earliestValue = dataset[key][0][1];
        const valueDiff = (latestValue - earliestValue) / latestValue;

        // Set capitalization value from props
        if (localization === "stats.capitalization") latestValue = this.marketCap;

        return Object.freeze({
          localization: localization,
          value: "$ " + prefixNumber(latestValue),
          change: valueDiff,
        });
      };

      this.marketData.price = calculate(data, "prices", "stats.price");
      this.marketData.caps = calculate(data, "market_caps", "stats.capitalization");
      this.marketData.volume = calculate(data, "total_volumes", "stats.trading_volume");

      const labels = data.prices.map(([timestamp]) => timestamp);

      const priceDataset = Object.freeze({
        data: data.prices.map(([_, value]) => value),
        borderWidth: 1.5,
        fill: true,
        yAxisID: "y",
        label: this.$t("stats.price"),
        suffix: " USD",
        parsing: false,
      });

      const volumeDataset = Object.freeze({
        data: data.total_volumes.map(([_, value]) => value),
        fill: true,
        type: "bar",
        yAxisID: "volume",
        label: this.$t("stats.volume"),
        suffix: " TON",
        parsing: false,
      });

      this.labels = labels;
      this.datasets = [priceDataset, volumeDataset];
      this.isDataLoading = false;
    },
  },

  components: {
    LineChart,
    SideEar,
    ChartIntervalSelector,
  },
};
</script>
