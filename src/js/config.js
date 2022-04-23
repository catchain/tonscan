export const ADDRESS_REGEX = new RegExp(/[UEk0][Qf][\w\-]{46}/);

export const IS_TESTNET = process.env.TESTNET || false;
export const ADDRBOOK_LOCATION = 'https://tonscan.org/addrbook.json';
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
export const LITE_API_ENDPOINT = process.env.LITE_API_ENDPOINT || 'https://api.ton.cat/v2/explorer';
export const NFT_API_ENDPOINT = process.env.NFT_API_ENDPOINT || 'https://api.ton.cat/v2/explorer/nft';
