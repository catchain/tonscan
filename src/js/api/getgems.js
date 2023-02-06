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

export const getItemHistory = async function(address, count = 24, cursor = undefined) {
    const { data: { data: { historyNftItem }}} = await http.post(null, {
        query: GetItemHistoryQuery,
        variables: { address, count, cursor },
    });

    return historyNftItem;
};
