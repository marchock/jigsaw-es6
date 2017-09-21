import Elements from './elements';
import Tiles from './tiles';
import BrowserResize from './browser-resize';
import Animations from './animations';
import Utils from './utils';
import Store from './Store';
import {GridSetup} from './grid';

const grid = GridSetup();

class OptionHTML {

  constructor(settings) {
    const store = Store;
    store.settings = settings;
    store.elements = new Elements(store, new Animations(store));
    store.tiles = Tiles.buildArray(store);
    store.stopPoint = Utils.updateStopPoint(store);

    const update = BrowserResize.init(store, BrowserResize);
    window.addEventListener('resize', () => update());
    setTimeout(() => {update();}, 300);
  }

  static update(store) {
    store.tilesLength = Tiles.calTotalNumber(store);
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

    let tc = 0;

    /*
     * Loop through grid to find an empty point.
     */
    for (let i = 0; i < store.tilesLength; i += 1) {

      const tile = store.tiles[tc];

      grid.pointIsEmpty((hasSpaceFor) => {
        if (!tile.created) {
          if (hasSpaceFor(tile)) {
            store.tiles[tc] = Tiles.updateTile(store, tc, grid);
            tc += 1;
          } else {
            Tiles.searchForTile(store, tc, grid);
          }
        } else {
          tc += 1;
          Tiles.searchForTile(store, tc, grid);
        }
      });

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
      grid.next(i);

      /**
       * Break the loop when it reaches the stopPoint.
       *
       * Notes:
       *  - stopPoint is not the end of the array
       *  - the stopPoint controls the number of tiles to be rendered
       *
       */
      if (!store.tiles[tc] || tc === store.stopPoint) {
        Elements.renderTiles(store, tc, grid.currentPoint());

        // If more tiles to be rendered this will prevent
        // them from being built again
        store.rebuildAllTiles = false;
        break;
      }

      /**
       * Update grid
       *
       * if tile counter has not reached end of count and for loop
       * counter (i) is equal to or greater than this.numOfTiles
       * then a new grid row is to be crated and this.numOfTiles plus 1
       */
      if (tc < store.stopPoint && i >= (store.tilesLength - 1)) {
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
}

export default OptionHTML;