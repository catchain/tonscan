<script>
import UiTabs from '~/components/UiTabs.vue';
import TabContractSources from '../Verifier/Verifier.vue'
import TabGetMethods from '../Verifier/VerifierGetMethods.vue'

export default {
    props: {
        isActive: Boolean,
        address: {
            type: String,
            required: true
        }
    },

    render ( h ) {
        return h(UiTabs, {
            class: 'card card--subtabs',
            props: {
                tabs: this.tabs,
                changeUrlHash: true
            }
        });
    },

    computed: {
        tabs () {
            const props = { address: this.address, isActive: this.isActive };
            const key = this.address; // keepalive key

            return [{
                key: 'contract_source',
                text: this.$t('contract.tab_source'),
                content: {
                    key,
                    props,
                    eager: true,
                    component: TabContractSources
                }
            }, {
                key: 'contract_get_methods',
                text: this.$t('contract.tab_get_methods'),
                content: { key, props, component: TabGetMethods }
            }];
        }
    }
}
</script>

<style lang="scss">
.card.card--subtabs {
    box-shadow: none;
    border: none;
    border-radius: 0;
    .card-title-tabs {
        padding: 10px 15px 0;
        display: flex;
        gap: 10px;
        border-bottom: none;
    }
    .card-title-tab {
        padding: 6px 12px;
        border-radius: 8px;
        background: var(--code-viewer-file-selector-background-color);
        border: 2px solid var(--code-viewer-file-selector-border-color);
        color: #bebebe;
        transition: .15s color ease;
        &:hover {
            box-shadow: none;
            &:not(.card-title-tab--active) {
                color: var(--body-text-color);
            }
        }
        &.card-title-tab--active {
            color: #fff;
            background: #2A384D;
            border-color: #4D96FF;
            box-shadow: none;
        }
    }
}
</style>
