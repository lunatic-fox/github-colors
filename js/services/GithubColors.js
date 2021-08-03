/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior 2021
 */

/**
 * Fetches the YAML file from Github linguist and converts the data into a string array of arrays of all languages and colors known by Github.
 * @example ["BASIC", "#ff0000"]
 */
async function githubLanguages() {
    const data = await fetch(`https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml`);  

    if (!data.ok)
        return !1;

    const response = await data.text();

    const arrt = `${response
        .replace(/^(#.*|---|\s{2}(?!color).*)/gm, '')
        .replace(/color|[:"]/gm, '')
        .replace(/^\n/gm, '')
        .replace(/\n\s{2}/gm, ',')
        }`
        .split('\n')
        .map(e => e.split(',').map(e => e.trim()))
        .filter(e => e.length > 1);

    return arrt;
}

export const githubColors = await githubLanguages();