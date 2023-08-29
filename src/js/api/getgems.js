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
              }
          ],
          "__typename": "NftItemHistoryConnection"
      }
  }
}

export const getItemHistory = async function(address, count = 24, cursor = undefined) {
    // const { data: { data: { historyNftItem }}} = await http.post(null, {
    //     query: GetItemHistoryQuery,
    //     variables: { address, count, cursor },
    // });

    // return historyNftItem;

    return Promise.resolve(historyMock.data.historyNftItem)
};
