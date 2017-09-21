import Utils from './utils';
import Elements from './elements';

/* Tiles
 * @Class
 */
class Tiles {

  /* Search for a tile to fit inside grid position
   *
   *  @param: {object} - store
   *  @param: {number} - index
   *  @param: {number} - row
   *  @param: {number} - column
   *
   *  @return: VOID
   * */
  static searchForTile(store, index, grid) {
    // search for a tile to fit inside grid position row and column
    for (let i = index; i < store.stopPoint; i += 1) {
      const tile = store.tiles[i];
      if (!tile.created) {
        if (grid.hasSpaceFor(tile)) {
          store.tiles[i] = Tiles.updateTile(store, i, grid);
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
  static updateTile(store, index, grid) {
    // showGutter: if guttering is false then the padding
    // removed must be divided evenly across all tiles

    const { padding, tileWidth, tileHeight } = Tiles.getTileParam(store, grid);
    const  { row, column } = grid.currentPoint();

    // TODO: this seems to be wrong and should update tile.height
    // investigate and see where would the right implementation should go.
    store.settings.modifyTileHeight = tileHeight;

    return {...store.tiles[index],
      created: true,
      t: Utils.calTop(store, padding, row),
      l: Utils.calLeft(store, padding, column),
      cssWidth: Utils.calTileWidth(store, index, tileWidth),
      cssHeight: Utils.calTileHeight(store, index, tileHeight),
    };
  }

  static getTileParam(store, grid) {
    const padding = Utils.calPadding(store, grid.getMaxColumns());
    return {
      padding,
      tileWidth: Utils.getTileWidth(store, padding),
      tileHeight: Utils.getTileHeight(store, padding),
    }
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
    if (store.settings.load.framerate) {
      store.settings.load.animate = false;
    }

    if (store.loadMoreTiles) {
      store.stopPoint += store.settings.load.index;
    } else {
      Elements.hideButton();
      store.stopPoint = store.tiles.length;
    }

    store.settings.startLoop += store.settings.load.index;
    Tiles.jigsawEngine(store);
  }
}

export default Tiles;