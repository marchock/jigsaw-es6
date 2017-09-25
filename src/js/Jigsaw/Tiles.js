
const Tiles = (grid) => {
  /**
   *
   */
  let index = 0;

  return {

    /** Increment tiles index by plus one
     *
     * @return: {void}
     */
    next() {
      index += 1;
    },

    /** Reset tiles
     *
     * @return: {void}
     */
    reset(store) {
      index = 0;
      store.tilesLength = calTotalNumber(store);
    },

    /** Is tiles counter greater than grid counter
     *
     * @return: {boolean}
     */
    isGreaterThanGrid(store, i) {
      return index < store.stopPoint && i >= (store.tilesLength - 1);
    },

    /** Return a tile at a specific index
     *
     * @return: {object}
     */
    getTile(store) {
      return store.tiles[index];
    },

    /** Return tiles index
     *
     * @return: {boolean}
     */
    getIndex() {
      return index;
    },

    /** Stop point has landed stop loop
     *
     * @param: {object} store
     * @return: {boolean}
     */
    stopPointHasLanded(store) {
      return !store.tiles[index] || index === store.stopPoint;
    },

    /** Add tile
     *
     * 1. Is tile created
     * 2. Is there space inside grid to fit current tile
     * 3. Update grid points where tile will fit or search for a tile that will fit
     * 4. Update tile parameters
     * 5. Next
     *
     * @param: {object} store
     * @return: VOID
     */
    addTile(store) {
      return () => {
        const tile = this.getTile(store);

        if (!tile.created) {
          if (grid.hasSpaceFor(tile)) {
            store.tiles[index] = this.updateTile(store, index);
            this.next();
          } else {
            this.searchForTile(store);
          }
        } else {
          this.next();
          this.searchForTile(store);
        }
      }
    },

    /** Search for a tile that can fit in the current grid point
     *
     * @param: {object} store
     * @return: VOID
     */
    searchForTile(store) {
      for (let i = index; i < store.stopPoint; i += 1) {
        const tile = store.tiles[i];
        if (!tile.created) {
          if (grid.hasSpaceFor(tile)) {
            store.tiles[i] = this.updateTile(store, i);
            break;
          }
        }
      }
    },

    /** Return new parameters for a tile
     *
     * @param: {object} store
     * @param: {number} tileIndex
     * @return: {object}
     */
    updateTile(store, tileIndex) {
      // showGutter: if guttering is false then the padding
      // removed must be divided evenly across all tiles

      const { padding, tileWidth, tileHeight } = getTileParam(store, grid);
      const  { row, column } = grid.currentPoint();

      // TODO: this seems to be wrong and should update tile.height
      // investigate and see where would the right implementation should go.
      store.settings.modifyTileHeight = tileHeight;

      return {...store.tiles[tileIndex],
        created: true,
        t: calTop(store, padding, row),
        l: calLeft(store, padding, column),
        cssWidth: calTileWidth(store, tileIndex, tileWidth),
        cssHeight: calTileHeight(store, tileIndex, tileHeight),
      };
    },

    /** Return a new tiles array
     *
     * @param: {object} - store
     * @return: {array} - tiles
     *
     */
    createTileArray(store) {
      const { elements, settings } = store;
      const getClassNamesFromElements = getClassNames(settings);
      const matchTileSettingsWithClassName = matchTileSettings(settings);

      // TODO: data is mutated, look for another solution
      return elements.$children
        .map(getClassNamesFromElements)
        .map(matchTileSettingsWithClassName)
        .map(createTileObject);
    }
  }
};

export default Tiles;

/** Match tile settings to class name and return an object
 * to get the tile height and width
 *
 * @param: {object} - settings
 * @return: {object} - tile
 *
 *  Currying
 */
const matchTileSettings = (settings) => {
  return (tile) => settings.tile
    .find(ts => ts.classname === tile);
};

/** Create tile object
 *
 * @param: {object} - tile
 * @return: {object} - tile
 *
 *  Currying
 */

const getClassNames = (settings) => {
  const classname = settings.classnames.tiles.replace('.', '');

  return (element) => (element
    .getAttribute('class')
    .replace(classname, '')
    .trim());
};

/**
 * Create tile object
 *
 * @param: {object} tile
 * @return: {object}
 */
const createTileObject = (tile) => {
  return {
    width: tile.w,
    height: tile.h,
    top: 0,
    left: 0,
    cssWidth: 0,
    cssHeight: 0,
    classname: tile.classname || '',
    created: false,
    display: 'block',
    html: '',
  }
};


/** Return tile parameters
 *
 * @param: {object} store
 * @return: {object}
 */
export const updateTileParam = (store) => {
  const { tile } = store.settings.breakpoints[store.breakpoints.index];
  const clone = { ...store.tile };

  return {
    ...clone,
    padding: tile.padding,
    height: tile.height,
    width: calTileWidthByContainerWidth(
      store.container.width,
      tile.width,
      store.maxGridColumns
    )
  }
};

/** Reset tiles
 *
 * @param: {array} tiles
 * @return: {array}
 */
export const resetTiles = (tiles) => {
  return tiles.map(tile => {
    tile.created = false;
    tile.display = 'block';
    return tile;
  });
};

/** Calculates the total number of 1x1 tiles within the tiles object
 *
 * @param: {object} store
 * @return: {number}
 */
const calTotalNumber = (store) => {
  const {stopPoint, tiles} = store;
  return Array.apply(null, {length: stopPoint})
    .map(Number.call, Number)
    .reduce((acc, i) => {
      acc += (tiles[i].width * tiles[i].height);
      return acc;
    }, 0);
};

/**
 *
 * @param {object} store
 * @param {object} grid
 * @return {object}
 */
const getTileParam = (store, grid) => {
  const padding = calPadding(store, grid.getMaxColumns());
  return {
    padding,
    tileWidth: getTileWidth(store, padding),
    tileHeight: getTileHeight(store, padding),
  }
};

/** Calculate a tile top position
 *
 * @param {object} store
 * @param {number} padding
 * @param {number} row
 * @return {number}
 */
const calTop = ({settings, tile}, padding, row) => {
  return settings.showGutter ? (row * tile.height) + padding : (row * (tile.height + padding));
};

/** Calculate a tile left position
 *
 * @param {object} store
 * @param {number} padding
 * @param {number} column
 * @return {number}
 */
const calLeft = ({settings, tile}, padding, column) => {
  return settings.showGutter ? (column * tile.width) + padding : (column * (tile.width + padding));
};

/** Return a tile width
 *
 * @param {object} store
 * @param {number} padding
 * @return {number}
 */
const getTileWidth = ({settings, tile}, padding) => {
  return settings.showGutter ? tile.width : (tile.width + padding);
};

/** Return a tile height
 *
 * @param {object} store
 * @param {number} padding
 * @return {number}
 */
const getTileHeight = ({settings, tile}, padding) => {
  return settings.showGutter ? tile.height : (tile.height + padding);
};

/** Calculate a tiles width in pixels
 *
 * @param {object} store
 * @param {number} index
 * @param {number} tileWidthPX
 * @return {number}
 */
const calTileWidth = ({ tiles, tile }, index, tileWidthPX) => {
  return ((tileWidthPX * tiles[index].width) - tile.padding);
};

/** Calculate a tiles height in pixels
 *
 * @param {object} store
 * @param {number} index
 * @param {number} tileHeightPX
 * @return {number}
 */
const calTileHeight = ({ tiles, tile }, index, tileHeightPX) => {
  return (tileHeightPX * tiles[index].height) - tile.padding;
};

/** Calculate tile padding
 *
 * @param {object} store
 * @param {number} maxGridColumns
 * @return {number}
 */
const calPadding = ({ settings, tile}, maxGridColumns) => {
  return settings.showGutter ? (tile.padding / 2) : (tile.padding / maxGridColumns);
};

/** Calculate tile width by container height
 *
 * @param {number} containerWidth
 * @param {number} tileWidth
 * @param {number} numOfCol
 * @return {number}
 */
const calTileWidthByContainerWidth = (containerWidth, tileWidth, numOfCol) => {
  return (tileWidth += Math.floor((containerWidth - (tileWidth * numOfCol)) / numOfCol));
};

/** Calculate the number of columns
 *
 * @param {object} store
 * @return {number}
 */
export const calNumberOfColumns = (store) => {
  const { tile } = store.settings.breakpoints[store.breakpoints.index];
  return Math.floor(store.container.width / tile.width);
};