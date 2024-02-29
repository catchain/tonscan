import { TONSCAN_APPS_IMAGE_CDN_ROOT, APP_MAIN_LOCALE } from '~/config.js';
import { searchApps as searchAppsRaw } from '~/api/typesense.js';

/**
 * @see https://docs.imgproxy.net/usage/processing
 * @param  {String} uri
 * @param  {Number} options.width
 * @param  {Number} options.height
 * @param  {String} options.resizingType
 * @return {String}
 */
export const makeImageUrl = (uri, { width, height, resizingType } = {}) => {
    const queryString = Object.entries({
        w: width,
        h: height,
        rt: resizingType,
        dpr: Math.ceil(window.devicePixelRatio ?? 1),
    }).filter(([_, value]) => !!value);

    return [
        TONSCAN_APPS_IMAGE_CDN_ROOT + uri,
        new URLSearchParams(queryString).toString(),
    ].join('?');
};

/**
 * Simple Map extension. Returns either requested locale, or the default app locale:
 */
export class LocaleBucket extends Map {
    get(locale) {
        return super.get(locale) ?? super.get(APP_MAIN_LOCALE);
    }
}

/**
 * Holds apps by their slugs.
 * @type {Map<String, Object>}
 */
const appCache = new Map();

/**
 * Clears local cache variable, should call this function in beforeDestroy hook.
 * @return {undefined}
 */
export const clearSearchCache = () => appCache.clear();

/**
 * Maps typesense result to object.
 * @param  {Object} document
 * @return {Object}
 */
const mapData = (document) => Object.freeze({ // eslint-disable-line arrow-parens
    id: document.id,
    title: document.name,
    slug: document.slug,
    icon: document.avatar,
    screenshots: document.screenshots || [],
    isAds: document.is_ads,
    isTrending: document.is_trending,
    isNew: document.is_new,
    isVerified: document.is_verified,
    categorySlug: document.category_slug,
    linkFull: document.link,
    tonAddress: document.address,

    descriptions: new LocaleBucket([
        ['ru', document.short_description_ru],
        ['en', document.short_description],
    ]),

    fullDescriptions: new LocaleBucket([
        ['ru', document.full_description_ru],
        ['en', document.full_description],
    ]),
});

/**
 * @param {String} query
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const searchApps = async function searchAppsAndMapResultsToAppObject(params = {}) {
    const results = await searchAppsRaw(params);

    const apps = results.hits.map(({ document }) => mapData(document));

    // Save all received apps to cache:
    apps.forEach(app => appCache.set(app.slug, app));

    return {
        hits: apps,
        found: results.found,
    };
};

/**
 *
 * @param {String} name
 * @returns {Promise<Object>}
 */
export const findApp = async function searchAppBySlugOrReturnCached(name) {
    if (appCache.has(name)) {
        return appCache.get(name);
    }

    const { hits } = await searchApps({
        q: name,
        query_by: 'slug',
        per_page: 1,
        page: 1,
    });

    return hits.find(app => app.slug === name);
};
