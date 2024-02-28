<template>
    <div style="margin: 20px 0;">
        <div class="app__description">
            <div class="app__description-container" ref="descriptionContainer"
                v-show="!loading"
                v-html="this.description"
                v-on:click="expandDescription"
                v-bind:class="{
                    'app__description-container--expanded': descriptionExpanded,
                    'app__description-container--blur': !descriptionExpanded && canExpand,
                }"/>

            <t-skeleton-loader
                v-if="loading"
                type="rectangle"
                width="100%"
                height="115px"
                border-radius="10px"
                v-bind:class="{ 'app__description--loading': loading }"/>
        </div>

        <div class="app__description-expander"
            v-if="!descriptionExpanded && canExpand && !loading && this.description"
            v-on:click="expandDescription">
            {{$t('apps.app.show_more')}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppDescription',

    props: {
        description: {
            type: null,
        },

        loading: {
            type: Boolean,
            required: true,
        },
    },

    data() {
        return {
            descriptionExpanded: false,
            canExpand: false,
        };
    },

    watch: {
        loading(isLoading) {
            if (!isLoading) {
                this.$nextTick(() => this.recheckCollapser());
            }
        },

        description() {
            this.descriptionExpanded = false;
            this.$nextTick(() => this.recheckCollapser());
        },
    },

    methods: {
        expandDescription() {
            this.descriptionExpanded = true;
            this.canExpand = false;
        },

        recheckCollapser() {
            const { descriptionContainer } = this.$refs;

            if (descriptionContainer.scrollHeight > descriptionContainer.clientHeight) {
                this.canExpand = true;
            }
        },
    },
};
</script>

<style lang="scss">

$line-height: 24px;

.app__description {
    max-width: 580px;
    font-weight: 400;
    line-height: $line-height;
    color: var(--body-text-color);

    &--loading {
        width: 100%;
        min-height: 115px;
        margin-top: 24px;
    }

    &-container {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 8;
        display: -webkit-box;
        margin-bottom: -20px;
        overflow: hidden;
        position: relative;
        z-index: 800;

        &--blur::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 78px;
            background: linear-gradient(to top, var(--card-background) 20%, transparent);
            pointer-events: none; /* so the gradient doesn't block clickable elements */
        }

        &--expanded {
            display: block;
        }

        & p:first-child {
            margin-top: 0;
        }

        & p:last-child {
            margin-top: 0;
        }
    }

    &-expander {
        margin-top: -10px;
        margin-bottom: -10px;
        position: relative;
        font-weight: 500;
        color: var(--blue-bright);
        cursor: pointer;
        z-index: 900;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
