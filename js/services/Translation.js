/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior - 2021
 * @license MIT
 */

/**
 * Translation to the title and description of the project.
 */
export const translation = {
    translate(ids) {
        if (navigator.language == 'pt' || navigator.language == 'pt-BR') {
            ids.title.innerHTML = this.pt_br.title;
            ids.description.innerHTML = this.pt_br.description;
        } else {
            ids.title.innerHTML = this.en.title;
            ids.description.innerHTML = this.en.description;
        }
    },
    en: {
        title: `Colors of all languages known to GitHub`,
        description: `
        Original Github's data file: <a href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml" target="_blank">LINK</a>
            <br>MIT License: <a href="https://github.com/github/linguist/blob/master/LICENSE" target="_blank">LINK</a>
            <div style="margin-top: 15px;">
                Languages total number: <span id="lang-number"></span>
            </div>`
    },
    pt_br: {
        title: `Cores de todas as linguagens conhecidas pelo Github`,
        description: `
        Arquivo de dados original do Github: <a href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml" target="_blank">LINK</a>
            <br>Licença MIT: <a href="https://github.com/github/linguist/blob/master/LICENSE" target="_blank">LINK</a>
            <div style="margin-top: 15px;">
                Número total de linguagens: <span id="lang-number"></span>
            </div>`
    }
};
