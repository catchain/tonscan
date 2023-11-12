/**
 * All process.env.XXX variables are replaced by webpack to their exact values if they exist in .env.
 *
 * Variables that don't exist won't be replaced, and will try to access the global process.env object. Since process.env doesn't
 * exist in browser environment, we can create a trap and notify developer to pay attention to that variables.
 *
 * It should be created in window scope, otherwise webpack will see it as local variable and won't replace process.env.XXX:
 */
window.process = {
    env: new Proxy({}, {
        get(_, prop) {
            console.warn(`${prop} variable is not defined in .env`);
            return undefined;
        },
    }),
};

export const ADDRESS_REGEX = new RegExp(/[UEk0][Qf][\w\-]{46}/);
export const TX_REGEX_OLD = new RegExp(/^\d+[\$:](?<hash>[\w\+\-\/]{43}\=)[\$:][\w\+\-\/]+$/, 'i');

export const APP_MAIN_LOCALE = process.env.APP_MAIN_LOCALE || 'en';
export const APP_MAIN_THEME = 'auto';
export const APP_MAIN_EXCHANGE_CURRENCY = 'usd';

export const IS_TESTNET = process.env.TESTNET || false;
export const ADDRBOOK_LOCATION = process.env.ADDRBOOK_LOCATION || 'https://catchain.github.io/tonscan/src/addrbook.json';
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
export const DEV_EXPLORER_ADDRESS = process.env.DEV_EXPLORER_ADDRESS || 'https://explorer.toncoin.org';
export const TONCENTER_API_ENDPOINT = process.env.TONCENTER_API_ENDPOINT || 'https://api.ton.cat/v2/explorer';
export const TONCENTER_V2_API_ENDPOINT = process.env.TONCENTER_V2_API_ENDPOINT || 'https://api.toncenter.com/index/';
export const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY;
export const TONCENTER_INDEX_API_ENDPOINT = process.env.TONCENTER_INDEX_API_ENDPOINT || 'https://toncenter.com/api/index';
export const TONCENTER_INDEX_API_KEY = process.env.TONCENTER_INDEX_API_KEY || TONCENTER_API_KEY;
export const EXTENDER_CONTRACTS_API_ENDPOINT = process.env.EXTENDER_CONTRACTS_API_ENDPOINT || 'https://api.ton.cat/v2/explorer/nft';
export const TONCENTER_ELECTIONS_API_ENDPOINT = process.env.TONCENTER_ELECTIONS_API_ENDPOINT || 'https://elections.toncenter.com';
export const GETGEMS_GRAPHQL_ENDPOINT = process.env.GETGEMS_GRAPHQL_ENDPOINT || 'https://api.getgems.io/graphql';
export const TONAPI_ENDPOINT = process.env.TONAPI_ENDPOINT || 'https://tonapi.io/v1';
export const TONAPI_KEY = process.env.TONAPI_KEY;
export const TONTECH_API_ENDPOINT = process.env.TONTECH_API_ENDPOINT || 'https://api.ton.cat/tontech';

export const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY;
export const TYPESENSE_API_ENDPOINT = process.env.TYPESENSE_API_ENDPOINT;
