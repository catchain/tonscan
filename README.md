# TON Blockchain Explorer
An open source address, block and transaction explorer for [TON Blockchain](https://ton.org).


### See it in action
- Mainnet: https://tonscan.org
- Testnet: https://testnet.tonscan.org


## Contributing
If you'd like to add your address to our address book, you cat do it here: [catchain/address-book](https://github.com/catchain/address-book). Please note that addresses from address book is not used in search. If you'd like to add your address into the search, please leave a message [here](https://t.me/faqbot).

If you'd like to submit a pull request, please run `npm run lint` and check for the errors before pushing. We also highly recommend opening an issue before doing anything, because this repository is a mirror and is not always up to date with the actual code base.


## Building
Before building the project you should fill the environment variables in `.env` (or `.env.testnet`) file. You may refer to `.env.example` file for available variables.

All variables are optional, but we recommend filling at least `TONCENTER_API_KEY` ([docs](https://toncenter.com/)) and `TONAPI_KEY` ([details](https://tonapi.io/)).

`TYPESENSE_API_KEY` is used for real-time search. You may either use your own [typesense](https://typesense.org) server (in that case you should also  change the `TYPESENSE_API_ENDPOINT` variable), or use our guest key. To obtain guest key, please leave a message [here](https://t.me/faqbot).

Then run:

```bash
npm install && npm run prod
```

**For testnet:**

```bash
npm install && npm run prod_testnet
```


## Developing
```bash
npm run serve
```
To change host and port of the local server, change the `APP_DEV_SERVER_HOST` and `APP_DEV_SERVER_PORT` environment variables either in `.env` file or in command line. For example:
```bash
APP_DEV_SERVER_HOST=0.0.0.0 APP_DEV_SERVER_PORT=8080 npm run serve
```


## Using
The result of the build is static files in `dist` folder. To start using tonscan, you may:

- Upload the `dist` folder to your web server (see example config below)
- Upload `build.zip` to [Cloudflare Pages](https://pages.cloudflare.com)
- Use any static file hosting, e. g. [Firebase](https://firebase.google.com)


### Example nginx config:
```nginx
server {
    server_name tonscan.test;
    root /path/to/tonscan/dist;
    index index.html;

    location / {
        try_files $uri $uri/ @rewrites;
    }

    location @rewrites {
        rewrite ^(.+)$ /index.html last;
    }
}
```
