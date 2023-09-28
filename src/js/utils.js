/**
 * @see https://github.com/toncenter/tonweb/blob/f3304156fb3000e96a7ed10123ae31185792d05a/src/utils/Utils.js#L62
 * @param buffer  {Uint8Array}
 * @return {string}
 */
export const bytesToHex = function(buffer) {
    const hex_array = [];
    for (let i = 0; i < buffer.byteLength; i++) {
        hex_array.push(to_hex_array[buffer[i]]);
    }
    return hex_array.join("");
};

/**
 * @see https://github.com/toncenter/tonweb/blob/f3304156fb3000e96a7ed10123ae31185792d05a/src/utils/Utils.js#L76
 * @param hex {string}
 * @return {Uint8Array}
 */
export const hexToBytes = function(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return bytes;
};

/**
 * @see https://github.com/toncenter/tonweb/blob/f3304156fb3000e96a7ed10123ae31185792d05a/src/utils/Utils.js#L98
 * @param str {string}
 * @param size  {number}
 * @return {Uint8Array}
 */
export const stringToBytes = function(str, size = 1) {
    let buf;
    let bufView;
    if (size === 1) {
        buf = new ArrayBuffer(str.length);
        bufView = new Uint8Array(buf);
    }
    if (size === 2) {
        buf = new ArrayBuffer(str.length * 2);
        bufView = new Uint16Array(buf);
    }
    if (size === 4) {
        buf = new ArrayBuffer(str.length * 4);
        bufView = new Uint32Array(buf);
    }
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return new Uint8Array(bufView.buffer);
};

/**
 * @see https://github.com/toncenter/tonweb/blob/f3304156fb3000e96a7ed10123ae31185792d05a/src/utils/Utils.js#L161
 * @param data  {ArrayLike<number>}
 * @return {Uint8Array}
 */
export const crc16 = function(data) {
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
};

/**
 * @param  {String} hex
 * @return {String}
 */
export const hexToBase64 = function(hex) {
    return window.btoa(String.fromCharCode(...hexToBytes(hex)));
};

export const base64ToBytes = function(base64) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
};

export const base64ToHex = function(str) {
    const raw = atob(str);
    let result = '';

    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }

    return result;
};

export const dechex = function signedIntToHex (value) {
    return parseInt(value).toString(16).replace('-', '');
};

export const toBase64Web = (base64) => base64.replace(/\+/g, '-').replace(/\//g, '_');
export const toBase64Rfc = (base64) => base64.replace(/\-/g, '+').replace(/_/g, '/');

export const getCSSVar = (name) => {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue(`--${name}`).trim();
};

/**
 * @param  {String} data
 * @return {Object}
 */
export const parseCsv = function convertCsvStringToObject(data) {
    const lines = data.split('\n');
    const keys = lines[0].split(',');

    return lines.slice(1).map((line) => {
        return line.split(',').reduce((previousItems, currentValue, idx) => {
            const key = keys[idx];
            return { ...previousItems, [key]: currentValue.trim() };
        }, {});
    });
};
