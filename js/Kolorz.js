/**
 @author Josélio de S. C. Júnior <joseliojrx25@gmail.com>
 @copyright Josélio de S. C. Júnior - 2022
 @license MIT
*//**/

const rgx = {
  vHex: /^#?([a-f0-9]{3}|[a-f0-9]{6})$/ig,
  vRGB: /^(rgb)?\(?((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]),){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\)?$/ig,
  vHSL: /^(hsl)?\(?(360|3[0-5][0-9]|[21][0-9]{2}|[1-9][0-9]|[0-9])(,(100|[1-9][0-9]|[0-9])%?){2}\)?$/ig,
  vHexa: /^#?([a-f0-9]{4}|[a-f0-9]{8})$/ig,
  vRGBA: /^(rgba)?\(?((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]),){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]),([01]|1\.0|0\.[0-9]{1,3}|\.[0-9]{1,3})\)?$/ig,
  vHSLA: /^(hsla)?\(?(360|3[0-5][0-9]|[21][0-9]{2}|[1-9][0-9]|[0-9])(,(100|[1-9][0-9]|[0-9])%?){2},([01]|1\.0|0\.[0-9]{1,3}|\.[0-9]{1,3})\)?$/ig,
  hex: /[# ]/g,
  rgba: /[rgba( )]/ig,
  hsla: /[hsla( )%]/ig,
  space: /\s/g
};

const fn = {
  HEXtoRGB(str) {
    if (str.match(rgx.vHex)) {
      const
        conv = (x) => x.map(x => parseInt(x, 16)).join(', '),
        v = str.replace(rgx.hex, '');
      
      if (v.length === 3)
        return `rgb(${conv(v.split('').map(x => x.repeat(2)))})`;

      const arr = [];
      for (let i = 0; i < v.length; i += 2) 
        arr.push(v.slice(i, i + 2));

      if (v.length === 6)
        return `rgb(${conv(arr)})`;
    }
    return '';
  },
  RGBtoHEX(str) {
    if (str.match(rgx.vRGB)) {
      const v = str.replace(rgx.rgba, '').split(',');
      return `#${
        v.map(x => 
          +x < 16 ? `0${(+x).toString(16)}`
          : (+x).toString(16)).join('')
      }`;
    }
    return '';
  },
  HEXtoHSL(str) {
    if (str.match(rgx.vHex)) {
      const v = this.HEXtoRGB(str)
        .replace(rgx.rgba, '')
        .split(',')
        .map(x => +x)
        .join(',');

      return this.RGBtoHSL(v ?? '');
    }
    return '';
  },
  RGBtoHSL(str) {
    if (str.match(rgx.vRGB)) {
      const 
        v = str
          .replace(rgx.rgba, '')
          .split(',')
          .map(x => +x),
        
        c = v.slice(0, 3)
          .map(x => x / 255),
            
        cmax = Math.max(...c),
        cmin = Math.min(...c),
        d = cmax - cmin,

        h = d === 0 ? 0
        : cmax == c[0] ? 60 * (((c[1] - c[2]) / d) % 6)
        : cmax == c[1] ? 60 * (((c[2] - c[0]) / d) + 2)
        : 60 * (((c[0] - c[1]) / d) + 4),
                        
        H = h < 0 ? 360 + h : h,
        L = (cmax + cmin) / 2,
        S = d === 0 ? 0 : d / (1 - Math.abs(2 * L - 1)),
            
        hsl = [
          H.toFixed(), 
          `${(S * 100).toFixed()}%`,
          `${(L * 100).toFixed()}%`
        ].join(', ');
  
      return `hsl(${hsl})`;
    }
    return '';
  },
  HSLtoRGB(str) {
    if (str.match(rgx.vHSL)) {
      const v = str
        .replace(rgx.hsla, '')
        .split(',')
        .map(x => +x);

      const 
        H = v[0],
        S = v[1] / 100,
        L = v[2] / 100,
        Z = (1 - Math.abs(2 * L - 1)) * S,
        X = Z * (1 - Math.abs((H / 60) % 2 - 1)),
        m = L - Z / 2,
        rgb = 
            (H >= 0 && H < 60 ? [Z, X, 0]
          : H >= 60 && H < 120 ? [X, Z, 0]
          : H >= 120 && H < 180 ? [0, Z, X]
          : H >= 180 && H < 240 ? [0, X, Z]
          : H >= 240 && H < 300 ? [X, 0, Z]
          : [Z, 0, X])
            .map(x => (Math.abs((x + m) * 255)).toFixed())
            .join(', ');

      return `rgb(${rgb})`;
    }
    return '';
  },
  HSLtoHEX(str) {
    return this.RGBtoHEX(this.HSLtoRGB(str).replace(rgx.space, ''));
  },
  alpha(str, toDecimal) {
    if (toDecimal) 
      return `${Math.round((parseInt(str, 16) / 255) * 1e3) / 1e3}`;
    const hex = Math.round(+str * 255);
    return hex < 16 ? `0${hex.toString(16)}` : hex.toString(16);
  },
  HEXAtoRGBA(str) {
    if (str.match(rgx.vHexa)) {
      const v = str.replace(rgx.hex, '');
      if (v.length === 4) {
        const 
          w = this.HEXtoRGB(v.substring(0, 3))
            .replace('rgb', 'rgba')
            .replace(')', ''),
          a = this.alpha(v.substring(3).repeat(2), true);
        return `${w}, ${a})`;
      }
      if (v.length === 8) {
        const 
          w = this.HEXtoRGB(v.substring(0, 6))
            .replace('rgb', 'rgba')
            .replace(')', ''),
          a = this.alpha(v.substring(6), true);
        return `${w}, ${a})`;
      }
    }
    return '';
  },
  RGBAtoHEXA(str) {
    if (str.match(rgx.vRGBA)) {
      const v = str.replace(rgx.rgba, '').split(',');
      const p = this.RGBtoHEX(v.slice(0, 3).join(','));
      const a = this.alpha(v[3]);
      return `${p}${a}`;
    }
    return '';
  },
  HEXAtoHSLA(str) {
    if (str.match(rgx.vHexa)) {
      const v = str.replace(rgx.hex, '');
      if (v.length === 4) {
        const 
          w = this.HEXtoHSL(v.substring(0, 3))
            .replace('hsl', 'hsla')
            .replace(')', ''),
          a = this.alpha(v.substring(3).repeat(2), true);
        return `${w}, ${a})`;
      }
      if (v.length === 8) {
        const 
          w = this.HEXtoHSL(v.substring(0, 6))
            .replace('hsl', 'hsla')
            .replace(')', ''),
          a = this.alpha(v.substring(6), true);
        return `${w}, ${a})`;
      }
    }
    return '';
  },
  RGBAtoHSLA(str) {
    if (str.match(rgx.vRGBA)) {
      const v = str.replace(rgx.rgba, '').split(',');
      const p = this.RGBtoHSL(v.slice(0, 3).join(','))
        .replace('hsl', 'hsla')
        .replace(')', '');
      return `${p}, ${Math.round(+v[3] * 1e3) / 1e3})`;
    }
    return '';
  },
  HSLAtoRGBA(str) {
    if (str.match(rgx.vHSLA)) {
      const v = str.replace(rgx.hsla, '').split(',');
      const p = this.HSLtoRGB(v.slice(0, 3).join(','))
        .replace('rgb', 'rgba')
        .replace(')', '');
      return `${p}, ${Math.round(+v[3] * 1e3) / 1e3})`;
    }
    return '';
  },
  HSLAtoHEXA(str) {
    if (str.match(rgx.vHSLA)) {
      const v = str.replace(rgx.hsla, '').split(',');
      const p = this.RGBtoHEX(this.HSLtoRGB(v.slice(0, 3).join(',')).replace(rgx.space, ''));
      const a = this.alpha(v[3]);
      return `${p}${a}`;
    }
    return '';
  }
};

const pfn = {
  color: '',
  system: '',
  returns: {},
  get toHex() {
    return this.system === 'hsl' ? fn.HSLtoHEX(this.color)
      : this.system === 'rgb' ? fn.RGBtoHEX(this.color)
      : null;
  },
  get toRGB() {
    return this.system === 'hsl' ? fn.HSLtoRGB(this.color)
      : this.system === 'hex' ? fn.HEXtoRGB(this.color)
      : null;
  },
  get toHSL() {      
    return this.system === 'rgb' ? fn.RGBtoHSL(this.color)
      : this.system === 'hex' ? fn.HEXtoHSL(this.color)
      : null;
  },
  get toHexa() {
    return this.system === 'hsla' ? fn.HSLAtoHEXA(this.color)
      : this.system === 'rgba' ? fn.RGBAtoHEXA(this.color)
      : null;
  },
  get toRGBA() {
    return this.system === 'hsla' ? fn.HSLAtoRGBA(this.color)
      : this.system === 'hexa' ? fn.HEXAtoRGBA(this.color)
      : null;
  },
  get toHSLA() {
    return this.system === 'rgba' ? fn.RGBAtoHSLA(this.color)
      : this.system === 'hexa' ? fn.HEXAtoHSLA(this.color)
      : null;
  },
  /**
   * @param {number} n 
   * @param {number} nf */
  hslValues(n, nf) {
    n ??= 0;
    let baseColor = '';

    if (this.system === 'hexa' || this.system === 'rgba') {
      baseColor = this.toHSLA.replace(rgx.hsla, '')
        .split(',')
        .map(e => +e);
    } else if (this.system === 'hsla' || this.system === 'hsl') {
      baseColor = this.color.replace(rgx.hsla, '')
        .split(',')
        .map(e => +e);
    } else {
      baseColor = this.toHSL.replace(rgx.hsla, '')
        .split(',')
        .map(e => +e);
    }

    if (nf === 0) {
      baseColor[nf] += n;
      baseColor[nf] =
          baseColor[nf] > 360 ? 360
        : baseColor[nf] < 0 ? 0
        : baseColor[nf];
      baseColor[nf] = Math.round(baseColor[nf]);
    } else if (nf === 3) {
      baseColor[nf] += n;
      baseColor[nf] = Math.round(baseColor[nf] * 1e3) / 1e3;
      baseColor[nf] =
          baseColor[nf] > 1 ? 1 
        : baseColor[nf] < 0 ? 0
        : baseColor[nf];
    } else {
      baseColor[nf] += n * 100;
      baseColor[nf] =
          baseColor[nf] > 100 ? 100 
        : baseColor[nf] < 0 ? 0
        : baseColor[nf];
      baseColor[nf] = Math.round(baseColor[nf]);
    }
    
    baseColor = baseColor.join(',');

    if (baseColor.match(rgx.vHSL) || baseColor.match(rgx.vHSLA)) {
      
      switch (this.system) {
        case 'hex':
          this.color = fn.HSLtoHEX(baseColor);
          break;
        case 'rgb':
          this.color = fn.HSLtoRGB(baseColor);
          break;
        case 'hsl':
          
          baseColor = baseColor.split(',');
          this.color = `hsl(${baseColor[0]}, ${baseColor[1]}%, ${baseColor[2]}%)`;
          break;
        case 'hexa':
          this.color = fn.HSLAtoHEXA(baseColor);
          break;
        case 'rgba':
          this.color = fn.HSLAtoRGBA(baseColor);
          break;
        case 'hsla':
          baseColor = baseColor.split(',');
          this.color = baseColor[3] ? `hsla(${baseColor[0]}, ${baseColor[1]}%, ${baseColor[2]}%, ${baseColor[3]})` : '';
          break;
      }
      return this.color;
    }
    return '';
  }
};

const hslMethods = (context, isCSS) => {
  const deletePProps = (x) => {
    delete x.hue;
    delete x.saturation;
    delete x.lightness;
    delete x.alpha;
  };

  /**
  @param {number} param 
  @param {number} fnN */
  const response = (param, fnN) => {
    const view = pfn.hslValues(param, fnN);
    const obj = {
      ...context[pfn.system](view),
      [isCSS ? 'toHex' : 'value']: view
    }
    deletePProps(obj);

    if (typeof param !== 'number')
      return Object.fromEntries(
        Object.keys(obj)
          .map(k => [k, ''])
      );

    return param ? obj : pfn.color;
  }

  const methods = {
    hue: (degree) => response(degree, 0),
    saturation: (percentage) => response(percentage, 1),
    lightness: (percentage) => response(percentage, 2),
    alpha: (percentage) => response(percentage, 3)
  };

  if (pfn.system === 'hex' || pfn.system === 'rgb' || pfn.system === 'hsl')
    delete methods.alpha;

  return methods;
};

const Kolorz = Object.freeze({
  css(color = '') {
    const CSSColorList = {
      aliceblue: '#F0F8FF',
      antiquewhite: '#FAEBD7',
      aqua: '#00FFFF',
      aquamarine: '#7FFFD4',
      azure: '#F0FFFF',
      beige: '#F5F5DC',
      bisque: '#FFE4C4',
      black: '#000000',
      blanchedalmond: '#FFEBCD',
      blue: '#0000FF',
      blueviolet: '#8A2BE2',
      brown: '#A52A2A',
      burlywood: '#DEB887',
      cadetblue: '#5F9EA0',
      chartreuse: '#7FFF00',
      chocolate: '#D2691E',
      coral: '#FF7F50',
      cornflowerblue: '#6495ED',
      cornsilk: '#FFF8DC',
      crimson: '#DC143C',
      cyan: '#00FFFF',
      darkblue: '#00008B',
      darkcyan: '#008B8B',
      darkgoldenrod: '#B8860B',
      darkgray: '#A9A9A9',
      darkgrey: '#A9A9A9',
      darkgreen: '#006400',
      darkkhaki: '#BDB76B',
      darkmagenta: '#8B008B',
      darkolivegreen: '#556B2F',
      darkorange: '#FF8C00',
      darkorchid: '#9932CC',
      darkred: '#8B0000',
      darksalmon: '#E9967A',
      darkseagreen: '#8FBC8F',
      darkslateblue: '#483D8B',
      darkslategray: '#2F4F4F',
      darkslategrey: '#2F4F4F',
      darkturquoise: '#00CED1',
      darkviolet: '#9400D3',
      deeppink: '#FF1493',
      deepskyblue: '#00BFFF',
      dimgray: '#696969',
      dimgrey: '#696969',
      dodgerblue: '#1E90FF',
      firebrick: '#B22222',
      floralwhite: '#FFFAF0',
      forestgreen: '#228B22',
      fuchsia: '#FF00FF',
      gainsboro: '#DCDCDC',
      ghostwhite: '#F8F8FF',
      gold: '#FFD700',
      goldenrod: '#DAA520',
      gray: '#808080',
      grey: '#808080',
      green: '#008000',
      greenyellow: '#ADFF2F',
      honeydew: '#F0FFF0',
      hotpink: '#FF69B4',
      indianred: '#CD5C5C',
      indigo: '#4B0082',
      ivory: '#FFFFF0',
      khaki: '#F0E68C',
      lavender: '#E6E6FA',
      lavenderblush: '#FFF0F5',
      lawngreen: '#7CFC00',
      lemonchiffon: '#FFFACD',
      lightblue: '#ADD8E6',
      lightcoral: '#F08080',
      lightcyan: '#E0FFFF',
      lightgoldenrodyellow: '#FAFAD2',
      lightgray: '#D3D3D3',
      lightgrey: '#D3D3D3',
      lightgreen: '#90EE90',
      lightpink: '#FFB6C1',
      lightsalmon: '#FFA07A',
      lightseagreen: '#20B2AA',
      lightskyblue: '#87CEFA',
      lightslategray: '#778899',
      lightslategrey: '#778899',
      lightsteelblue: '#B0C4DE',
      lightyellow: '#FFFFE0',
      lime: '#00FF00',
      limegreen: '#32CD32',
      linen: '#FAF0E6',
      magenta: '#FF00FF',
      maroon: '#800000',
      mediumaquamarine: '#66CDAA',
      mediumblue: '#0000CD',
      mediumorchid: '#BA55D3',
      mediumpurple: '#9370DB',
      mediumseagreen: '#3CB371',
      mediumslateblue: '#7B68EE',
      mediumspringgreen: '#00FA9A',
      mediumturquoise: '#48D1CC',
      mediumvioletred: '#C71585',
      midnightblue: '#191970',
      mintcream: '#F5FFFA',
      mistyrose: '#FFE4E1',
      moccasin: '#FFE4B5',
      navajowhite: '#FFDEAD',
      navy: '#000080',
      oldlace: '#FDF5E6',
      olive: '#808000',
      olivedrab: '#6B8E23',
      orange: '#FFA500',
      orangered: '#FF4500',
      orchid: '#DA70D6',
      palegoldenrod: '#EEE8AA',
      palegreen: '#98FB98',
      paleturquoise: '#AFEEEE',
      palevioletred: '#DB7093',
      papayawhip: '#FFEFD5',
      peachpuff: '#FFDAB9',
      peru: '#CD853F',
      pink: '#FFC0CB',
      plum: '#DDA0DD',
      powderblue: '#B0E0E6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#FF0000',
      rosybrown: '#BC8F8F',
      royalblue: '#4169E1',
      saddlebrown: '#8B4513',
      salmon: '#FA8072',
      sandybrown: '#F4A460',
      seagreen: '#2E8B57',
      seashell: '#FFF5EE',
      sienna: '#A0522D',
      silver: '#C0C0C0',
      skyblue: '#87CEEB',
      slateblue: '#6A5ACD',
      slategray: '#708090',
      slategrey: '#708090',
      snow: '#FFFAFA',
      springgreen: '#00FF7F',
      steelblue: '#4682B4',
      tan: '#D2B48C',
      teal: '#008080',
      thistle: '#D8BFD8',
      tomato: '#FF6347',
      turquoise: '#40E0D0',
      violet: '#EE82EE',
      wheat: '#F5DEB3',
      white: '#FFFFFF',
      whitesmoke: '#F5F5F5',
      yellow: '#FFFF00',
      yellowgreen: '#9ACD32'
    };
    const found = Object.keys(CSSColorList).find(e => e === color);

    pfn.system = 'css';
    
    return Object.freeze({
      toHex: found ? CSSColorList[found] : '',
      ...this.hex(found ? CSSColorList[found] : '')
    });
  },
  hex(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';

    let hslM = hslMethods(this);

    if (pfn.system === 'css')
      hslM = hslMethods(this, true);

    pfn.system = 'hex';

    return Object.freeze({
      get toRGB() { return pfn.toRGB; },
      get toHSL() { return pfn.toHSL; },
      ...hslM
    });
  },
  hexa(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';
    pfn.system = 'hexa';

    return Object.freeze({
      get toRGBA() { return pfn.toRGBA; },
      get toHSLA() { return pfn.toHSLA; },
      ...hslMethods(this)
    });
  },
  rgb(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';
    pfn.system = 'rgb';

    return Object.freeze({
      get toHex() { return pfn.toHex; },
      get toHSL() { return pfn.toHSL; },
      ...hslMethods(this)
    });
  },
  rgba(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';
    pfn.system = 'rgba';

    return Object.freeze({
      get toHexa() { return pfn.toHexa; },
      get toHSLA() { return pfn.toHSLA; },
      ...hslMethods(this)
    });
  },
  hsl(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';
    pfn.system = 'hsl';

    return Object.freeze({
      get toHex() { return pfn.toHex; },
      get toRGB() { return pfn.toRGB; },
      ...hslMethods(this)
    });
  },
  hsla(color = '') {
    pfn.color = color.replace(rgx.space, '') ?? '';
    pfn.system = 'hsla';

    return Object.freeze({
      get toHexa() { return pfn.toHexa; },
      get toRGBA() { return pfn.toRGBA; },
      ...hslMethods(this)
    });
  }
});

export default Kolorz;
