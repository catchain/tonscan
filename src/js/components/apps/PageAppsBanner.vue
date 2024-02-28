<template>
    <div class="page-apps-banner" v-bind:style="{
        'background-image': bannerLoaded ? `url(${bannerURL})` : 'none',
    }">
        <div class="page-apps-banner__overlay">
            <h2 class="page-apps-banner__heading" v-html="$t('apps.banner.title')"/>
            <div class="page-apps-banner__actions">
                <a target="_blank" href="https://t.me/SubmitAppBot" class="action__submit">
                    <icon-banner-plus/> {{$t('apps.banner.submit_app')}}
                </a>
                <a target="_blank" v-bind:href="$t('apps.banner.link')">
                    {{$t('apps.banner.learn_more')}}
                </a>
            </div>
        </div>

        <t-skeleton-loader
            v-if="!bannerLoaded"
            type="rectangle"
            width="100%"
            height="100%"
            border-radius="inherit"/>
    </div>
</template>

<script>
import IconBannerPlus from '@img/icons/tonscan/apps/banner-plus.svg?vue';
import bannerUrl from '@img/banner-new.png';

export default {
    name: 'AppsBanner',

    data() {
        return {
            bannerLoaded: false,
            bannerURL: bannerUrl,
        };
    },

    mounted() {
        const bannerImage = new Image();
        bannerImage.src = this.bannerURL;

        bannerImage.onload = () => {
            this.bannerLoaded = true;
        };
    },

    components: {
        IconBannerPlus,
    },
};
</script>

<style lang="scss">
.page-apps-banner {
    position: relative;
    height: 230px;
    margin-bottom: 20px;
    background-position: center;
    background-size: cover;
    border-radius: 12px;

    &__heading {
        font-family: Nunito, Rubik, Roboto, Ubuntu, Arial, sans-serif;
        font-weight: 800;
        font-size: 32px;
        text-align: center;
        margin-top: 0;
    }

    &__image {
        width: 100%;
        max-width: 880px;
        border-radius: 12px;
    }

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
    }

    &__actions {
        display: flex;
        gap: 32px;
        font-weight: 500;

        & > a {
            text-decoration: none;
            color: #FFF;
        }
        & > a:hover {
            text-decoration: none;
        }

        .action__submit {
            display: flex;
            align-items: center;
            gap: 8px;
            svg {
                width: 18px;
                height: 18px;
            }
        }
    }
}

.app-title {
    -webkit-text-fill-color: transparent;
    -webkit-font-feature-settings: "clig" off, "liga" off;
    font-feature-settings: "clig" off, "liga" off;
    background: linear-gradient(89deg, #2b82eb, #1cc8ff);
    background-clip: text;
    -webkit-background-clip: text;
    position: relative;
}

@media screen and (max-width: 480px) {
  .page-apps-banner {
        height: 200px;
        margin: -12px -16px 14px -16px;
        border-radius: 0 0 12px 12px;

        &__heading {
            font-size: 24px;
        }

        &__image {
            border-radius: 0;
            height: 240px;
        }

        &__overlay {
            display: flex;
        }
    }
}

@media screen and (max-width: 1240px) and (min-width: 481px) {
    .page-apps-banner {
        margin: -16px -16px 20px -16px;
        border-radius: 0 0 12px 12px;
    }
}
</style>
