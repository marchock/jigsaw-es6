
export const Tiles = (grid) => {
  let index = 0;

  return {

    next() {
      index += 1;
    },

    reset(store) {
      index = 0;
      store.tilesLength = calTotalNumber(store);
    },

    getTile(store) {
      return store.tiles[index];
    },

    getIndex() {
      return index;
    },

    pauseLoop(store) {
      return !store.tiles[index] || index === store.stopPoint;
    },

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



    /** Search for a tile to fit inside grid position
     *
     *  @param: {object} - store
     *  @param: {number} - index
     *  @param: {array} - grid
     *
     *  @return: VOID
     * */
    searchForTile(store) {
      // search for a tile to fit inside grid position row and column
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


    /** Update tile with new parameters
     *
     *  @param: {object} - store
     *  @param: {number} - index
     *  @param: {number} - row
     *  @param: {number} - column
     *
     *  @return: {object} - tile with updated parameters
     * */
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

    /** Create new tiles array
     *
     *  @param: {object} - store
     *  @return: {array} - tiles
     *
     */
    createTileArray(store) {
      const { elements, settings } = store;
      const getClassNamesFromElements = getClassNames(settings);
      const matchTileSettingsWithClassName = matchTileSettings(settings);

      return elements.$children
        .map(getClassNamesFromElements)
        .map(matchTileSettingsWithClassName)
        .map(createTileObject);
    }
  }
};

/** Match tile settings to class name and return an object
 * to get the tile height and width
 *
 *  @param: {object} - settings
 *  @return: {object} - tile
 *
 *  Currying
 **/
const matchTileSettings = (settings) => {
  return (tile) => settings.tile
    .find(ts => ts.classname === tile);
};


/** Create tile object
 *
 *  @param: {object} - tile
 *  @return: {object} - tile
 *
 *  Currying
 **/
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
 *  @param: {object} - tile
 *  @return: {object} - tile
 **/
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


/** Update tile parameters
 *
 *  @param: {object} - store
 *
 *  @return: {object} - tile parameters
 * */
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
 *  @param: {array} - tiles
 *  @return: {array} - tiles
 * */
export const resetTiles = (tiles) => {
  return tiles.map(tile => {
    tile.created = false;
    tile.display = 'block';
    return tile;
  });
};

/** Calculates the total number of 1x1 tiles within the tiles object
 *
 *  @param: {object} - store
 *  @return: {number} - total number of tiles
 * */
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
 *  @param
 *  @return
 */
const getTileParam = (store, grid) => {
  const padding = calPadding(store, grid.getMaxColumns());
  return {
    padding,
    tileWidth: getTileWidth(store, padding),
    tileHeight: getTileHeight(store, padding),
  }
};

/**
 *
 *  @param
 *  @return
 */
const calTop = ({settings, tile}, padding, row) => {
  return settings.showGutter ? (row * tile.height) + padding : (row * (tile.height + padding));
};

/**
 *
 *  @param
 *  @return
 */
const calLeft = ({settings, tile}, padding, column) => {
  return settings.showGutter ? (column * tile.width) + padding : (column * (tile.width + padding));
};

/**
 *
 *  @param
 *  @return
 */
const getTileWidth = ({settings, tile}, padding) => {
  return settings.showGutter ? tile.width : (tile.width + padding);
};

/**
 *
 *  @param
 *  @return
 */
const getTileHeight = ({settings, tile}, padding) => {
  return settings.showGutter ? tile.height : (tile.height + padding);
};

/** Calculate a tiles width in pixels
 *
 *  @param padding: number
 *  @param tileWidth: number - a tile width in columns
 *  @param tileWidthPX: number - a tile width in pixels
 *
 */
const calTileWidth = ({ tiles, tile }, index, tileWidthPX) => {
  return ((tileWidthPX * tiles[index].width) - tile.padding);
};

/**
 *
 *  @param
 *  @return
 */
const calTileHeight = ({ tiles, tile }, index, tileHeightPX) => {
  return (tileHeightPX * tiles[index].height) - tile.padding;
};

/**
 *
 *  @param
 *  @return
 */
const calPadding = ({ settings, tile}, maxGridColumns) => {
  return settings.showGutter ? (tile.padding / 2) : (tile.padding / maxGridColumns);
};

/**
 *
 *  @param
 *  @return
 */
const calTileWidthByContainerWidth = (containerWidth, tileWidth, numOfCol) => {
  return (tileWidth += Math.floor((containerWidth - (tileWidth * numOfCol)) / numOfCol));
};

/**
 *
 *  @param
 *  @return
 */
export const calNumberOfColumns = (store) => {
  const { tile } = store.settings.breakpoints[store.breakpoints.index];
  return Math.floor(store.container.width / tile.width);
}