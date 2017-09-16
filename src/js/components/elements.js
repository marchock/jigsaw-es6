import { getComputedStyle, addClass } from './utils';
import Tiles from './tiles';

class Elements {
  constructor(store, animations) {

    const { container, jigsaw, tiles } = store.settings.classnames;

    this.settings = store.settings;
    this.animations = animations;

    // pass body element through settings to be able to test
    this.$body = document.getElementsByTagName("body")[0];
    this.$container = this.$body.querySelector(container);
    this.$parent = this.$container.querySelector(jigsaw);
    this.$children = this.$parent.querySelectorAll(tiles);

    this.initLoadBtn(store);
  }

  initLoadBtn(store) {
    let { load } = store.settings;
    if (!load.btn) return;

    this.$btnLoadMore = document.createElement("div");
    this.t = document.createTextNode("Load More");
    this.$btnLoadMore.appendChild(this.t);
    this.$btnLoadMore.setAttribute("class", "load-more");
    this.$btnLoadMore.addEventListener('click', Tiles.addMore.bind(null, store));

    if (this.settings.load.animate && !this.settings.load.framerate) {
      //setDefault value
      this.settings.load.framerate = 16;
    }

    this.$container.parentNode.insertBefore(this.$btnLoadMore, this.$container.nextSibling);
  }

  getChildren() {
    return this.$children;
  }

  show(string) {
    switch (string) {
      case "loadMore":
        if (this.settings.load.btn) this.$btnLoadMore.style.display = "block";
        break;
    }
  }

  hide(string) {
    switch (string) {

      case "loadMore":
        if (this.settings.load.btn) this.$btnLoadMore.style.display = "none";
        break;
    }
  }

  createHTMLElements(data) {
    var i = 0;

    if (data) {
      this.cachedData = data;
      this.removeChildren();
    }

    for (i = this.settings.startLoop; i < this.settings.stopPoint; i += 1) {
      this.settings.tileTemplate(this.cachedData[i], this.$parent);
    }
    this.updateChildren();
  }

  updateChildren() {
    this.$children = this.$parent.querySelectorAll("." + this.settings.classnames.tiles);
  }

  removeChildren() {
    this.$parent.innerHTML = "";
  }


  static updateContainerHeight({elements}, height) {
    if (elements) {
      elements.$container.style.height = `${height}px`;
    }
  }

  static getContainerWidth(store) {
    return (store.elements.$container)
      ? getComputedStyle(store.elements.$container)
      : getComputedStyle(store.elements.$body);
  }


  static tileResize(containerWidth, tileWidth, maxGridColumns, padding) {
    return (tileWidth > containerWidth)
        ? (tileWidth * maxGridColumns) - padding
        : tileWidth;
  }

  static getTileElements(store) {

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

  static hideButton() {
    document.querySelector('.load-more').style.display = "none";
  }

}

export default Elements;
