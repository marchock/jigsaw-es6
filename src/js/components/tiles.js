import Utils from './utils';
import Grid from './grid';
import Elements from './elements';

/* Tiles
 * @Class
 */
class Tiles {

  /* Build
  *
  *  @param: {object} - store
  *
  *  @return: VOID
  * */
  static build(store) {
    store.tilesLength = Tiles.calTotalNumber(store);
    store.maxGridRows = Grid.calMaxGridRows(store);
    store.grid = Grid.createRowsAndCols(store);
    Tiles.jigsawEngine(store);
  }

  /* Calculate the position and size for each tile
   *
   *  @param: {object} - store
   *
   *  @return: VOID
   * */
  static jigsawEngine(store) {
    // fits tiles into a grid layout
    let row = 0;
    let col = 0;
    let tc = 0;

    /*
     * search grid for empty points to fit many tiles
     */
    for (let i = 0; i < store.tilesLength; i += 1) {

      tc = Tiles.fitTileToGrid(store, tc, row, col);

      /**
       * Update array counters
       *
       * tracks the position of the grid by row and column
       * starts from left to right
       */
      if (col < (store.maxGridColumns - 1)) {
        col += 1;

      } else {
        col = 0;
        row += 1;
        store.grid = Tiles.doesGridRequireNewRow(store, row, i)
      }

      // stop point reached
      if (!store.tiles[tc] || tc === store.stopPoint) {
        Elements.getTileElements(store, tc, row, col);
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
        if (store.grid.length === row) {
          store.grid = Grid.newRow(store);
        }
        store.tilesLength += 1;
      }
    }
    store.grid = Grid.removeEmptyRows(store);
  }


  /* fitTileToGrid
   *
   * - Find a space to fit the tile into the grid
   * - Update the grid the space has been filled
   * - Update tile with new parameters
   *
   * @param: {object} - store
   * @param: {number} - tc
   * @param: {number} - row
   * @param: {number} - col
   *
   * @return: {number} - tiles counter
   *
   * */
  static fitTileToGrid(store, tc, row, col) {
    const gridPointIsEmpty = !Grid.spaceAvailable(store, row, col);
    const tileIsCreated = !store.tiles[tc].created;
    const tileCanFitInsideGrid = Grid.hasSpace(store, tc, row, col);

    let updateTile = true;

    if (gridPointIsEmpty) {
      if (tileIsCreated) {
        if (tileCanFitInsideGrid) {
          store.grid = Grid.update(store, tc, row, col);
        } else {
          Tiles.searchForTile(store, tc, row, col);
          updateTile = false;
        }
      } else {
        tc += 1;
        Tiles.searchForTile(store, tc, row, col);
        updateTile = false;
      }

      if (updateTile) {
        store.tiles[tc] = Tiles.updateTile(store, tc, row, col);
        tc += 1;
      }
    }
    return tc;
  }

  /* If grid is full and more tiles remaining then add a new grid row
   *
   *  @param: {object} - store
   *  @param: {number} - row
   *  @param: {number} - i
   *
   *  @return: {array} - grid
   * */
  static doesGridRequireNewRow(store, row, i) {
    if (i < (store.tilesLength - 1)) {
      if (!Grid.spaceAvailable(store, row)) {
        store.grid = Grid.newRow(store);
      }
    }
    return store.grid;
  }

  /* Search for a tile to fit inside grid position
   *
   *  @param: {object} - store
   *  @param: {number} - index
   *  @param: {number} - row
   *  @param: {number} - column
   *
   *  @return: VOID
   * */
  static searchForTile(store, index, row, column) {
    // search for a tile to fit inside grid position row and column
    for (let i = index; i < store.stopPoint; i += 1) {

      if (!store.tiles[i].created) {
        if (Grid.hasSpace(store, i, row, column)) {
          store.grid = Grid.update(store, i, row, column);
          store.tiles[i] = Tiles.updateTile(store, i, row, column);
          break;
        }
      }
    }
  }

  /* Update tile with new parameters
  *
  *  @param: {object} - store
  *  @param: {number} - index
  *  @param: {number} - row
  *  @param: {number} - column
  *
  *  @return: {object} - tile with updated parameters
  * */
  static updateTile(store, index, row, column) {
    // showGutter: if guttering is false then the padding removed must be divided evenly across all tiles

    const padding = Utils.calPadding(store);
    const tileWidth = Utils.getTileWidth(store, padding);
    const tileHeight = Utils.getTileHeight(store, padding);

    // clone tile
    const cloneTile = {...store.tiles[index],
      created: true,
      t: Utils.calTop(store, padding, row),
      l: Utils.calLeft(store, padding, column),
      cssWidth: Utils.calTileWidth(store, index, tileWidth),
      cssHeight: Utils.calTileHeight(store, index, tileHeight),
    };

    // TODO: this seems to be wrong and should update tile.height
    // investigate and see where would the right implementation should go.
    store.settings.modifyTileHeight = tileHeight;

    return { ...cloneTile };
  }

  /* Reset tiles
  *
  *  @param: {array} - tiles
  *
  *  @return: {array}
  * */
  static reset(tiles) {
    return tiles.map(tile => {
      tile.created = false;
      tile.display = 'block';
      return tile;
    });
  }

  /* Calculates the total number of 1x1 tiles within the tiles object
   *
   *  @param: {object} - store: { {number} - stopPoint, {array} = tiles }
   *
   *  @return: {number} - total number of tiles
   * */
  static calTotalNumber({stopPoint, tiles}) {
    return Array.apply(null, {length: stopPoint})
      .map(Number.call, Number)
      .reduce((acc, i) => {
        acc += (tiles[i].width * tiles[i].height);
        return acc;
      }, 0);
  }

  /* Update tile parameters
   *
   *  @param: {object} - store
   *
   *  @return: {object} - tile parameters
   * */
  static updateTileParam(store) {
    const { tile } = store.settings.breakpoints[store.breakpoints.index];
    const clone = { ...store.tile };

    return {
      ...clone,
      padding: tile.padding,
      height: tile.height,
      width: Utils.calTileWidthByContainerWidth(store.container.width, tile.width, store.maxGridColumns)
    }
  }

  /* Create a new tiles array with specific parameters
   *
   *  @param: {object} - store
   *
   *  @return: {array} - tiles
   * */
  static buildArray(store) {
    const $elements = store.elements.$children;
    const tiles = Utils.getClassNames($elements, store.settings);

    return tiles.map(tile => {

      let tileSize = store.settings.tile
        .find(ts => tile.classname.split(' ')
        .find(string => string === ts.classname));

      return {
        width: tileSize.w,
        height: tileSize.h,
        top: 0,
        left: 0,
        cssWidth: 0,
        cssHeight: 0,
        classname: tile.classname || '',
        created: false,
        display: 'block',
        html: ''
      }
    });
  }

  /* Add more tiles
   *
   *  @param: {object} - store
   * */
  static addMore(store) {

    // framerate defualt value is null
    if (store.settings.load.framerate) {
      store.settings.load.animate = false;
    }

    switch (store.settings.select.option) {

      case "html":
        if (store.loadMoreTiles) {
          store.stopPoint += store.settings.load.index;

        } else {
          // hide load more button
          // store.elements.hide("loadMore");
          Elements.hideButton();
          store.stopPoint = store.tiles.length;
        }

        store.settings.startLoop += store.settings.load.index;


        Tiles.build(store);

        break;

      case "json":
        //   if (store.loadMoreTiles) {
        //     store.stopPoint += store.settings.load.index;
        //
        //   } else {
        //       // hide load more button
        //     store.elements.hide("loadMore");
        //     store.stopPoint = store.tiles.length;
        //   }
        //
        // store.settings.startLoop += store.settings.load.index;
        //
        // store.elements.createHTMLElements();
        //
        // store.showMore();
        break;
    }
  }
}

export default Tiles;


