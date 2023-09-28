import { getCSSVar } from '~/utils.js'

export default {
    data () {
        return {
            chartGridColor: getCSSVar('chart-grid-color'),
            chartPieBorderColor: getCSSVar('chart-pie-border-color'),
            chartLineColor : getCSSVar('chart-line-green-color'),
            chartBarPrimaryColor: getCSSVar('chart-bar-primary-color'),
            chartBarSecondaryColor: getCSSVar('chart-bar-secondary-color')
        }
    },

    watch: {
        '$store.state.appTheme': {
            immediate: true,
            handler() {
                this.chartGridColor = getCSSVar('chart-grid-color')
                this.chartPieBorderColor = getCSSVar('chart-pie-border-color')
                this.chartLineColor = getCSSVar('chart-line-green-color')
                this.chartBarPrimaryColor = getCSSVar('chart-bar-primary-color')
                this.chartBarSecondaryColor = getCSSVar('chart-bar-secondary-color')
            }
        },
    }
}