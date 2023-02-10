# TON Blockchain Explorer

An open source address, block and transaction explorer for [TON Blockchain](https://ton.org).

### See it in action

- Mainnet: https://tonscan.org
- Testnet: https://testnet.tonscan.org


## Installation

```
git clone https://github.com/catchain/tonscan.git
cd tonscan
npm install
```

## Configuring

Before building you must fill the environment variables in `.env` (or `.env.testnet`) file.

Note that all variables must be present, even if you're not going to change them. If you'd like to use the default value, leave it empty (e.g. `ADDRBOOK_LOCATION=`).

```bash
cp .env.example .env
```

**For testnet:**

```bash
cp .env.example .env.testnet
```

### Available variables

| Key | Value |
| ---- | -------- |
| ADDRBOOK_LOCATION | URL of important addresses metadata in json format. [Example](https://catchain.github.io/tonscan/src/addrbook.json). |
| GETGEMS_GRAPHQL_ENDPOINT | Self-explanatory, default: `https://api.getgems.io/graphql` |
| DEV_EXPLORER_ADDRESS | Explorer with extended transaction info. Default: `explorer.toncoin.org` |
| TONCENTER_API_ENDPOINT | Self-explanatory, default: `https://toncenter.com/api/v2` |
| TONCENTER_API_KEY | **Required.** See [the official website](https://toncenter.com/) for more details. |
| TONCENTER_INDEX_API_ENDPOINT | Toncenter indexer API endpoint. |
| TONCENTER_INDEX_API_KEY | Self-explanatory. |
| TONAPI_ENDPOINT | Self-explanatory. |
| TONAPI_KEY | Self-explanatory. |
| EXTENDER_CONTRACTS_API_ENDPOINT | Contract extender API, default: `https://api.ton.cat/v2/contracts` |
| TYPESENSE_API_ENDPOINT | [Typesense](https://typesense.org/) real-time search engine endpoint. |
| TYPESENSE_API_KEY | Self-explanatory. |
| SENTRY_DSN | sentry.io DSN key, used for error monitoring |
| CLOUDFLARE_INSIGHTS_TOKEN | [Cloudflare Analytics](https://www.cloudflare.com/insights/) token |


## Building
```bash
npm run prod
```

**For testnet:**

```bash
npm run prod_testnet
```

## Using

The result of the build is static files in `dist` folder. To start using tonscan, you may:

- Upload the `dist` folder to your web server
- Upload `build.zip` to [Cloudflare Pages](https://pages.cloudflare.com)
- Use any static file hosting, e. g. [Firebase](https://firebase.google.com)

## Donations

EQAWpIzTMY69ClNr_rgb4t6Hw7vdmwnYwyW04WtMb4i9Kbzm
