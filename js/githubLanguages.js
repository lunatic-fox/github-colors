/**
 @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 @copyright Josélio de S. C. Júnior - 2022
 @license MIT
*//**/

import nums from './nums.js';

async function githubLanguages() {
  const data = await fetch(`https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml`);
  let res = await data.text();

  res = 
    res
      .match(/^([a-z0-9].+|\s+type:.+|\s+color:.+|\s+extensions:\n(\s+-\s.+)+)/gim)
      .join('\n')
      .replace(/^\s+-\s+"(.+)"/gm, '$1')
      .replace(/"/g, '')
      .replace(/^([a-z0-9].*):/gim, '---\n$1')
      .split('---\n')
      .filter(e => e)
      .map(e => {
        e = e.replace(/\n\./g, '<>.')
        .split('\n  ');

        const k = e[0];
        const v = Object.fromEntries(e.slice(1)
          .map(f => f.replace(/<>./g, '&nbsp; &nbsp;.').split(':')));

        if (v.color) {
          v.color = v.color.replace(/\s/g, '');
          nums.langsWithColor++;
        } else {
          v.color = 'none';
        }

        if (v.type)
          v.type = v.type.replace(/\s/g, '');
        
        if (v.extensions)
          v.extensions = v.extensions.replace(/&nbsp;/, '');

        return [k, v];
      });
      
  nums.langs = res.length;
  return Object.fromEntries(res);
}

export default githubLanguages;
