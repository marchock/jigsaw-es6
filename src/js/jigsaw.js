import Settings from './components/settings';
// import Elements from './components/elements';
// import Tiles from './components/tiles';
// import BrowserResize from './components/browser-resize';
// import Grid from './components/grid';
// import Animations from './components/animations';
import { getData } from './components/utils';
import OptionHTML from './components/OptionHTML';

/* Responsive grid layouts
 * @Class
 */
class Jigsaw {

  /* Create Jigsaw
   * @param {object} options
   */
  constructor(options) {
    // copy options into settings
    this.settings = Object.assign(Settings, options);
    this.settings.stopPoint = this.settings.load.index;
    this.settings.eof = this.settings.load.index;

    this.init(this.settings.select.option);
  }

  /* select which option to load
   * @param {object} options
   */
  init(option) {
    switch (option) {
    case "html":
        // this.html();
        new OptionHTML(this.settings);
        break;
    case "json":
        // this.json();
        break;
    }
  }

  /* Load data from HTML
   */
  html() {
    const $elements = this.elements.getChildren();

    let classNames = Array.from($elements).map((element) => {
      let string = element.getAttribute("class");
      string = string.replace(this.settings.classnames.tiles, "");
      string = string.trim();
      return { classname: string };
    });

    this.tiles.setup(classNames);
    this.browserResize.update();
  }

  /* Load data from JSON
   */
  json() {
    this.settings.stopPoint = this.settings.load.index;
    this.settings.startLoop = 0;

    if (this.settings.select.url) {
      getData({url: this.settings.select.url})
        .then(data => {
            let obj = JSON.parse(data);
            this.createTiles(obj.tiles);
        })
        .catch(error => {
            console.log(error);
        });

    } else if (this.settings.select.data) {
        this.createTiles(this.settings.select.data);
    }
  }

  /* create tiles
   * @param {object} data
   */
  createTiles(data) {
    this.dataCached = data;

    /* setup tiles
     * @param {array} this.dataCached
     * @param {function} callback when setup is completed
     */
    this.tiles.setup(this.dataCached, () => {
      this.elements.createHTMLElements(this.dataCached);
      this.browserResize.update();
    });
  }
}

export default Jigsaw;
