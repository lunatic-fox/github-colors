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

    if (data.status < 200 || data.status > 226)
        return !1;

    const response = await data.text();

    const t = `${response
        .replace(/^(\#.*|---|\s{2}(?!color).*)/gm, '')
        .replace(/color:/gm, '')
        .replace(/:\s+"#/gm, `","#`)
        .replace(/.*:/gm, '')
        .replace(/\"\s+/gm, `","`)
        .replace(/","$/, '')
        }`
        .split(',')
        .map(x => x.replace(/\n|"/g, ''));

    const arr = [];
    for (let i = 0; i < t.length; i++) arr.push([t[i], t[i + 1]]), i++;
    return arr;
}

export const githubColors = await githubLanguages();