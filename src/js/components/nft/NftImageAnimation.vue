<script>
let image = undefined;

const createImage = (url) => {
    image = new Image;
    image.src = url;
    return image.decode().then(() => image);
};

export default {
    render(createElement) {
        return createElement('img', { attrs: { src: this.src }})
    },

    props: {
        animationUrl: String,
        fallbackUrl: String,
    },

    data() {
        return {
            src: undefined,
        };
    },

    created() {
        this.src = this.fallbackUrl;
    },

    mounted() {
        createImage(this.animationUrl).then((image) => {
            this.src = image.src;
        }).catch(console.error).finally(() => {
            image = undefined;
        });
    },
};
</script>
