export const base64ToHex = function (str) {
    const raw = atob(str);
    let result = '';

    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }

    return result;
};

export const hexToBytes = function (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return bytes;
};

export const byteArrayToBase64 = function (byteArray) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(byteArray)));
};

function crc16(data) {
    const poly = 0x1021;
    let reg = 0;
    const message = new Uint8Array(data.length + 2);
    message.set(data);
    for (let byte of message) {
        let mask = 0x80;
        while (mask > 0) {
            reg <<= 1;
            if (byte & mask) {
                reg += 1;
            }
            mask >>= 1
            if (reg > 0xffff) {
                reg &= 0xffff;
                reg ^= poly;
            }
        }
    }
    return new Uint8Array([Math.floor(reg / 256), reg % 256]);
}

export const hexToAddress = function (address) {
    const [wc, hex] = address.split(':');

    const addr = new Int8Array(34);
    addr[0] = 0x11;
    addr[1] = parseInt(wc);
    addr.set(hexToBytes(hex), 2);

    const addressWithChecksum = new Uint8Array(36);
    addressWithChecksum.set(addr);
    addressWithChecksum.set(crc16(addr), 34);

    return byteArrayToBase64(addressWithChecksum)
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

export const dechex = function signedIntToHex (value) {
    return parseInt(value).toString(16).replace('-', '');
};
