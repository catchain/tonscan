import { ADDRESS_REGEX } from '~/config.js';
import { detectAddress } from '~/api.js';

export async function matchAddress(input) {
    // The shortest possible address length is 48 symbols:
    if (input.length < 48) {
        return undefined;
    }

    const matches = ADDRESS_REGEX.exec(input.replace(/\+/g, '-').replace(/\//g, '_'));

    if (matches) {
        return matches[0];
    }

    try {
        const forms = await detectAddress(input);

        // Keeping the requested bounce type:
        const key = forms.given_type.endsWith('non_bounceable')
            ? 'non_bounceable'
            : 'bounceable';

        return forms[key].b64url;

    } catch (e) {
        console.error(e);
    }

    return undefined;
};
