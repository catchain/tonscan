import { Address, TonClient } from 'ton';
import { TONCENTER_API_JSON_RPC_ENDPOINT, TONCENTER_API_KEY } from '~/config.js';

const client = new TonClient({
    endpoint: TONCENTER_API_JSON_RPC_ENDPOINT,
    apiKey: TONCENTER_API_KEY
});

export const runGetMethod = async function ( address, method, args ) {
    // todo: need builder for args

    return await client.runMethod(
        Address.parse(address),
        method,
    );
}
