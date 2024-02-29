<template>
    <div class="app-card">
        <div class="app-card__icon-wrapper">
            <img class="app-card__icon" loading="lazy" decoding="async"
                v-show="!imageError"
                v-bind:class="{'app-card__load': imageLoading || isLoading}"
                v-bind:src="avatar"
                v-bind:alt="'App icon'"
                v-on:error="handleImageError"
                v-on:load="handleImageLoad">

            <div v-if="imageError" class="app-card__icon">
                <icon-broken-image class="broken-icon"/>
            </div>
        </div>

        <div class="app-card__content">
            <div class="app-card__heading">
                <div class="app-card__title">
                    <span v-if="!isLoading" v-text="title"/>
                    <t-skeleton-loader v-else
                        type="paragraph"
                        height="24px"
                        width="150px"
                        border-radius="5px"/>
                </div>

                <template v-if="!isLoading && badge">
                    <icon-verified v-if="badge === 'verified'" class="app-card__icon-verified"/>

                    <t-chip v-else class="app-card__chip"
                        v-bind:class="`app-card__badge--${badge}`">
                        {{badge}}
                    </t-chip>
                </template>
            </div>

            <div class="app-card__description">
                <p v-if="!isLoading" v-text="description"/>
                <t-skeleton-loader v-else
                    type="paragraph"
                    height="24px"
                    width="50%"
                    border-radius="5px"/>
            </div>
        </div>
    </div>
</template>

<script>
import { makeImageUrl } from '~/components/apps/index.js';
import IconVerified from '@img/icons/tonscan/apps/verified.svg?vue';
import IconBrokenImage from '@img/icons/tonscan/image-broken.svg?vue';

export default {
    name: 'AppsAppCard',

    props: {
        icon: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
        },
        descriptions: {
            type: Map,
            required: false,
            default: () => new Map(),
        },
        isAds: {
            type: Boolean,
            required: false,
            default: false,
        },
        isTrending: {
            type: Boolean,
            required: false,
            default: false,
        },
        isNew: {
            type: Boolean,
            required: false,
            default: false,
        },
        isVerified: {
            type: Boolean,
            required: false,
            default: false,
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            // First is foremost
            badgePriority: ['isAds', 'isTrending', 'isNew', 'isVerified'],
            badge: null,
            imageError: false,
            imageLoading: true,
        };
    },

    computed: {
        avatar() {
            return this.icon
                ? makeImageUrl(this.icon, {
                    width: 140,
                    height: 140,
                    resizingType: 'fill',
                })
                : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>';
        },

        description() {
            return this.descriptions.get(this.$i18n.locale);
        },
    },

    beforeMount() {
        this.setPriorityBadge();
    },

    methods: {
        setPriorityBadge() {
            const mostImportantTrait = this.badgePriority.find(appTrait => this.$props[appTrait] === true);

            const classes = {
                isAds: 'ad',
                isTrending: 'hot',
                isNew: 'new',
                isVerified: 'verified',
            };

            this.badge = classes[mostImportantTrait];
        },

        handleImageError() {
            this.imageError = false;
            this.imageLoading = false;
        },

        handleImageLoad() {
            this.imageLoading = false;
        },
    },

    components: {
        IconVerified,
        IconBrokenImage,
    },
};
</script>

<style lang="scss" scoped>

$app-card-min-height: 85px;
$app-card-border-radius: 12px;
$app-card-width: $app-card-min-height;
$app-card-icon-width: $app-card-min-height;
$app-card-icon-height: $app-card-min-height;

.app-card {
    display: flex;
    border-radius: $app-card-border-radius;
    border: 1px solid var(--card-border-color);
    background: var(--card-background);
    cursor: pointer;
    min-height: $app-card-min-height;
    z-index: 1;

    &__title {
        color: var(--body-text-color);
        font-weight: 500;
    }

    &__icon {
        border-radius: 12px;
        width: $app-card-icon-width;
        height: $app-card-icon-height;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0;

        .broken-icon {
            color: #959a9e;
            width: 75%;
            height: 75%;
        }
    }

    &__load {
        background: var(--skeleton-loader-background);
    }

    &__icon-wrapper {
        width: $app-card-width;
        flex-shrink: 0;
    }

    &__heading {
        display: flex;
        align-items: center;
    }

    &__content {
        padding: 10px 16px 10px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    &__description {
        margin-top: 6px;
        font-weight: 400;
        font-size: 14px;
        width: 100%;
        line-height: 20px;

        & p {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: var(--app-card-description);
            margin: 0;
            // width: 95%;
            // display: block;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // -webkit-line-clamp: 1;
        }
    }

    &__chip {
        margin-left: 6px;
        margin-top: -1px;
    }

    &__icon-verified {
        margin-left: 6px;
        color: var(--app-icon-verified-color);
        transform: translateY(-1px);
        width: 16px;
        height: 16px;
    }

    &__badge {
        text-transform: uppercase;

        &--hot {
            background: rgba(223, 137, 80, 0.24);
            color: rgba(223, 137, 80);
        }

        &--new {
            background: var(--app-card-badge-new-background);
            color: #54B893;
        }

        &--ad {
            // Ad chip will be in future
        }
    }
}

@media screen and (max-width: 480px) {

    $app-card-border-radius-small-screen: 13px;

    .app-card {
        min-height: 96px;

        &__icon {
            width: 64px;
            height: 64px;
            display: flex;
            border-radius: $app-card-border-radius-small-screen;
        }

        &__icon-wrapper {
            padding: 16px 0 16px 16px;
            width: auto;
        }

        &__content {
            //
        }
    }

    .apps-list {
        &__card {
            border-radius: 0;
            border-right: 0;
            border-left: 0;
        }

    }
}
</style>
