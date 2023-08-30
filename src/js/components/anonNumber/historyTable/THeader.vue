<template>
  <thead>
    <tr>
        <th v-pre width="40"></th>

        <th width="100">
            <div class="tx-table__cell"
                v-text="$t('address.history_table.time')"/>
        </th>

        <th>
            <div class="tx-table__cell tx-table__cell--align-right"
                v-text="$t('address.history_table.from')"/>
        </th>

        <th>
            <div class="tx-table__cell"
                v-text="$t('address.history_table.to')"/>
        </th>

        <th>
            <div class="tx-table__cell tx-table__cell--align-right" style="padding-right: 26px;"
                v-text="$t('address.history_table.type')"/>
        </th>

        <th>
            <div class="tx-table__cell tx-table__cell--align-right" style="padding-right: 26px;"
                v-text="$t('address.history_table.price')"/>
        </th>

        <th v-pre width="40">
            <div class="tx-table__cell"></div>
        </th>
    </tr>
  </thead>
</template>

<script>