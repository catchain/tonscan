<template>
    <div class="verifier-admonition">
        <component v-bind:is="icon" class="verifier-admonition__icon" v-bind:class="{
            'skeleton': isLoading,
            'verifier-admonition__icon--verified': isVerified,
        }"/>

        <div class="verifier-admonition__right">
            <h2 class="verifier-admonition__title">
                <span v-if="isLoading" class="skeleton skeleton--inline">Loading verification</span>
                <template v-else-if="isVerified">
                    {{$t('address.contract.admonition.verified_title')}}
                </template>
                <template v-else-if="!isActive">
                    {{$t('address.contract.admonition.inactive_title')}}
                </template>
                <template v-else>
                    {{$t('address.contract.admonition.unverified_title')}}
                </template>
            </h2>

            <div class="verifier-admonition__text">
                <span v-if="isLoading" class="skeleton">This is some descriptive text</span>

                <template v-else-if="!isActive">
                    {{$t('address.contract.admonition.inactive_text')}}
                </template>

                <i18n v-else v-bind:path="isVerified
                    ? 'address.contract.admonition.verified_text'
                    : 'address.contract.admonition.unverified_text'">
                    <template v-slot:verifier>
                        <a rel="noreferrer nofollow" target="_blank"
                           v-bind:href="`https://verifier.ton.org/${contractAddress}`"
                           v-text="$t('address.contract.admonition.verifier_link_text')"/>
                    </template>
                </i18n>
            </div>

            <div v-if="showMeta" class="verifier-admonition-meta">
                <span class="verifier-admonition-meta__label">
                    <span v-if="compilerName === undefined" class="skeleton">func 0.2.0</span>

                    <template v-else>
                        <icon-compiler class="verifier-admonition-meta__label__icon"/>
                        {{compilerName}} {{compilerVersion}}
                    </template>
                </span>

                <span class="verifier-admonition-meta__label">
                    <span v-if="compilerCmd === undefined" class="skeleton">func -o output.fif main.fc</span>

                    <template v-else>
                        <icon-cmd class="verifier-admonition-meta__label__icon"/>
                        <ui-copy-button hide-icon v-bind:copy="compilerCmd">
                            {{compilerCmd}}
                        </ui-copy-button>
                    </template>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import IconLoopa from '@primer/octicons/build/svg/codescan-checkmark-24.svg?inline';
import IconNotVerified from '@primer/octicons/build/svg/unverified-24.svg?inline';
import IconInactiveAddress from '@primer/octicons/build/svg/skip-24.svg?inline';
import IconCompiler from '@primer/octicons/build/svg/codespaces-16.svg?inline';
import IconCmd from '@primer/octicons/build/svg/terminal-16.svg?inline';

export default {
    props: {
        contractAddress: String,
        compilerName: [String, null],
        compilerVersion: String,
        compilerCmd: String,
        isVerified: Boolean,
        isActive: Boolean,
    },

    computed: {
        icon() {
            if (this.isActive === false) {
                return IconInactiveAddress;
            } else if (this.isVerified) {
                return IconLoopa;
            } else {
                return IconNotVerified;
            }
        },

        isLoading() {
            return this.isVerified === undefined || this.isActive === undefined;
        },

        showMeta() {
            return this.isLoading || (this.isVerified === true && this.compilerName !== null);
        },
    },

    components: {
        IconCompiler, IconCmd,
    },
};
</script>

<style lang="scss">
.verifier-admonition {
    background: var(--code-viewer-file-selector-background-color);
    display: flex;
    padding: 12px;
    align-items: flex-start;
    border: 1px solid var(--code-viewer-file-selector-border-color);
    border-radius: 8px;
    margin: 16px 12px 14px 12px;
    &__icon {
        fill: #888;
        width: 36px;
        height: 36px;
        padding: 4px 0 0 4px;
        flex-shrink: 0;
        &--verified {
            fill: var(--green-bright);
        }
    }
    &__right {
        padding-left: 14px;
    }
    &__title {
        font-weight: 500;
        font-size: 16px;
        margin: 0 0 6px 0;
        padding: 0;
    }
    &__text {
        line-height: 1.5;
        hyphens: auto;
    }
}
.verifier-admonition-meta {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: 4px;
    &__label {
        display: flex;
        align-items: center;
        margin-right: 24px;
        font-family: 'Ubuntu Mono', monospace;
        opacity: .85;
        line-height: 1.4em;
        margin-top: 12px;
        &__icon {
            margin-top: 0.2em; // (1.4em - 1em) / 2
            flex-shrink: 0;
            margin-right: 6px;
            opacity: .6;
            width: 16px;
            height: 16px;
            fill: currentColor;
            align-self: flex-start;
        }
    }
}

@media all and (max-width: 600px) {
    .verifier-admonition {
        &__icon {
            display: none !important;
        }
        &__right {
            padding-left: 0;
        }
        &__title {
            font-size: 18px;
            margin-bottom: 12px;
        }
    }
}
</style>
