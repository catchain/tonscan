export const ADDRESS_REGEX = new RegExp(/[UEk0][Qf][\w\-]{46}/);
export const TX_REGEX_OLD = new RegExp(/^\d+[\$:](?<hash>[\w\+\-\/]{43}\=)[\$:][\w\+\-\/]+$/, 'i');

export const IS_TESTNET = process.env.TESTNET || false;
export const ADDRBOOK_LOCATION = process.env.ADDRBOOK_LOCATION || 'https://catchain.github.io/tonscan/src/addrbook.json';
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
export const DEV_EXPLORER_ADDRESS = process.env.DEV_EXPLORER_ADDRESS || 'https://explorer.toncoin.org';
// Todo: This is not actually an endpoint for the TonCenter API, const must be renamed
export const TONCENTER_API_ENDPOINT = process.env.TONCENTER_API_ENDPOINT || 'https://api.ton.cat/v2/explorer';
export const TONCENTER_API_JSON_RPC_ENDPOINT = process.env.TONCENTER_API_JSON_RPC_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC';
export const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY;
export const TONCENTER_INDEX_API_ENDPOINT = process.env.TONCENTER_INDEX_API_ENDPOINT || 'https://toncenter.com/api/index';
export const TONCENTER_INDEX_API_KEY = process.env.TONCENTER_INDEX_API_KEY || TONCENTER_API_KEY;
export const EXTENDER_CONTRACTS_API_ENDPOINT = process.env.EXTENDER_CONTRACTS_API_ENDPOINT || 'https://api.ton.cat/v2/explorer/nft';
export const GETGEMS_GRAPHQL_ENDPOINT = process.env.GETGEMS_GRAPHQL_ENDPOINT || 'https://api.getgems.io/graphql';
export const TONAPI_ENDPOINT = process.env.TONAPI_ENDPOINT || 'https://tonapi.io/v2';
export const TONAPI_KEY = process.env.TONAPI_KEY;

export const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY;
export const TYPESENSE_API_ENDPOINT = process.env.TYPESENSE_API_ENDPOINT;
