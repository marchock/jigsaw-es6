import OptionHTML from './OptionHTML';

class Elements {
  constructor(store) {

    const { container, jigsaw, tiles } = store.settings.classnames;

    this.settings = store.settings;

    // pass body element through settings to be able to test
    this.$body = document.getElementsByTagName("body")[0];
    this.$container = this.$body.querySelector(container);

    // TODO: this not in use
    this.$parent = this.$container.querySelector(jigsaw);
    this.$children = [...this.$parent.querySelectorAll(tiles)];

    this.initLoadBtn(store);
  }

  initLoadBtn(store) {
    let { load } = store.settings;
    if (!load.btn) return;

    this.$btnLoadMore = document.createElement("div");
    this.t = document.createTextNode("Load More");
    this.$btnLoadMore.appendChild(this.t);
    this.$btnLoadMore.setAttribute("class", "load-more");
    this.$btnLoadMore.addEventListener('click', OptionHTML.addMore.bind(null, store));

    if (this.settings.load.animate && !this.settings.load.framerate) {
      //setDefault value
      this.settings.load.framerate = 16;
    }

    this.$container.parentNode.insertBefore(this.$btnLoadMore, this.$container.nextSibling);
  }

  /* Update container element height
   *
   * @param: {object} - store : {{object} - element}
   *
   * @return: {VOID}
   * */
  static updateContainerHeight({elements, settings, tile}, gridMaxRows) {
    const { showGutter, modifyTileHeight } = settings;
    const maxRows = gridMaxRows;
    const height = showGutter
      ? (maxRows * modifyTileHeight)
      : ((maxRows * modifyTileHeight) - tile.padding);

    if (elements) {
      elements.$container.style.height = `${height}px`;
    }
  }

  /* Get container width
   *
   * @param: {object} - store
   *
   * @return: {number}
   * */
  static getContainerWidth(store) {
    return (store.elements.$container)
      ? getComputedStyle(store.elements.$container)
      : getComputedStyle(store.elements.$body);
  }

  /* Resize tiles width to fill the remaining space of the container
   *
   * @param: {number} - containerWidth
   * @param: {number} - tileWidth
   * @param: {number} - maxGridColumns
   * @param: {number} - padding
   *
   * @return: {number}
   * */
  static tileResize(containerWidth, tileWidth, maxGridColumns, padding) {
    return (tileWidth > containerWidth)
        ? (tileWidth * maxGridColumns) - padding
        : tileWidth;
  }


  /* Update tile element with updated parameters
   *
   * @param: {object} - store
   *
   * @return: {VOID}
   * */
  static renderTiles(store) {

    let { startLoop, load } = store.settings;
    const containerWidth = Elements.getContainerWidth(store);
    let start = store.rebuildAllTiles ? 0 : startLoop;

    for (let i = start; i < store.stopPoint; i += 1) {
      // if tile option is resize then width is calculated to fit...
      let { cssWidth, cssHeight, l, t, display } = store.tiles[i];
      let w = this.tileResize(containerWidth, cssWidth, store.maxGridColumns);

      store.elements.$children[i].style.width = w + "px";
      store.elements.$children[i].style.height = cssHeight + "px";
      store.elements.$children[i].style.left = l + "px";
      store.elements.$children[i].style.top = `${t}px`;
      store.elements.$children[i].style.display = display;

      //console.log('getTileElements', load.animate)

      if (load.animate) {
        addClass(store.elements.$children[i], "animate");
      }
    }
  }


  /* Hide load more button
   *
   * @return: {VOID}
   * */
  static hideButton() {
    document.querySelector('.load-more').style.display = "none";
  }

}

export default Elements;



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

// const removeClass = (ele, cls) => {
//   if (hasClass(ele, cls)) {
//     var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
//     ele.className = ele.className.replace(reg, ' ');
//   }
// };