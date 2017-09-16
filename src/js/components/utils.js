

export default class Utils {

  // store.tile.padding, showGutter, store.maxGridColumns
  static calPadding({ settings, tile, maxGridColumns}) {
    return settings.showGutter ? (tile.padding / 2) : (tile.padding / maxGridColumns);
  }

  // calNumberOfColumns :: Number -> Number -> Number
  static calNumberOfColumns(store) {
    const { tile } = store.settings.breakpoints[store.breakpoints.index];
    return Math.floor(store.container.width / tile.width);
  }

  // calTileWidthByPageWidth :: Number -> Number -> Number -> Number
  static calTileWidthByContainerWidth(containerWidth, tileWidth, numOfCol) {
    return (tileWidth += Math.floor((containerWidth - (tileWidth * numOfCol)) / numOfCol));
  }

  // showGutter, padding, row, tileHeight
  static calTop({settings, tile}, padding, row) {
    return settings.showGutter ? (row * tile.height) + padding : (row * (tile.height + padding));
  }

  // calTileWidthByPageWidth :: Boolean -> Number -> Number -> Number
  static calLeft({settings, tile}, padding, column) {
    return settings.showGutter ? (column * tile.width) + padding : (column * (tile.width + padding));
  }

  static getTileWidth({settings, tile}, padding) {
    return settings.showGutter ? tile.width : (tile.width + padding);
  }

  static getTileHeight({settings, tile}, padding) {
    return settings.showGutter ? tile.height : (tile.height + padding);
  }

  /* Calculate a tiles width in pixels
  *
  *  @param padding: number
  *  @param tileWidth: number - a tile width in columns
  *  @param tileWidthPX: number - a tile width in pixels
  *
  * */
  static calTileWidth({ tiles, tile }, index, tileWidthPX) {
    return ((tileWidthPX * tiles[index].width) - tile.padding);
  }

  static calTileHeight({ tiles, tile }, index, tileHeightPX) {
    return (tileHeightPX * tiles[index].height) - tile.padding;
  }

  static loadMoreTiles({ stopPoint, load }, tiles) {
    return (stopPoint + load.index) < tiles.length;
  }

  static updateStopPoint({settings, elements}) {
    return (settings.stopPoint > elements.$children.length) ? elements.$children.length : settings.stopPoint
  }

  static getClassNames($elements, settings) {
    return Array.from($elements).map((element) => {
      let string = element.getAttribute("class");
      string = string.replace(settings.classnames.tiles, "");
      string = string.trim();
      return ({ classname: string });
    });
  }
}



const getComputedStyle = (ele) => {
  const comStyle = document.defaultView.getComputedStyle(ele, "");
  // parseInt removes the "px" at the end and converts to a number
  return parseInt(comStyle.getPropertyValue("width"), 10);
};


const hasClass = (ele, cls) => {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

const addClass = (ele, cls) => {
  if (!hasClass(ele, cls)) {
    ele.className += " " + cls;
  }
};

const removeClass = (ele, cls) => {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
};


const getData = (obj) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(obj.method || "GET", obj.url);
    if (obj.headers) {
        Object.keys(obj.headers).forEach(key => {
            xhr.setRequestHeader(key, obj.headers[key]);
        });
    }

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
        } else {
            reject(xhr.statusText);
        }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
};

export {
  getComputedStyle,
  addClass,
  removeClass,
  getData
};
