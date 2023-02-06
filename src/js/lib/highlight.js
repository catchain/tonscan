/**
 * These stunts are performed by trained professionals, don't try this at home!
 *
 * @param  {Object} block
 * @return {undefined}
 */
const splitResultIntoTwoColumnsWithLineNumbers = function(block) {
    const oldChildren = block._emitter.rootNode.children;
    const newChildren = [{
        scope: 'hack-lines',
        children: [],
    }, {
        scope: 'hack-code',
        children: oldChildren,
    }];

    const lineCount = (block.code.match(/\n/g) || '').length + 1;

    for (let i = 1; i <= lineCount; i++) {
        newChildren[0].children.push(`${i}\n`);
    }

    // trims newlines from the end of the columns
    // iterates backwards until the line is not plain string, then exists
    for (let i = oldChildren.length - 1; i > oldChildren.length - 5; i--) {
        const lineContents = oldChildren[i];

        if (typeof lineContents === 'string' && lineContents.match(/^[\r|\n]+$/)) {
            // count of linebreaks in the string:
            const lineBreaks = lineContents.length;

            // remove linebreaks from the end of the left column:
            newChildren[0].children.splice(lineBreaks * -1);

            // since this line is considered a single child, we remove ONE last child
            // from the right column:
            newChildren[1].children.splice(-1);
        } else {
            break;
        }
    }

    block._emitter.rootNode.children = newChildren;
};

/**
 * Resolves to hl.js instance.
 * @type {Promise<Object>}
 */
let hljsPromise = undefined;

/**
 * We need to load core module just once, because we can't check the plugin list.
 * @return {Promise<Object>}
 */
const loadHljsCore = async function() {
    if (!hljsPromise) {
        hljsPromise = import('highlight.js/lib/core').then((module) => {
            module.default.addPlugin({ 'after:highlight': splitResultIntoTwoColumnsWithLineNumbers });
            return module.default;
        });
    }

    return hljsPromise;
};

/**
 * @param  {String} lang
 * @return {Promise<Object>}
 */
const loadHljsGrammar = async (lang) => import(`highlightjs-func/src/languages/${lang}.js`).then(module => module.default);

/**
 * @param  {String} lang
 * @return {Promise<Object>}  HighlightJS instance
 */
const loadLibraries = async function(lang) {
    const [hljs, grammar] = await Promise.all([
        loadHljsCore(),
        loadHljsGrammar(lang),
    ]);

    hljs.registerLanguage(lang, grammar);

    return hljs;
};

/**
 * Loads all libraries on demand, returns HTML string.
 * @param  {String} value
 * @param  {String} language
 * @return {Promise<String>}
 */
export async function highlight(value, language = 'func') {
    return loadLibraries(language)
        .then(hljs => hljs.highlight(value, { language })._emitter.toHTML())
        .catch(e => value);
};
