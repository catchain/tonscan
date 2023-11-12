const predefinedMediaQueries = {
    mobile: '(max-width: 599px)',
    tablet: '(min-width: 600px) and (max-width: 991px)'
}
export default {
    install (Vue) {
        Vue.mixin({
            data () {
                return {
                    isMobile: false,
                    isTablet: false
                }
            },
            mounted () {
                this.checkDevice('mobile', 'isMobile')
                this.checkDevice('tablet', 'isTablet')
                window.addEventListener('resize', this.resizeListener)
            },
            methods: {
                checkDevice(device, property) {
                    const match = matchMedia(predefinedMediaQueries[device]).matches
                    match !== this[property] && (this[property] = match)
                },
                resizeListener () {
                    this.checkDevice('mobile', 'isMobile')
                    this.checkDevice('tablet', 'isTablet')
                }
            },
            beforeDestroyed () {
                window.removeEventListener('resize', this.resizeListener)
            }
        })
    }
}