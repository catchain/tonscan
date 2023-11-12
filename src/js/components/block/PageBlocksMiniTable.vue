<template>
    <section>
        <div class="tx-history-wrap desktop-table">
            <table class="last-blocks-mini-table">
                <thead>
                    <tr>
                        <th v-text="$t('blocks.block')"/>
                        <th v-text="$t('blocks.transactions')"/>
                        <th v-text="$t('common.time')"/>
                    </tr>
                </thead>

                <tbody v-if="blocks.length === 0">
                    <tr v-for="i in 15">
                        <td><span class="skeleton">123456789</span></td>
                        <td><span class="skeleton">3</span></td>
                        <td><span class="skeleton">21:17:22</span></td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr class="new-row-animation"
                        v-for="block in blocks"
                        v-bind:key="`${block.workchain}:${block.seqno}`">
                        <td>
                            <ui-link v-text="block.seqno" v-bind:to="{
                                name: 'block',
                                params: { ...block },
                            }"/>
                        </td>
                        <td v-text="block.tx_count"/>
                        <td v-text="getTime(block.gen_utime)"/>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="show-more-container" v-if="blocks.length > 0">
            <ui-link v-bind:to="{
                name: 'blocks',
                query: { wc: blocks[0].workchain },
            }">
                <button class="show-more-container__button">
                    {{ $t('common.show_more') }}
                    <svg v-pre xmlns="http://www.w3.org/2000/svg" fill="none"
                        style="margin-left: 4px; width: 16px; height:12px; transform: scale(.8);">
                        <path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m1.5 4.75 5.5 5.5 5.5-5.5"/>
                    </svg>
                </button>
            </ui-link>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        blocks: {
            type: Array,
            default: undefined,
        },
    },

    methods: {
        getTime(timestamp) {
            return new Date(timestamp * 1000).toLocaleTimeString(this.$i18n.locale);
        },
    },
};
</script>

<style lang="scss">
.last-blocks-mini-table {
    overflow: hidden;
    border-collapse: collapse;
    width: 100%;

    td, th {
        white-space: nowrap;
        overflow: hidden;
        padding: 10px 16px;
        border-top: 1px solid var(--card-border-color);
        font-size: 14px;
        max-width: 250px;
        text-align: center;
        &:first-child {
            text-align: left;
        }
    }

    th {
        font-weight: 500;
        border: none;
    }

    thead {
        background-color: var(--tx-table-thead-alt-background);
        color: #6c757e;
        border: none;
    }
}
</style>
