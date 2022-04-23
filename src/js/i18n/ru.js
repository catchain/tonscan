export default {
    header: {
        search_placeholder: 'Поиск по адресу или домену',
    },

    indexpage: {
        search_placeholder: 'Введите адрес TON...',
    },

    address: {
        info: {
            address: 'Адрес',
            copy_success: 'Адрес скопирован',
            balance: 'Баланс',
            last_activity: 'Активность',
            state: 'Состояние',
            type_frozen: 'Замороженный',
            type_active: 'Активный',
            type_inactive: 'Неактивный',
            contract_type: 'Тип контракта',
            no_activity: 'Не было транзакций',
        },

        tx_table: {
            empty: 'История транзакций пуста',
            age: 'Возраст',
            from: 'Отправитель',
            to: 'Получатель',
            value: 'Сумма',
            loader: 'ЗАГРУЗИТЬ ЕЩЁ',
            loader_loading: 'ЗАГРУЗКА...',
        },
    },

    tx: {
        address: 'Address',
        timestamp: 'Время',
        workchain: 'Воркчейн',
        seqno: 'Номер',
        shard: 'Шард',
        fee: 'Комиссия',
        message: 'Комментарий',
        hash: 'Хэш',
        lt: 'LT',
        msgs: 'Сообщения',
        msgs_empty: 'Нет сообщений',
        msgs_count: '{0} входящих, {1} исходящих',
        hash_copy_success: 'Хэш скопирован',
        lt_copy_success: 'LT скопирован',
    },

    block: {
        nav: {
            prev: 'Предыдущий блок',
            next: 'Следующий блок',
            latest: 'Последний блок',
        },
        masterchain_block_title: 'Блок мастерчейна',
        shardchain_block_title: 'Блок шардчейна',
        shardchain_blocks_title: 'Блоки шардчейна',
        transactions_title: 'Транзакции',
        show_details: 'Показать {0} унылых деталей',
    },

    blocks: {
        last_masterchain_blocks_title: 'Последние блоки мастерчейна',
    },

    nft: {
        collection: {
            meta: {
                title: 'TON Explorer :: NFT-коллекция {name}',
            },
            item_count: 'Пусто | {n} штука | {n} штуки | {n} штук',
        },
        item: {
            meta: {
                title: 'TON Explorer :: NFT-итем {name}',
            },
            collection: 'Коллекция',
            owner: 'Владелец',
            number: 'Номер',
            attributes: 'Атрибуты',
            preview: {
                index: 'Номер {index} из {total}',
                error_text: 'Ошибка загрузки NFT',
                error_button: 'Повторить',
            },
        },
    },

    error: {
        invalid_address: 'Кажется, это некорректный адрес. Откуда вы его взяли?',
        invalid_tx: 'Кажется, вы перешли по некорректной ссылке на транзакцию. Откуда вы её взяли?',
    },
};
