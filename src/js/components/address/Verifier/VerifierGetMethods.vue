<template>
    <section class="verifier-sources verifier-sources--getMethods">
        <aside class="verifier-sources__files">
            <div class="verifier-sources__files__elevator">
                <ul class="file-list">
                    <template v-if="getMethods === undefined">
                        <li class="file-list__file">
                            <span class="skeleton">{{ $t('contract.arbitary_method') }}</span>
                        </li>
                    </template>

                    <template v-else>
                        <li v-for="method in getMethods"
                            v-bind:key="method.name"
                            class="file-list__file file-list__file--method"
                            @click="selectMethod(method)"
                            v-bind:class="{
                                'file-list__file--active': isMethodSelected(method),
                            }"
                        >
                            <icon-cmd class="file-list__file__svg" />
                            {{ method }}
                        </li>
                    </template>
                </ul>
            </div>
        </aside>
        <div class="verifier-sources__code verifier-method__call">
            <div class="verifier-method__inputs">
                <div class="verifier-method__input">
                    <div class="card-title">{{ $t('contract.call_method') }}</div>
                    <div class="card-row">
                        <div class="input-container--methodName">
                            <input class="input-material input--methodName"
                                   type="text"
                                   v-model="selectedMethod"
                                   v-bind:placeholder="$t('contract.enter_method_name')"
                            />
                            <icon-close v-show="canReset"
                                class="icon-reset"
                                @click="resetMethod" />
                        </div>
                    </div>
                    <div v-for="(argument, ind) in contractArguments"
                         v-bind:key="ind"
                         class="card-row card-row--items-center card-row--forceRow"
                    >
                        <div class="input-group input-group--full">
                            <ui-select v-model="argument.type"
                                :options="argumentTypeOptions" />

                            <input class="input-material input--argumentValue"
                                   v-bind:placeholder="argument.type"
                                   v-bind:disabled="!isArgumentFeelable(argument)"
                            />
                        </div>
                        <div class="verifier-method__argument-remove" @click="removeArgument(ind)">
                            <icon-close />
                        </div>
                    </div>
                    <div class="card-row card-row--controls card-row--forceRow">
                        <button
                            class="btn-material btn-material--blue"
                            v-bind:class="{
                                'btn-material--disabled': !canExecute || isExecuting,
                                'btn-material--loading': isExecuting
                            }"
                            @click="execute"
                        >
                            <svg v-show="isExecuting" class="executing__loader" xmlns="http://www.w3.org/2000/svg">
                                <circle v-pre cx="9" cy="9" fill="none" stroke="currentColor" stroke-width="2" r="8" stroke-dasharray="34 12">
                                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 9 9;360 9 9" keyTimes="0;1"/>
                                </circle>
                            </svg>
                            {{ $t('contract.execute') }}
                        </button>
                        <button
                            class="btn-material btn-material--grey"
                            v-bind:class="{
                                'btn-material--disabled': isExecuting
                            }"
                            @click="addArgument"
                        >
                            <icon-plus class="icon" />
                            {{ $t('contract.add_argument') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="verifier-method__result">
            </div>
        </div>
    </section>
</template>

<script>
import VerifierFileList from './VerifierFileList.vue'
import { getAccount } from '~/api/tonapi.js'
import { runGetMethod } from '~/ton.js'
import IconCmd from '@primer/octicons/build/svg/terminal-16.svg?inline';
import IconPlus from '@primer/octicons/build/svg/plus-16.svg?inline';
import IconClose from  '@img/icons/material-duotone/close.svg?inline';
import UiSelect from '~/components/UiSelect.vue'

export default {
    props: {
        address: {
            type: String,
            required: true
        }
    },

    computed: {
        canExecute () {
            return this.selectedMethod !== ''
        },

        canReset () {
            return this.selectedMethod !== ''
                && ! this.isExecuting
        },

        argumentTypeOptions () {
            return this.argumentTypes.map(type => ({
                label: type,
                value: type
            }))
        }
    },

    data () {
        return {
            isLoading: true,
            isExecuting: false,
            getMethods: undefined,
            selectedMethod: '',
            contractArguments: [],
            argumentTypes: [
                'NaN',
                'Null',
                'Number',
                'Slice',
                'Cell',
            ]
        }
    },

    created () {
        this.loadData()
    },

    methods: {
        loadData () {
            getAccount(this.address).then(account => {
                this.isLoading = false

                this.getMethods = [
                    this.$t('contract.arbitrary_method'),
                    ...account.get_methods
                ]
            })
        },

        selectMethod ( method ) {
            if ( method === this.$t('contract.arbitrary_method') ) {
                this.selectedMethod = ''
                return;
            }

            this.selectedMethod = method

            this.contractArguments = []
        },

        isMethodSelected ( method ) {
            if (method === this.selectedMethod) {
                return true;
            }

            const isArbitraryMethod = method === this.$t('contract.arbitrary_method')

            return isArbitraryMethod
                && ! this.getMethods?.includes(this.selectedMethod);
        },

        addArgument () {
            this.contractArguments.push({
                type: 'NaN',
                value: ''
            })
        },

        removeArgument ( ind ) {
            this.contractArguments.splice(ind, 1)
        },

        isArgumentFeelable ( argument ) {
            return !['NaN', 'Null'].includes(argument.type);
        },

        execute () {
            if (! this.canExecute) {
                return;
            }

            this.isExecuting = true

            runGetMethod(this.address, this.selectedMethod, this.contractArguments)
                .then(response => {
                    // TODO: show response
                })
                .finally(() => {
                    this.isExecuting = false
                })
        },

        resetMethod () {
            this.selectedMethod = ''
            this.contractArguments = []
        },

    },

    components: { UiSelect, VerifierFileList, IconCmd, IconPlus, IconClose }
}
</script>

<style scoped lang="scss">
.verifier-sources {
    &--getMethods {
        margin-top: 16px;
    }
}
.verifier-method {
    &__call {
        position: relative;
        background: var(--code-viewer-background);
        border: 1px solid var(--code-viewer-border-color);
        border-radius: 11px;
        .input--methodName {
            min-width: 14rem;
        }
    }
    &__argument-remove {
        cursor: pointer;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            fill: var(--body-muted-text-color);
            width: 24px;
            height: 24px;
        }
    }
}
.card-row--controls {
    display: flex;
    gap: 10px;
}
.card-row--forceRow {
    @media screen and (max-width: 480px) {
        flex-direction: row;
    }
}
.card-row--items-center {
    display: flex;
    align-items: center;
}
.input-container--methodName {
    position: relative;
    .input--methodName {
        padding-right: 40px;
    }
    .icon-reset {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        fill: var(--body-muted-text-color);
        width: 24px;
        height: 24px;
    }
}
.input--argumentValue {
    flex: 1 1;
    width: 100%;
}
.executing__loader {
    width: 18px;
    height: 18px;
    z-index: 900;
    margin-right: 8px;
}
</style>
