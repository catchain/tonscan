<template>
    <div class="app__header">
        <div class="app__logo"
            v-if="!loading"
            v-bind:style="{ 'background-image': `url(${avatar})` }"/>

        <div v-else class="app__logo">
            <t-skeleton-loader
                border-radius="10px"
                type="rectangle"
                width="100%"
                height="100%"/>
        </div>

        <div class="app__heading">
            <h1 class="app__title" v-if="!loading">
                {{ title }}
                <icon-verified v-if="isVerified"/>
            </h1>
            <t-skeleton-loader v-else
                type="paragraph"
                height="32px"
                width="100%"
                border-radius="7px"/>

            <div class="app__short-description">
                <span v-if="!loading">{{ shortDescription }}</span>
                <t-skeleton-loader v-else
                    type="paragraph"
                    width="100%"
                    height="24px"
                    border-radius="7px"/>
            </div>

            <div v-if="!isMobile" class="app__open-btn">
                <a v-if="!loading" target="_blank" v-bind:href="link">
                    <t-btn color="blue">
                        {{ $t('apps.app.open_app') }}
                    </t-btn>
                </a>

                <t-skeleton-loader v-else
                    type="button"
                    height="40px"
                    width="100%"/>
            </div>
        </div>
    </div>
</template>

<script>
import IconVerified from '@img/icons/tonscan/apps/verified.svg?vue';
import { makeImageUrl } from '~/components/apps/index.js';

export default {
    name: 'AppHeader',

    props: {
        loading: {
            type: Boolean,
        },
        title: {
            type: String,
        },
        icon: {
            type: String,
        },
        isVerified: {
            type: Boolean,
        },
        link: {
            type: String,
        },
        shortDescription: {
            type: String,
        },
    },

    computed: {
        avatar() {
            return makeImageUrl(this.icon, {
                width: 140,
                height: 140,
                resizingType: 'fill',
            });
        },
    },

    components: {
        IconVerified,
    },
};
</script>

<style lang="scss" scoped>

.app {
  &__header {
    display: flex;
    margin-bottom: 25px;
  }

  &__logo {
    width: 140px;
    height: 140px;
    border-radius: 12px;
    background-size: cover;
    flex-shrink: 0;
  }

  &__heading {
    margin-left: 30px;
  }

  &__title {
    font-size: 24px;
    display: flex;
    gap: 9px;
    align-items: center;
    margin: 0;
    min-height: 24px; // For skeleton

    & svg {
      color: var(--app-icon-verified-color);
      width: 20px;
      height: 20px;
    }
  }

  &__short-description {
    margin-top: 8px;
    font-weight: 400;
    color: var(--app-short-description);
    max-width: 420px;
    line-height: 24px;
    // For skeleton loader
    min-width: 180px;
  }

  &__open-btn {
    margin-top: 14px;

    & a {
      display: block;
      width: fit-content;
    }
  }

  &__open-btn button {
    text-transform: uppercase;
    height: 40px;
    font-size: 14px;
  }

  &__open-btn a {
    text-decoration: none;
  }
}

@media screen and (max-width: 480px) {

  .app__open-btn {
    margin-top: 10px;
  }

  .app__logo {
    width: 96px;
    height: 96px;
    border-radius: 13px;
  }

}

</style>
