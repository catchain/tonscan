<template>
    <component v-once class="address-link ui-looong"
        v-on:click.native.stop
        v-text="address"
        v-bind:is="component"
        v-bind:class="{ clickable: !isDisabled, muted: !address }"
        v-bind:to="routerParams"
        v-bind:data-loopa="name.substr(0, 40)"
        v-bind:data-poopa="name.substr(40)"/>
</template>

<script>
export default {
    props: {
        address: {
            required: false,
        },

        // address contract type (pool, nft, etc):
        type: String,

        // ton or t.me domain:
        alias: String,

        // Whether the address is clickable:
        disabled: {
            type: Boolean,
            default: false,
        },

        // Whether to show human readable name:
        hideName: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        isDisabled() {
            return this.disabled || !this.address;
        },

        component() {
            return this.isDisabled ? 'span' : 'ui-link';
        },

        routerParams() {
            switch (this.type) {
                case 'nominator_pool':
                    return {
                        name: 'nominator',
                        params: { address: this.address },
                    };
                    break;

                default:
                    return {
                        name: 'address',
                        params: { address: this.address },
                    };
                    break;
            }
        },

        name() {
            if (!this.address) {
                return 'empty';
            }

            if (this.hideName) {
                return this.address;
            }

            const addressBookName = this.$store.getters.getAddressName(this.address);

            // address book returns full address if there are no meta records for that address:
            if (addressBookName !== this.address) {
                return addressBookName;
            }

            // limiting alias max length to fit the table (TODO):
            const hasValidAlias = this.alias && this.alias.length <= 36;

            return hasValidAlias
                ? this.alias
                : this.address;
        },
    },
};
</script>

<style lang="scss">
.ui-looong {
    white-space: nowrap;
    font-feature-settings: 'tnum';
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    max-width: 100%;
    min-width: 0;
    font-size: 0;
    &::before, &::after {
        font-size: 14px;
    }
    &::before {
        flex-grow: 0;
        content: attr(data-loopa);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    &::after {
        flex-shrink: 0;
        content: attr(data-poopa);
    }
}

.address-link {
    text-decoration: none;
    border-bottom: 1px solid transparent;
    margin-bottom: -1px;

    // direct disabled child of <router-link> or <a> = clickable
    &.clickable, a > & {
        color: var(--blue-bright);
        &:hover {
            border-bottom-color: currentColor;
        }
    }

    &.muted {
        opacity: .65;
        pointer-events: none;
    }

    &:hover {
        text-decoration: none;
    }
}
</style>
