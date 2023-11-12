import axios from 'axios';
import { TONCENTER_ELECTIONS_API_ENDPOINT } from '~/config.js';
import { MULTIPLIER } from '~/helpers.js';

const http = axios.create({
    baseURL: TONCENTER_ELECTIONS_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * This function returns information about validators:
 * validator count; when validation cycle started and ended; list of validators.
 *
 * @param  {Number}  options.offset
 * @param  {Number}  options.limit
 * @param  {Boolean} options.withValidators  Whether to return validator list
 * @return {Promise<Array>}
 */
export const getValidatorsStats = async function({ offset, limit, withValidators } = {}) {
    const { data: cycles } = await http.get('getValidationCycles', {
        params: {
            offset, limit,
            return_participants: withValidators === true,
        },
    });

    return cycles
        .slice(0, limit)
        .map((data) => Object.freeze({
            cycle_id: data.cycle_id,
            validator_count: data.cycle_info.total_participants,
            validation_cycle_start: data.cycle_info.utime_since,
            validation_cycle_end: data.cycle_info.utime_until,
            config16: data.config16,
            config17: data.config17,
            validators: withValidators
                ? data.cycle_info.validators
                : undefined,
        }));
};
