import Elements from './elements';


class Grid {

  /* Reset Grid with new array
   *
   * @return: {array}
   * */
  static reset() {
    return [];
  }

  /* Calculate the maximum rows for the grid
  *
  * @param: {object} - store : { {number} - tilesLength, {number} - maxGridColumns}
  *
  * @return: number
  * */
  static calMaxGridRows({tilesLength, maxGridColumns}) {
      return Math.round(tilesLength / maxGridColumns);
  }

  /* Create row and columns for grid
   *
   * @param: {object} - store : {{array} - grid {number} - maxGridRows, {number} - maxGridColumns}
   *
   * @return: array - grid
   * */
  static createRowsAndCols({grid, maxGridRows, maxGridColumns}) {
    for (let row = 0; row < maxGridRows; row += 1) {
      // if grid row does not have an array then create an array to represent columns
      if (!grid[row]) {
        grid[row] = Grid.createColumns(maxGridColumns);
      }
    }
    return grid;
  }

  /* Create columns array
   *
   * @param: {number}
   *
   * @return: array
   * */
  static createColumns(columns) {
    return new Array(columns).fill(0);
  }

  /* At this grid point is there a space available to place a tile there
   *
   * @param: {object} - store: {{array} - grid}
   * @param: {number} - row
   * @param: {number} - column
   *
   * @return: {number} - returns 1 or 0
   * */
  static spaceAvailable({grid}, row, column) {
    return (arguments.length > 2) ? grid[row][column] : grid[row];
  }

  static hasSpace(store, tc, row, column) {
    const { grid, maxGridColumns, tiles } = store;
    const { width, height } = tiles[tc];
    let spaceAvailable = 0;

    for (let i = 0; i < height; i += 1) {
      for (let ii = 0; ii < width; ii += 1) {

        if ((column + ii) < maxGridColumns) {
          // Add another row to fit tile
          if (grid.length <= (row + i)) {
            grid[grid.length] = Grid.createColumns(maxGridColumns);
          }

          // does grid have space for tile ( 0 is yes and 1 in no)
          if (grid[row + i][column + ii]) spaceAvailable += 1;
        } else {
          spaceAvailable += 1;
        }
      }
    }
    return !spaceAvailable;
  }

  static update(store, tc, row, column) {
    const { grid, tiles } = store;
    const { width, height } = tiles[tc];

    for (let i = 0; i < height; i += 1) {
      for (let ii = 0; ii < width; ii += 1) {
        grid[row + i][column + ii] = 1;
      }
    }
    return grid;
  }

  static newRow({grid, maxGridColumns}) {
    grid[grid.length] = Grid.createColumns(maxGridColumns);
    return grid;
  }

  //store.grid, store.tile.padding, store.settings, store.maxGridColumns
  static removeEmptyRows(store) {
    const { showGutter, modifyTileHeight } = store.settings;
    let d = [];


    // search rows for empty columns
    for (let i = 0; i < store.grid.length; i += 1) {
        let c = 0;
        for (let ii = 0; ii < store.grid[i].length; ii += 1) {
          if (!store.grid[i][ii]) c += 1;
        }

        // if the entire row is false then add row number to be deleted
        if (c === store.maxGridColumns) d.push(i);

    }
    // reverse array to start the delete loop with the highest number
    d.reverse();

    for (let i = 0; i < d.length; i += 1) {
      store.grid.splice(d[i], 1);
    }

    let height = showGutter
        ? (store.grid.length * modifyTileHeight)
        : ((store.grid.length * modifyTileHeight) - store.tile.padding);


    Elements.updateContainerHeight(store, height);

    return store.grid;
  }
}

export default Grid;
