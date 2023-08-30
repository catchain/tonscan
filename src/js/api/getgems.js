import { GETGEMS_GRAPHQL_ENDPOINT } from '~/config.js';
import axios from 'axios';

const http = axios.create({
    baseURL: GETGEMS_GRAPHQL_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Method': 'POST',
    },
});

const GetUserItemsQuery = `
query NftItemConnection($ownerAddress: String!, $first: Int!, $after: String) {
  nftItemsByOwner(ownerAddress: $ownerAddress, first: $first, after: $after) {
    cursor
    items {
      id
      name
      address
      index
      kind
      image: content {
        type: __typename
        ... on NftContentImage {
          originalUrl
          thumb: image {
            sized(width: 480, height: 480)
          }
        }
        ... on NftContentLottie {
          preview: image {
            sized(width: 480, height: 480)
          }
        }
        ... on NftContentVideo {
          cover: preview(width: 480, height: 480)
        }
      }
      collection {
        address
        name
        isVerified
      }
      sale {
        ... on NftSaleFixPrice {
          fullPrice
        }
      }
    }
  }
}`;

const GetItemHistoryQuery = `
query historyNftItem($address: String!, $count: Int!, $cursor: String, $types: [HistoryType!]) {
  historyNftItem(address: $address, first: $count, after: $cursor, types: $types) {
    cursor
    items {
      ...nftHistoryItem
    }
  }
}

fragment nftHistoryItem on NftItemHistory {
  __typename
  time
  hash
  typeData {
    __typename
    ... on HistoryTypeMint {
      type
      __typename
    }
    ... on HistoryTypeTransfer {
      __typename
      type
      oldOwner
      newOwner
    }
    ... on HistoryTypeCancelSale {
      __typename
      type
      owner
      price
    }
    ... on HistoryTypeSold {
      __typename
      type
      oldOwner
      newOwner
      price
    }
    ... on HistoryTypePutUpForSale {
      __typename
      type
      owner
      price
    }
    ... on HistoryTypeCancelAuction {
      __typename
      type
      historyType
      owner
    }
    ... on HistoryTypePutUpForAuction {
      __typename
      type
      historyType
      owner
    }
  }
}`;

export const nftItemsByOwner = async function(owner, first = 24, after = undefined) {
    const { data: { data: { nftItemsByOwner }}} = await http.post(null, {
        query: GetUserItemsQuery,
        variables: {
            ownerAddress: owner,
            first, after,
        },
    });

    return nftItemsByOwner;
};

const historyMock = {
  "data": {
      "historyNftItem": {
          "cursor": null,
          "items": [
              {
                  "id": "64ec4ac5bd8ac07bc4edf2c0",
                  "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                  "time": 1693207227,
                  "createdAt": 1693207237,
                  "nft": {
                      "name": "непон дуров",
                      "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                      "content": {
                          "image": {
                              "sized": "https://i.getgems.io/-8YPEEARWOhwZp92DJr_MRw6CmczPBxfqSro8oxLJ5U/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9zaW5nbGUvNzhkNjAzMTA2NzllZmVjM18xODllYTFiNTY4Yg",
                              "__typename": "Image"
                          },
                          "__typename": "NftContentImage"
                      },
                      "__typename": "NftItem"
                  },
                  "collectionAddress": null,
                  "lt": "40478695000003",
                  "hash": "uu8cQV5h6JoaSpPmEBoXapYm7l/3BXoB5yusqh7/0N4=",
                  "typeData": {
                      "__typename": "HistoryTypeBurn",
                      "type": "burn",
                      "historyType": "Burn",
                      "oldOwner": "EQB20fJp5OMeLtsXmf4OxrnobADEoYxBjDQfI5fROEgS1Arg",
                      "oldOwnerUser": {
                          "id": "64d2445b064f4175fb8736c7",
                          "avatar": "https://i.getgems.io/eqw6VqqhoLrOsADn7zpHpGpeayzNOQFry5HDAlIuSko/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDIucG5n",
                          "name": "",
                          "domain": "meow",
                          "isBurn": false,
                          "__typename": "User"
                      },
                      "newOwner": "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                      "newOwnerUser": {
                          "id": "629f2e6a87a72413a3ec66c1",
                          "avatar": "https://i.getgems.io/jYs6K1Sc4KNMSkD9HDSXsKGlnMu4ICPQ6o6ffROa1fI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMzgucG5n",
                          "name": "Null Address",
                          "domain": null,
                          "isBurn": true,
                          "__typename": "User"
                      }
                  },
                  "__typename": "NftItemHistory"
              },
              {
                  "id": "64ddf860e8638dc3d2333127",
                  "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                  "time": 1692268630,
                  "createdAt": 1692268640,
                  "nft": {
                      "name": "непон дуров",
                      "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                      "content": {
                          "image": {
                              "sized": "https://i.getgems.io/-8YPEEARWOhwZp92DJr_MRw6CmczPBxfqSro8oxLJ5U/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9zaW5nbGUvNzhkNjAzMTA2NzllZmVjM18xODllYTFiNTY4Yg",
                              "__typename": "Image"
                          },
                          "__typename": "NftContentImage"
                      },
                      "__typename": "NftItem"
                  },
                  "collectionAddress": null,
                  "lt": "40189466000003",
                  "hash": "SHIW3D8O7G4kqIQz3uT1r7DoN73lJLRw6rgF+QTVwys=",
                  "typeData": {
                      "__typename": "HistoryTypeTransfer",
                      "type": "transfer",
                      "oldOwner": "EQB7t8cblaKT-vIMJRglhCE7k78uWa74kKeBzNAkh-1lv63j",
                      "newOwner": "EQB20fJp5OMeLtsXmf4OxrnobADEoYxBjDQfI5fROEgS1Arg",
                      "oldOwnerUser": {
                          "id": "64d77fc0e59e6c7dcf45927f",
                          "avatar": "https://i.getgems.io/BAr5q2NGaFq7NgGcGl8Ku9TZFaPF6qnbvGmY-obUJAQ/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjMucG5n",
                          "name": "",
                          "domain": "ruslan-zolotov",
                          "isBurn": false,
                          "__typename": "User"
                      },
                      "newOwnerUser": {
                          "id": "64d2445b064f4175fb8736c7",
                          "avatar": "https://i.getgems.io/eqw6VqqhoLrOsADn7zpHpGpeayzNOQFry5HDAlIuSko/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDIucG5n",
                          "name": "",
                          "domain": "meow",
                          "isBurn": false,
                          "__typename": "User"
                      }
                  },
                  "__typename": "NftItemHistory"
              },
              {
                  "id": "64d7948669c05ea6c0eddcb8",
                  "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                  "time": 1691849795,
                  "createdAt": 1691849862,
                  "nft": {
                      "name": "непон дуров",
                      "address": "EQB4JEJx2mh2Wk49oVlTQfy4Khl08ggzUMJe7YU7cfX2IEDj",
                      "content": {
                          "image": {
                              "sized": "https://i.getgems.io/-8YPEEARWOhwZp92DJr_MRw6CmczPBxfqSro8oxLJ5U/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9zaW5nbGUvNzhkNjAzMTA2NzllZmVjM18xODllYTFiNTY4Yg",
                              "__typename": "Image"
                          },
                          "__typename": "NftContentImage"
                      },
                      "__typename": "NftItem"
                  },
                  "collectionAddress": null,
                  "lt": "40059575000003",
                  "hash": "cQf7wrwXWNrUrf3odEAU++3S1F1kZG6/DrJCjiary3o=",
                  "typeData": {
                      "__typename": "HistoryTypeMint",
                      "type": "mint"
                  },
                  "__typename": "NftItemHistory"
              },
              {
                "id": "646cffbb67011edc92187637",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1684864943,
                "createdAt": 1684864955,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "37884706000007",
                "hash": "tm3YkUWP062ArN2FjB25S6F8c1rV3m+VbVpHHNQ7w5M=",
                "typeData": {
                    "__typename": "HistoryTypeSold",
                    "type": "sold",
                    "oldOwner": "EQDMtCf0QHGX0wdOArM8zb_UbjmToMqF-HwEbaiATaOk4HTL",
                    "newOwner": "EQDW2iusdLPuHNTcPsgEigrRFYHI28oPbCiVDzcD7Dtopgjd",
                    "oldOwnerUser": {
                        "id": "6469527adfaa8ee013b5a60a",
                        "avatar": "https://i.getgems.io/-eQJdMFYtaMUiILp0EhR5J-c63u1OHlivFVLQ-PdqnI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDUucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "newOwnerUser": {
                        "id": "6251e5ee6ba1fdd1d60ce654",
                        "avatar": "https://i.getgems.io/a94ijSFu7E0TfNDty8kVtebcdt0Hnun69lEmWz7XWJE/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvMTAtMTAtMjAyMi82MjUxZTVlZTZiYTFmZGQxZDYwY2U2NTQvNjM0NDk0MTJhNDZhMmQwNmE3NzEyNDg0LmpwZw",
                        "name": "DW//42",
                        "domain": "sendmecringe",
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "139000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "646cfc4967011edc9216cb8d",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1684864061,
                "createdAt": 1684864073,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "37884428000003",
                "hash": "rsbY2+TGk+KWr1K/xazB8hhXiHM+zAdKrMZZ7ipzbCc=",
                "typeData": {
                    "__typename": "HistoryTypePutUpForSale",
                    "type": "put-up-for-sale",
                    "owner": "EQDMtCf0QHGX0wdOArM8zb_UbjmToMqF-HwEbaiATaOk4HTL",
                    "ownerUser": {
                        "id": "6469527adfaa8ee013b5a60a",
                        "avatar": "https://i.getgems.io/-eQJdMFYtaMUiILp0EhR5J-c63u1OHlivFVLQ-PdqnI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDUucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "139000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "646cfbf167011edc9216ae5a",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1684863975,
                "createdAt": 1684863985,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "37884404000005",
                "hash": "Wi1jGEMdYbqOyZY86jhHUbj82zxXxfr7ZP+zN8YOfCQ=",
                "typeData": {
                    "__typename": "HistoryTypeCancelSale",
                    "type": "cancel-sale",
                    "owner": "EQDMtCf0QHGX0wdOArM8zb_UbjmToMqF-HwEbaiATaOk4HTL",
                    "price": "144000000000",
                    "ownerUser": {
                        "id": "6469527adfaa8ee013b5a60a",
                        "avatar": "https://i.getgems.io/-eQJdMFYtaMUiILp0EhR5J-c63u1OHlivFVLQ-PdqnI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDUucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    }
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "646b7a8167011edc92571e06",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1684765303,
                "createdAt": 1684765313,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "37853668000003",
                "hash": "UPNH0R56A3iX6B8iG7vYTG0noWto0Iua9DQMzxAZUBA=",
                "typeData": {
                    "__typename": "HistoryTypePutUpForSale",
                    "type": "put-up-for-sale",
                    "owner": "EQDMtCf0QHGX0wdOArM8zb_UbjmToMqF-HwEbaiATaOk4HTL",
                    "ownerUser": {
                        "id": "6469527adfaa8ee013b5a60a",
                        "avatar": "https://i.getgems.io/-eQJdMFYtaMUiILp0EhR5J-c63u1OHlivFVLQ-PdqnI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDUucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "144000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "646b79c867011edc9256a1f2",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1684765115,
                "createdAt": 1684765128,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "37853610000001",
                "hash": "truiXSZ8uPxYiu3y92YCvivKPrZHSGNslm6A9xkNa70=",
                "typeData": {
                    "__typename": "HistoryTypeSold",
                    "type": "sold",
                    "oldOwner": "EQAIsDyxz0ZNIJWw60UF5RQkcPVOu6Tl6uBdNuxHrWG6A3nG",
                    "newOwner": "EQDMtCf0QHGX0wdOArM8zb_UbjmToMqF-HwEbaiATaOk4HTL",
                    "oldOwnerUser": {
                        "id": "63c1c14b00f83fa0bdcc0929",
                        "avatar": "https://i.getgems.io/PWFH81ySLOFgqaGsenQbbQ67eKkQWozEl4_JjReU130/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjIucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "newOwnerUser": {
                        "id": "6469527adfaa8ee013b5a60a",
                        "avatar": "https://i.getgems.io/-eQJdMFYtaMUiILp0EhR5J-c63u1OHlivFVLQ-PdqnI/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDUucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "135000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "63bd9bcad7d3e13be54394d5",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1673370560,
                "createdAt": 1673370570,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "34365314000001",
                "hash": "Ba84PuyKxibS62iNL53JNUrdhCpOhPB56kNnYDndNiY=",
                "typeData": {
                    "__typename": "HistoryTypeSold",
                    "type": "sold",
                    "oldOwner": "EQBHkpicntF5fwOiUZKn8HnbIRITfd3B_VuefK9TCPK9BFfo",
                    "newOwner": "EQAIsDyxz0ZNIJWw60UF5RQkcPVOu6Tl6uBdNuxHrWG6A3nG",
                    "oldOwnerUser": {
                        "id": "6396881e5e1a106818c8f731",
                        "avatar": "https://i.getgems.io/QldcLBp-zQ2ZOxpAo8IaP6aY4fb37eWzabQZRjmGY5o/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjYucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "newOwnerUser": {
                        "id": "63c1c14b00f83fa0bdcc0929",
                        "avatar": "https://i.getgems.io/PWFH81ySLOFgqaGsenQbbQ67eKkQWozEl4_JjReU130/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjIucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "18000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "63a7fdb7d7d3e13be53ca342",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1671953834,
                "createdAt": 1671953847,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "33934670000001",
                "hash": "GcPNoxdKq8dDMnwvYUR4Wq4jboIGsn9EG0tLpeOY5gQ=",
                "typeData": {
                    "__typename": "HistoryTypeSold",
                    "type": "sold",
                    "oldOwner": "EQBHkpicntF5fwOiUZKn8HnbIRITfd3B_VuefK9TCPK9BFfo",
                    "newOwner": "EQBHkpicntF5fwOiUZKn8HnbIRITfd3B_VuefK9TCPK9BFfo",
                    "oldOwnerUser": {
                        "id": "6396881e5e1a106818c8f731",
                        "avatar": "https://i.getgems.io/QldcLBp-zQ2ZOxpAo8IaP6aY4fb37eWzabQZRjmGY5o/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjYucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "newOwnerUser": {
                        "id": "6396881e5e1a106818c8f731",
                        "avatar": "https://i.getgems.io/QldcLBp-zQ2ZOxpAo8IaP6aY4fb37eWzabQZRjmGY5o/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjYucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "15000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "639eadf6d7d3e13be532f925",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1671343597,
                "createdAt": 1671343606,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "33747918000003",
                "hash": "jkzCoQyY2IbIvrbQHdXOeDnJ2JSYp11ZKLf8B0PvLsI=",
                "typeData": {
                    "__typename": "HistoryTypeSold",
                    "type": "sold",
                    "oldOwner": "EQBsPABtc8EfhSNRzFrgFy6QsjGUD3idVtWowWGlZsUNcIOf",
                    "newOwner": "EQBHkpicntF5fwOiUZKn8HnbIRITfd3B_VuefK9TCPK9BFfo",
                    "oldOwnerUser": {
                        "id": "639723fc689da0ec4714deca",
                        "avatar": "https://i.getgems.io/eqw6VqqhoLrOsADn7zpHpGpeayzNOQFry5HDAlIuSko/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMDIucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "newOwnerUser": {
                        "id": "6396881e5e1a106818c8f731",
                        "avatar": "https://i.getgems.io/QldcLBp-zQ2ZOxpAo8IaP6aY4fb37eWzabQZRjmGY5o/rs:fill:512:512:1/g:ce/czM6Ly9nZXRnZW1zLXMzL3VzZXItbWVkaWEvZGVmYXVsdC9uZXcvMjYucG5n",
                        "name": "",
                        "domain": null,
                        "isBurn": false,
                        "__typename": "User"
                    },
                    "price": "14000000000"
                },
                "__typename": "NftItemHistory"
            },
            {
                "id": "63965133fa70928b0fa82485",
                "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                "time": 1670795560,
                "createdAt": 1670795571,
                "nft": {
                    "name": "+888 0756 1420",
                    "address": "EQB_Yh-Fq37GWiiVfwsQeKt8kEzc0E-OKswGykq0x0998TgF",
                    "content": {
                        "image": {
                            "sized": "https://i.getgems.io/igtarwKiDspOvXc0-wJKiMeRrwiZ-Dh6goDylnQ8Sxo/rs:fill:56:0:1/g:ce/czM6Ly9nZXRnZW1zLXMzL25mdC1jb250ZW50LWNhY2hlL2ltYWdlcy9FUUFPUWR3ZHc4a0dmdEpDU0ZnT0VyTTFtQmpZUGU0REJQcTgtQWhGNnZyOXNpNU4vMzFkZGQxMWIxNDAwZmVmMg",
                            "__typename": "Image"
                        },
                        "__typename": "NftContentImage"
                    },
                    "__typename": "NftItem"
                },
                "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
                "lt": "33582533000005",
                "hash": "PScYqdyQRdAkIdsX6sUbyxEpkEhnrII0aEzGPtVKL9E=",
                "typeData": {
                    "__typename": "HistoryTypeMint",
                    "type": "mint"
                },
                "__typename": "NftItemHistory"
            }
          ],
          "__typename": "NftItemHistoryConnection"
      }
  }
}

const transformItemHistory = (items) => {
  return items.map((item) => {
    return {
      id: item.id,
      address: item.address,
      from: item.typeData.oldOwner,
      to: item.typeData.newOwner,
      price: item.typeData.price,
      timestamp: item.createdAt,
      type: item.typeData.type,
    }
  })
}

export const getItemHistory = async function(address, { limit = 50, offset = 0, end_utime }) {
    // const { data: { data: { historyNftItem }}} = await http.post(null, {
    //     query: GetItemHistoryQuery,
    //     variables: { address, count, cursor },
    // });

    // return historyNftItem;

    const items = transformItemHistory(historyMock.data.historyNftItem.items)
    return Promise.resolve(items)
};
