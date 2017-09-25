import BrowserResize from './Browser-resize';
import DEFAULT_SETTINGS from './Settings';
import DOMElements from './DOMElements';
import Tiles from './Tiles';
import Store from './Store';
import Grid from './Grid';

const store = Store;
const grid = Grid();
const tiles = Tiles(grid);

/* Responsive grid layouts
 * @Class
 */
class Jigsaw {
  /* Create Jigsaw
   * @param {object} options
   */
  constructor(options) {
    // copy options into settings
    let settings = Object.assign(DEFAULT_SETTINGS, options);
    settings.stopPoint = settings.load.index;
    settings.eof = settings.load.index;

    Jigsaw.updateStore(settings);
    Jigsaw.event();
  }

  static updateStore(settings) {
    store.settings = settings;
    store.elements = new DOMElements(store);
    store.tiles = tiles.createTileArray(store);
    store.stopPoint = Jigsaw.updateStopPoint(store);
  }

  static event() {
    const update = BrowserResize(store);
    window.addEventListener('resize', () => update());
    setTimeout(() => {update();}, 300);
  }

  static update(store) {
    tiles.reset(store);
    grid.setup(store);
    Jigsaw.jigsawEngine(store);
  }

  /** Calculate the position and size for each tile
   *
   *  @param: {object} - store
   *
   *  @return: VOID
   */
  static jigsawEngine(store) {
    /*
     * Loop through grid to find an empty point.
     */
    for (let i = 0; i < store.tilesLength; i += 1) {

      grid.pointIsEmpty(
        tiles.addTile(store)
      );

      /**
       * Break the loop when it reaches the stopPoint.
       *
       * Notes:
       *  - stopPoint is not the end of the array
       *  - the stopPoint controls the number of tiles to be rendered
       *
       */
      if (tiles.stopPointHasLanded(store)) {
        DOMElements.renderTiles(store);
        // Do not rebuild all tiles if more tile are added, only rebuild
        // all tiles when browser is re-sized.
        store.rebuildAllTiles = false;
        break;
      }


      grid.nextPoint(i);

      /**
       * Update grid
       *
       * if tile counter has not reached end of count and for loop
       * counter (i) is equal to or greater than this.numOfTiles
       * then a new grid row is to be crated and this.numOfTiles plus 1
       */
      if (tiles.isGreaterThanGrid(store, i)) {
        grid.newRowRequired();
        store.tilesLength += 1;
      }
    }


    /**
     * Search for empty rows at the end of the grid array and remove it
     * Then update the tile container height. The total number of rows
     * Is used in calculation for container height.
     */
    grid.removeEmptyRows(rows =>
      DOMElements.updateContainerHeight(store, rows)
    );
  }


  /** Add more tiles
   *
   *  @param: {object} - store
   * */
  static addMore(store) {

    if (store.loadMoreTiles) {
      store.stopPoint += store.settings.load.index;
    } else {
      DOMElements.hideButton();
      store.stopPoint = store.tiles.length;
    }

    store.settings.startLoop += store.settings.load.index;
    Jigsaw.jigsawEngine(store);
  }

  static updateStopPoint({settings, elements}) {
    return (settings.stopPoint > elements.$children.length) ? elements.$children.length : settings.stopPoint
  }
}

export default Jigsaw;
