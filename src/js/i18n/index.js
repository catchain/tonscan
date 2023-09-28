import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ru from './ru.js';
import en from './en.js';
import { APP_MAIN_LOCALE } from '~/config.js';
import './timeago.js';

Vue.use(VueI18n);

/**
 * @param  {String} value
 * @return {Number}
 */
const str2int = function convertStringifiedValueToInt(value) {
    if (value.endsWith('K') || value.endsWith('M')) {
        return 1000;
    }

    return parseInt(value.toString().replace(/[^\d]/g, ''), 10);
};

/**
 * Так как нам нужно поддерживать человекочитаемый формат (1К, 2М), то
 * для каждой локали необходим кастомный локализатор.
 *
 * @see https://kazupon.github.io/vue-i18n/guide/pluralization.html#custom-pluralization
 *
 * @param  {String|Number} value
 * @param  {Number}        choicesLength
 * @return {Number}
 */
const defaultPluralization = function defaultRuleForLatinLanguages(value, choicesLength) {
    if (typeof value === 'string') {
        value = str2int(value);
    }

    // [car | cars] vs [no cars | car | cars]
    const isExtendedFormat = choicesLength == 3;

    if (value == 0) {
        return isExtendedFormat ? 0 : 1;
    }

    if (value == 1) {
        return isExtendedFormat ? 1 : 0;
    }

    return isExtendedFormat ? 2 : 1;
};


export default new VueI18n({
    locale: APP_MAIN_LOCALE,
    messages: { ru, en },

    pluralizationRules: {
        en: defaultPluralization,

        /** нет цветов | {n} цветок | {n} цветка | {n} цветков */
        ru (choice, choicesLength) {
            if (typeof choice === 'string') {
                choice = str2int(choice);
            }

            if (choice === 0) {
                return 0;
            }

            const teen = choice > 10 && choice < 20;
            const endsWithOne = choice % 10 === 1;

            if (choicesLength < 4) {
                return (!teen && endsWithOne) ? 1 : 2;
            }

            if (!teen && endsWithOne) {
                return 1;
            }

            if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
                return 2;
            }

            return (choicesLength < 4) ? 2 : 3;
        },
    },
});
