<style lang="scss">
.cycle-step-status {
    color: var(--green-bright);
}
</style>

<template>
    <div class="card">
        <div class="card-title" style="border: none; padding-bottom: 8px;">
            <i18n path="stats.validation_status" />
        </div>

        <table class="validation-status-table">
            <tr>
                <th>
                    {{ $t('stats.election_id') }}
                </th>
                <th>
                    {{ $t('stats.round_started') }}
                </th>
                <th>
                    {{ $t('stats.election') }}
                </th>
                <th>
                    {{ $t('stats.delay') }}
                </th>
                <th>
                    {{ $t('stats.validation') }}
                </th>
                <th>
                    {{ $t('stats.hold') }}
                </th>
                <th>
                    {{ $t('stats.next_round') }}
                </th>
            </tr>
            <tr v-if="cycleStart == 0 || cycleEnd == 0">
                <td v-for="i in 7">
                    <div class="skeleton" style="width: 70%; margin-bottom: 0;">22 июня в 07:33</div>
                </td>
            </tr>
            <tr v-else>
                <td>
                    {{ cycleStart }}
                </td>
                <td>
                    {{ round_start }}
                </td>
                <td>
                    <span class="cycle-step-status">Done</span>
                </td>
                <td>
                    <span class="cycle-step-status">Done</span>
                </td>
                <td>
                    <span class="cycle-step-status">Active</span>
                </td>
                <td>
                    {{ hold_end }}
                </td>
                <td>
                    {{ next_round }}
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
    data() {
        return {
            round_start: "",
            next_round: "",
            hold_end: "",
            constants: {
                validators_elected_for: 65536,
                elections_start_before: 32768,
                elections_end_before: 8192,
                stake_held_for: 32768
            }
        };
    },
    beforeUpdate() {
        // Formatted round start
        const round_start_timestamp = this.cycleStart - this.constants.elections_start_before;
        this.round_start = this.formatDate((round_start_timestamp) * 1000);
        // Formatted round end
        this.next_round = this.formatDate((this.cycleEnd) * 1000);
        // Formatted hold end
        const hold_end_timestamp = this.cycleEnd + this.constants.stake_held_for;
        this.hold_end = this.formatDate((hold_end_timestamp) * 1000);
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
        },
        isLater(timestamp) {
            // Function returns true if timestamp parameter is greater than time right now
            const current_timestamp = Math.floor(Date.now() / 1000);
            console.log(`${current_timestamp} : ${timestamp}`);
            return timestamp > current_timestamp;
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
        padding: 3px 0;
    }

    td {
        padding: 3px 0;
    }
}
</style>