/**
 * @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 * @copyright Josélio de S. C. Júnior - 2021
 * @license MIT
 */

import constants from "../constants.js";

export function innerColorNode(idIndex = 0) {
    const colorDescription = document.createElement('div');
    colorDescription.id = `${constants.DSCP_PREFIX}${idIndex}`;
    colorDescription.style.fontSize = '14px';
    return colorDescription;
}