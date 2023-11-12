<template functional>
    <tr>
        <td>
            <ui-link class="tx-table-cell-icon" v-bind:to="{ name: 'tx', params: {
                address: props.account,
                lt: props.lt,
                hash: props.hash,
            }}">
                <svg v-pre xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M7.665 9.301c-.155-.067-.338-.206-.549-.417a2.6 2.6 0 0 1 0-3.677l1.768-1.768a2.6 2.6 0 0 1 3.677 3.677l-1.167 1.167m-3.06-1.584c.156.067.339.206.55.417a2.6 2.6 0 0 1 0 3.677l-1.768 1.768A2.6 2.6 0 1 1 3.44 8.884l1.167-1.167" stroke="currentColor" stroke-linecap="round" stroke-width="1.3"/></svg>
            </ui-link>
        </td>
        <td>
            <div class="tx-table__cell tx-table__cell--align-center" v-text="props.seqno"/>
        </td>
        <td>
            <div class="tx-table__cell">
                <ui-address v-bind:address="props.account"/>
            </div>
        </td>
        <td>
            <div class="tx-table__cell" v-text="props.lt"/>
        </td>
        <td>
            <div class="tx-table__cell" v-text="props.hash"/>
        </td>
    </tr>
</template>

<script>
export default {
    props: {
        seqno: Number,
        hash: String,
        account: String,
        lt: String,
    },
};
</script>
