export default {
    header: {
        search_placeholder: 'Search by address or domain',
        search_domain_error: 'Domain misconfigured or does not exist',
        search_address_error: 'Please enter either TON address or .ton domain',
    },

    indexpage: {
        search_placeholder: 'Search TON addresses, domains and transactions...',
        search_domain_error: 'Domain misconfigured or does not exist',
        search_address_error: 'Please enter either TON address or .ton domain',
    },

    search: {
        category: {
            wallet: 'Wallet',
            nft: 'NFT collection',
            pool: 'Pool',
        },
    },

    contract: {
        tab_source: 'Source',
        tab_get_methods: 'Get methods',
        tab_address_formats: 'Address formats',
        call_method: 'Call method',
        arbitrary_method: 'Arbitrary method',
        enter_method_name: 'Enter method name',
        execute: 'Execute',
        add_argument: 'Add argument',
        value: 'Value',
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

        contract_type: {
            wallet: 'Wallet',
            nft_collection: 'NFT Collection',
            nft_item: 'NFT Item',
            jetton: 'Jetton',
            jetton_wallet: 'Jetton Wallet',
            nominator_pool: 'Nominator Pool',
            unknown: 'Unknown',
            domain_name: 'Domain',
            dns_domain: '.ton domain',
            nft_sale: 'NFT item sale',
            nft_offer: 'NFT item offer',
            subscription: 'Subscription',
            telegram_username: 'Telegram username',
            telegram_number: 'Anonymous number',
            other: 'Other',
            sale: {
                sale_info: '{0} for {1}',
                on_auction: 'on auction',
                on_sale: 'on sale',
            },
            storage_provider: {
                name: 'Storage provider',
                rate_template: '{period} rate:',
                rate_value_hour: 'Hourly',
                rate_value_day: 'Daily',
                rate_value_month: 'Monthly',
                rate_value_year: 'Yearly',
                bytes_template: 'per {value}',
                bytes_value_mb: 'MiB',
                bytes_value_gb: 'GiB',
                bytes_value_tb: 'TiB',
            },
            subscription_modal_header: 'Subscription contract',
            nft_sale_modal_header: 'NFT item sale contract',
        },

        tab_nfts: 'NFTs',
        tab_transactions: 'History',
        tab_contract: 'Contract',
        tab_tokens: 'Jettons',

        tx_table: {
            empty: 'No transaction history',
            age: 'Age',
            from: 'From',
            to: 'To',
            value: 'Value',
            input: 'IN',
            output: 'OUT',
            log: 'LOG',
            nowhere: 'Nowhere',
            external: 'external',
            address_count: 'empty | {n} address | {n} addresses',
        },

        nfts: {
            no_nfts: 'User doesn\'t own any nft',
            no_collection: 'Standalone NFT',
        },

        tokens: {
            no_tokens: 'User doesn\'t own any jettons',
            table_token_name: 'Jetton',
            table_token_balance: 'Balance',
            table_token_jetton_wallet: 'Jetton wallet',
        },

        contract: {
            admonition: {
                verified_title: 'Verified sources',
                verified_text: 'This source code compiles to the same exact bytecode that is found on-chain. Verification was carried out using the {verifier}.',
                unverified_title: 'Unverified contract',
                unverified_text: 'We don\'t have the source codes for this contract. You may publish them via {verifier}.',
                verifier_link_text: 'verification tool',
                inactive_title: 'Uninitialized address',
                inactive_text: 'This address doesn\'t contain any data in blockchain — it was either never used or the contract was deleted. Now it just aimlessly floats in the digital void.',
            },

            tab_raw_source: 'Bytecode',
            tab_raw_data: 'Raw data',

            info: 'Info',
            code: 'Code',
            data: 'Data',
            source_hex: 'hex',
            source_tvm: 'disassembled',
            source_base64: 'base64',
            source_cells: 'cells',
            info_description: 'This address is {type} smart contract.',
            info_source: 'Its source code is {link}.',
            source_code: 'available on GitHub',
            types: {
                wallet: 'a wallet',
                lockup_wallet: 'a lockup wallet',
                nft_collection: 'an NFT collection',
                nft_item: 'an NFT item',
                elector: 'a validator elector',
            },
        },
    },

    tx: {
        meta: {
            title: 'TON Explorer :: Transaction {hash}',
        },
        title: 'Transaction details',
        account: 'Account',
        status: 'Status',
        status_success: 'Success',
        status_failed: 'Failed',
        exit_codes: 'Exit codes',
        compute_phase: 'compute phase',
        action_phase: 'action phase',
        phase_aborted: 'aborted',
        error_icon_tooltip: 'Failed with exit code {0}',
        exit_code_success: 'OK',
        exit_code_error: 'Error, exit code {0}',
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
                title: '{name} NFT collection :: TON Explorer',
                description: 'View {count} NFT items of {name} collection in TON blockchain explorer.',
            },
            item_count: 'No items | {n} item | {n} items',
            empty_collection_header: 'Empty collection',
            empty_collection_text: 'Seems like there\'re no items in this collection. Try refreshing the page, or go to the {0}.',
            empty_collection_text_account_link: 'account overview',
            nonseq_collection_header: 'Special collection',
            nonseq_collection_text: 'We did our best, but still couldn\'t display this collection. Try visiting this page later, or go to the {0}.',
            nonseq_collection_text_account_link: 'account overview',
        },
        item: {
            meta: {
                title: '{name} NFT item (#{index}) :: TON Explorer',
                title_standalone: '{name} NFT item :: TON Explorer',
            },
            collection: 'Collection',
            no_collection: 'None',
            owner: 'Owner',
            number: 'Number',
            metadata_source: 'Metadata',
            metadata_source_onchain: 'Onchain',
            metadata_source_offchain: 'External',
            metadata_view_source: 'view source',
            attributes: 'Attributes',
            no_attributes: 'None',
            recent_tx: 'Recent transactions',
            preview: {
                index: 'Item {index} of {total}',
                error_text: 'Error loading NFT',
                error_button: 'Try again',
            },
        },
        error: {
            redirect_invalid: 'This address in not an NFT',
        },
    },

    jetton: {
        admin_address: 'Owner',
        admin_address_empty: 'None',
        admin_address_empty_explanation: '(the owner have revoked their rights)',
        supply: 'Total supply',
        mutable: 'Mutable',
        tokens: 'Jettons',
        metadata_source: 'Metadata',
        search_wallet: 'Search wallet',
        search_wallet_placeholder: 'Insert your wallet address',
        recent_tx: 'Recent transactions',
        top_holders: 'Top holders',
        wallet: {
            title: 'Jetton Wallet',
            owner: 'Owner',
            jetton: 'Jetton',
        },
        error: {
            redirect_invalid: 'This address in not a jetton',
        },
    },

    nominator_pool: {
        title: 'Nominator Pool',
        title_help_link: 'https://blog.ton.cat/p/e9387b54-4975-4d09-bab8-8afbec7ac95b',
        button_loading: 'Loading...',
        button_disabled: 'No empty slots',
        button_add_stake: 'Add stake',
        help_text_disabled: 'impossible to add stake: no empty slots at the moment',
        help_text_add_stake: 'send at least <b>{0} TON</b> with "<b>d</b>" text comment',
        validator: 'Validator',
        nominator_count: 'Nominators',
        nominator_count_value: '{count} of {total}',
        stake: 'Stake',
        stake_validator: 'Validator',
        stake_nominators: 'Nominators',
        stake_total: 'Total',
        reward_share: 'Income share',
        reward_share_validator: 'Validator',
        reward_share_nominators: 'Nominators',
        min_stake: 'Min stake',
        min_stake_validator: 'Validator',
        min_stake_nominator: 'Nominator',
        tab_transactions: 'Transactions',
        tab_nominators: 'Nominators',
        nominator_table_empty: 'No nominators',
        nominator_table_stake: 'Stake',
        nominator_table_pie: 'Pie',
        nominator_table_pending: 'Pending',
        nominator_table_withdrawal: 'Withdrawing',
        tab_votings: 'Votings',
        voting_table_empty: 'No votings at the moment',
        voting_table_proposal_hash: 'Proposal hash',
        voting_table_created_at: 'Created',
        votes: {
            cast_vote: 'Cast a vote',
            vote_list: 'Votes',
            disclaimer: 'Only validator and nominators may cast a vote.',
            vote_list_empty: 'No votes yet',
            votes_table_supported: 'Vote',
            votes_table_date: 'Date',
        },
        votes_bar: {
            title: 'Voting result',
            in_favor: 'In favor',
            against: 'Against',
            abstained: 'Abstained',
        },
        error: {
            redirect_invalid: 'This address is not a nominator pool',
        },
    },

    subscription: {
        contract_description_html: 'This is a <strong>subscription</strong> smart contract. It periodically sends TONs to <strong>beneficiary</strong>, in exchange to access to services like Telegram channel or whatnot.',
        subscriber: 'Subscriber',
        beneficiary: 'Beneficiary',
        price: 'Price',
        first_payment_date: 'First payment',
        last_payment_date: 'Last payment',
        subscription_id: 'ID',
        period: {
            monthly: 'per month',
        },
    },

    nft_sale: {
        contract_description_html: 'This is a <strong>NFT sale</strong> smart contract. It passes the NFT item to the buyer as soon as they pay the required amount of TONs.',
        nft_item: 'NFT item',
        price: 'Price',
        is_active: 'Active',
        closed_help_text: '(no longer on sale)',
        purchase: 'Purchase',
        marketplace: 'Marketplace',
        seller: 'Seller',
        fees: 'Fees',
        marketplace_fee: 'Marketplace',
        royalty: 'Royalty',
    },

    common: {
        address: 'Address',
        loading: 'Loading...',
        load_more: 'Load more',
        no_description: 'No description',
        unknown: 'Unknown',
        yes: 'Yes',
        no: 'No',
        raw_metadata: 'Raw metadata',
        nft_item: 'NFT item',
    },

    error: {
        invalid_address: 'This doesn\'t look like a valid address. Where\'d you get that?',
        invalid_tx: 'This doesn\'t look like a valid transaction address. Where\'d you get that?',
    },
};
