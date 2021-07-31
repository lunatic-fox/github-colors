/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior 2021
 */
`use strict`
//import { Layout } from 'https://joseliojunior.github.io/js/Classes.js';
import { Layout } from '../../../js/Classes.js';

import constants from "./constants.js";
import { languageColorNode, innerColorNode } from './nodes/index.js'
import { Kolorz, githubColors, translation } from "./services/index.js";

const ids = {
    CONTENT: 'content',
    loading: document.getElementById('loading-screen'),
    starThemeBtn: document.getElementById('star-theme-btn'),
    themeLinkElement: document.getElementById('theme'),
    title: document.getElementById('title'),
    description: document.getElementById('description')
};

class main {

    static setLayout() {
        Layout.themePicker(ids.starThemeBtn, ids.themeLinkElement);
    };

    static async getData() {

        for (let i = 0; i < githubColors.length; i++) {

            const wrapperNode = languageColorNode(githubColors[i][0], i, githubColors[i][1])
            document.getElementById(ids.CONTENT).appendChild(wrapperNode);

            wrapperNode.appendChild(innerColorNode(i));

            const wrapper = document.getElementById(`${constants.WRAPPER_PREFIX}${i}`);
            const description = document.getElementById(`${constants.DSCP_PREFIX}${i}`);

            let status = true;

            wrapper.addEventListener('click', () => {

                if (status) {
                    wrapper.className = constants.AFTER_CLICK;
                    description.innerHTML = `
                    ${githubColors[i][1].toUpperCase()}<br>
                    ${Kolorz.hex(githubColors[i][1], 'rgb')}<br>
                    ${Kolorz.hex(githubColors[i][1], 'hsl')}`;

                    status = false;
                } else {
                    wrapper.className = constants.BEFORE_CLICK;
                    description.innerHTML = '';

                    status = true;
                };
            });

        };

        translation.translate(ids);
        document.getElementById('lang-number').innerHTML = githubColors.length ?? '-';

    };

    static async setData() {
        await this.getData();
        this.setLayout();
    };

    static async loadEnd() {
        this.setData();

        setTimeout(() => {
            ids.loading.remove();
        }, 500);
    };

    static get init() {
        this.loadEnd();
        window.addEventListener('resize', this.setLayout);
    };
};

main.init;