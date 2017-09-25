import Elements from './elements';

import Store from './Store';
import {GridSetup} from './grid';
import {browserResize} from './browser-resize';
import {Tiles} from './tiles';

const store = Store;
const grid = GridSetup();
const tiles = Tiles(grid);

class OptionHTML {

  constructor(settings) {
    OptionHTML.updateStore(settings);
    OptionHTML.event();
  }

  static updateStore(settings) {
    store.settings = settings;
    store.elements = new Elements(store);
    store.tiles = tiles.createTileArray(store);
    store.stopPoint = OptionHTML.updateStopPoint(store);
  }

  static event() {
    const update = browserResize(store);
    window.addEventListener('resize', () => update());
    setTimeout(() => {update();}, 300);
  }

  static update(store) {
    tiles.reset(store);
    grid.setup(store);
    OptionHTML.jigsawEngine(store);
  }

  /* Calculate the position and size for each tile
   *
   *  @param: {object} - store
   *
   *  @return: VOID
   * */
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
        Elements.renderTiles(store);
        // Do not rebuild all tiles if more tile are added, only rebuild
        // all tiles when browser is re-sized.
        store.rebuildAllTiles = false;
        break;
      }


      /**
       * Update grid array
       *
       * tracks the position of the grid by row and column
       * starts from left to right
       *
       * Example:
       * (1) is a grid point filled
       * (0) is a grid point is empty
       *
       * [[1, 1, 1, 1, 1, 1]]
       * [[1, 1, 1, 1, 1, 1]]
       * [[1, 1, 0, 0, 0, 0]]
       * [[0, 0, 0, 0, 0, 0]]
       * [[0, 0, 0, 0, 0, 0]]
       * [[0, 0, 0, 0, 0, 0]]
       * [[0, 0, 0, 0, 0, 0]]
       *
       */
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
      Elements.updateContainerHeight(store, rows)
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
      Elements.hideButton();
      store.stopPoint = store.tiles.length;
    }

    store.settings.startLoop += store.settings.load.index;
    OptionHTML.jigsawEngine(store);
  }

  static updateStopPoint({settings, elements}) {
    return (settings.stopPoint > elements.$children.length) ? elements.$children.length : settings.stopPoint
  }
}

export default OptionHTML;
