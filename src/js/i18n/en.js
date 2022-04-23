export default {
    header: {
        search_placeholder: 'Search by address or domain',
    },

    indexpage: {
        search_placeholder: 'Enter TON address...',
    },

    address: {
        info: {
            address: 'Address',
            copy_success: 'Address copied',
            balance: 'Balance',
            last_activity: 'Last activity',
            state: 'State',
            type_frozen: 'Frozen',
            type_active: 'Active',
            type_inactive: 'Inactive',
            contract_type: 'Contract Type',
            no_activity: 'No transactions',
        },

        tx_table: {
            empty: 'No transaction history',
            age: 'Age',
            from: 'From',
            to: 'To',
            value: 'Value',
            loader: 'SHOW MORE',
            loader_loading: 'LOADING...',
        },
    },

    tx: {
        address: 'Address',
        timestamp: 'Timestamp',
        workchain: 'Workchain',
        seqno: 'Seqno',
        shard: 'Shard',
        fee: 'Fee',
        message: 'Message',
        hash: 'Hash',
        lt: 'Logical time',
        msgs: 'Messages',
        msgs_empty: 'No messages',
        msgs_count: '{0} input, {1} output',
        hash_copy_success: 'Tx hash copied',
        lt_copy_success: 'LT copied to clipboard',
    },

    block: {
        nav: {
            prev: 'Prev block',
            next: 'Next block',
            latest: 'Latest',
        },
        masterchain_block_title: 'Masterchain Block',
        shardchain_block_title: 'Shardchain Block',
        shardchain_blocks_title: 'Shardchain Blocks',
        transactions_title: 'Transactions',
        show_details: 'Show {0} boring details',
    },

    blocks: {
        last_masterchain_blocks_title: 'Last masterchain blocks',
    },

    nft: {
        collection: {
            meta: {
                title: 'TON Explorer :: {name} NFT collection',
            },
            item_count: 'No items | {n} item | {n} items',
        },
        item: {
            meta: {
                title: 'TON Explorer :: {name} NFT item',
            },
            collection: 'Collection',
            owner: 'Owner',
            number: 'Number',
            attributes: 'Attributes',
            preview: {
                index: 'Item {index} of {total}',
                error_text: 'Error loading NFT',
                error_button: 'Try again',
            },
        },
    },

    error: {
        invalid_address: 'This doesn\'t look like a valid address. Where\'d you get that?',
        invalid_tx: 'This doesn\'t look like a valid transaction address. Where\'d you get that?',
    },
};
