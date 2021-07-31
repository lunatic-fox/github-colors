/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior 2021
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
        title: `Github known programming and markup language colors`,
        description: `
        Original Github's data file: <a href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml">LINK</a>
            <br>MIT License: <a href="https://github.com/github/linguist/blob/master/LICENSE">LINK</a>
            <div style="margin-top: 15px;">
                Languages total number: <span id="lang-number"></span>
            </div>`
    },
    pt_br: {
        title: `Cores das linguagens de programação e marcação conhecidas pelo Github`,
        description: `
        Arquivo de dados original do Github: <a href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml">LINK</a>
            <br>Licença MIT: <a href="https://github.com/github/linguist/blob/master/LICENSE">LINK</a>
            <div style="margin-top: 15px;">
                Número total de linguagens: <span id="lang-number"></span>
            </div>`
    }
};