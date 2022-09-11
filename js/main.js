/**
 @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 @copyright Josélio de S. C. Júnior - 2022
 @license MIT
*//**/

import cst from './constants.js';
import githubLanguages from './githubLanguages.js';
import nums from './nums.js';
import Kolorz from './Kolorz.js';


const contrast = (color, lightness = 0) => {
  const c = Kolorz.hex(color).toHSL.replace(/[hsl( )%]/g, '').split(',').map(e => +e);
  const l = +(lightness * 100).toFixed();

  return Kolorz.hsl(`hsl(${c.slice(0, 2)}%,${Math.abs(
      c[2] >= 90 ? c[2] - (l + 30)
    : c[2] >= 65 ? c[2] - (l + 10)
    : c[2] >= 35 ? c[2] - l 
    : c[2] + l
  )}%)`).toHex;
};

document.getElementById('year').innerText = new Date().getFullYear();

const endLoading = () => {
  const loading = document.getElementById('loading');
  loading.style = `transition: ease all 1.1s; opacity: 0`;
  setTimeout(() => loading.remove(), 1.1e3);
};

githubLanguages()
  .then(ghc => {
    endLoading();

    document.getElementById('n-langs').textContent = nums.langs > 0 ? `Number of languages: ${nums.langs}` : '';
    document.getElementById('nc-langs').textContent = nums.langsWithColor > 0 ? `Number of languages with color: ${nums.langsWithColor}` : '';

    const intoCards = Object.entries(ghc)
      .map(([k, v], i) => {
        const lm3 = Kolorz.hex(v.color).lightness(-.3).value;
        const cx4 = contrast(v.color, .4);
        return `
          <section
            id="xa-${i}"
            class="${cst.LANG_M_BOX}">
            <article
              id="xb-${i}"
              class="${cst.LANG}"
              style="color: ${
                  v.color !== 'none' ? cx4 : '#fff4'
                }; background: ${v.color}; box-shadow: inset -2px -2px 5px ${
                  v.color !== 'none' ? lm3 : '#fff2'
                }, inset 2px 2px 5px ${
                  v.color !== 'none' ? Kolorz.hex(v.color).lightness(.2).value : '#fff2'
                }, 2px 2px 3px #161616;">
              <section id="xf-${i}" class="copy-sect">
                <section>
                  <section id="k-${i}" class="l-title">${k}</section>
                  <p>${v.type}</p>
                </section>
                <section
                  id="xd-${i}"
                  class="${cst.COPY_BTN_BG}"
                  style="background: ${
                    v.color !== 'none' ? Kolorz.hex(v.color).lightness(-.1).value : '#00000025'
                  }; box-shadow: inset 2px 2px 5px ${
                    v.color !== 'none' ? lm3 : '#0000006b'
                  };">
                  <button
                    id="xe-${i}"
                    class="${cst.COPY_ICON_BTN}" style="background: ${
                      v.color !== 'none' ? cx4 : '#fff4'
                    }"></button>
                </section>
              </section>
              ${
                v.color === 'none' && !v.extensions ?
                 `<p id="xc-${i}" class="${cst.INT_INF}" style="margin: 0"></p>`
                : `
                <p id="xc-${i}" class="${cst.INT_INF}">
                  ${v.color === 'none' ? '' : `<span> <b>color:</b> ${v.color} </span><br>`}
                  ${v.extensions ? `<span> <b>extensions:</b>&nbsp; ${v.extensions}</span>` : ''}
                </p>`
              }
            </article>
          </section>`;
        })
      .join('');

    document.getElementById('lang-box').innerHTML = intoCards;

    [...document.getElementsByClassName(cst.LANG_M_BOX)]
      .forEach((e, i) => {
        e.onclick = () => {
          const xa = document.getElementById(`xa-${i}`),
                xb = document.getElementById(`xb-${i}`),
                xc = document.getElementById(`xc-${i}`),
                xd = document.getElementById(`xd-${i}`),
                xe = document.getElementById(`xe-${i}`),
                xf = document.getElementById(`xf-${i}`);

          if ([...xc.classList].length === 1) {
            xa.classList.add(cst.LANG_M_BOX_ON);      
            xb.classList.add(cst.LANG_ON);
            xc.classList.add(cst.INT_INF_ON);
            xd.classList.add(cst.COPY_BTN_BG_ON);
            xe.classList.add(cst.COPY_ICON_BTN_ON);
            xf.classList.add(cst.COPY_SECT_ON);
          } else {
            if ([...xc.classList].some(e => e === cst.INT_INF_OFF)) {
              xa.classList.remove(cst.LANG_M_BOX_OFF);
              xa.classList.add(cst.LANG_M_BOX_ON);
              xb.classList.remove(cst.LANG_OFF);
              xb.classList.add(cst.LANG_ON);
              xc.classList.remove(cst.INT_INF_OFF);
              xc.classList.add(cst.INT_INF_ON);
              xd.classList.add(cst.COPY_BTN_BG_ON);
              xd.classList.remove(cst.COPY_BTN_BG_OFF);
              xe.classList.add(cst.COPY_ICON_BTN_ON);
              xe.classList.remove(cst.COPY_ICON_BTN_OFF);
              xf.classList.add(cst.COPY_SECT_ON);
              xf.classList.remove(cst.COPY_SECT_OFF);
            } else {
              xa.classList.remove(cst.LANG_M_BOX_ON);
              xa.classList.add(cst.LANG_M_BOX_OFF);
              xb.classList.remove(cst.LANG_ON);
              xb.classList.add(cst.LANG_OFF);
              xc.classList.remove(cst.INT_INF_ON);
              xc.classList.add(cst.INT_INF_OFF);
              xd.classList.add(cst.COPY_BTN_BG_OFF);
              xd.classList.remove(cst.COPY_BTN_BG_ON);
              xe.classList.add(cst.COPY_ICON_BTN_OFF);
              xe.classList.remove(cst.COPY_ICON_BTN_ON);
              xf.classList.add(cst.COPY_SECT_OFF);
              xf.classList.remove(cst.COPY_SECT_ON);
            }
          }
        };
      });

    [...document.getElementsByClassName(cst.COPY_BTN_BG)]
      .forEach((e, i) => {
        e.onclick = () => {
          const key = document.getElementById(`k-${i}`);
          const v = ghc[key.innerText];
          const response = `${key.innerText}\n${
              v.type ? `type: ${v.type}` : ''
            }\n${
              v.color ? `color: ${v.color}` : ''
            }\n${
              v.extensions ? `extensions:${
                v.extensions
                  .replace(/&nbsp;/g, '')
                  .replace(/\s+/g, ' ')
              }` : ''
            }`;

          navigator.clipboard.writeText(response);

          const xa = document.getElementById(`xa-${i}`);
          const copyAlert = document.createElement('section');
          copyAlert.className = `copy-alert`;
          copyAlert.innerHTML = `<div class="copy-alert-msg">Copied!</div><div class="copy-alert-arrow"></div>`;

          xa.appendChild(copyAlert);

          setTimeout(() => xa.removeChild(copyAlert), 2e3);
        };
      });
  })
  .catch(() => 
    document.getElementById('lang-box').innerHTML = `
    <section class="${cst.LANG_M_BOX}">
      <article
        class="${cst.LANG}"
        style="width: fit-content; color: #fff4; background: transparent; box-shadow: inset -2px -2px 5px #fff2, inset 2px 2px 5px #fff2, 2px 2px 3px #161616;">
        <section class="l-title">No data found</section>
        <h4 style="margin: 5px 0">Possible problems</h4>
        <ul style="text-align: left">
          <li style="margin: 0 15px">Disconnected network</li>
          <li style="margin: 0 15px">The original file was moved</li>
        </ul>
      </article>
    </section>`
  );
