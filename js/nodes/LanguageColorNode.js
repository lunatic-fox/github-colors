/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior - 2021
 * @license MIT
 */

import constants from "../constants.js";
import { Kolorz } from "../services/index.js";

export function languageColorNode(
    innerHTML = '-',
    idIndex = 0,
    bgColor = '#222222'
) {
    const node = document.createElement('span');
    node.innerHTML = `${innerHTML}<br>`;
    node.id = `${constants.WRAPPER_PREFIX}${idIndex}`;
    node.className = constants.BEFORE_CLICK;
    node.style.cssText = `
        background: ${Kolorz.hex(bgColor, 'hsl')};
        border: solid 1px ${Kolorz.hexHighlight(bgColor, .3)};
        color: ${Kolorz.hexHighlight(bgColor, .45)};
    `;
    return node;
}