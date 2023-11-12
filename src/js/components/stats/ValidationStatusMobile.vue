<template>
    <div class="card">
        <div class="card-title" style="border: none; padding-bottom: 8px;">
            <i18n path="stats.validation_status" />
        </div>

        <table class="validation-status-table">
            <tr>
                <th>
                    {{ $t('stats.round_started') }}
                </th>
                <th>
                    {{ $t('stats.round_ends') }}
                </th>
                <th>
                    {{ $t('stats.election_id') }}
                </th>
            </tr>
            <tr v-if="cycleStart == 0 || cycleEnd == 0">
                <td>
                    <div class="skeleton" style="width: 70%; margin-bottom: 0;">22 июня в 07:33</div>
                </td>
                <td>
                    <span class="skeleton" style="width: 70%; margin-bottom: 0;">22 июня в 07:33</span>
                </td>
                <td>
                    <span class="skeleton" style="width: 70%; margin-bottom: 0;">1687441160</span>
                </td>
            </tr>
            <tr v-else>
                <td>
                    {{ formatDate(cycleStart * 1000) }}
                </td>
                <td>
                    {{ formatDate(cycleEnd * 1000) }}
                </td>
                <td>
                    {{ cycleStart }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

export default {
    props: {
        cycleStart: {
            type: Number,
            required: true,
        },
        cycleEnd: {
            type: Number,
            required: true,
        },
    },
    methods: {
        formatDate(timestamp) {
            const dateTime = new Intl.DateTimeFormat(this.$i18n.locale, {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23',
            });
            return dateTime.format(timestamp);
        }
    }
};
</script>

<style lang="scss">
.validation-status-table {
    padding: 0 16px 12px 16px;
    border-spacing: 0;

    th {
        text-align: left;
        font-weight: normal;
        opacity: .4;
        padding: 3px;
    }

    td {
        padding: 3px;
    }

    th:first-child,
    td:first-child {
        padding-left: 0
    }

    th:last-child,
    td:last-child {
        padding-right: 0
    }
}
</style>