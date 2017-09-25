
const Grid = () => {
  /**
   * Grid array
   *
   * Tracks the position of the grid by row and column
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
  let array = [];
  let row = 0;
  let column = 0;
  let maxGridColumns = 0;
  let maxGridRows = 0;
  let store = null;


  return {

    /** Setup grid
     *
     * @param {object} s - store
     * @return {void}
     */
    setup(s) {
      store = s;
      this.setupActionList().forEach(action => action());
    },

    /** Create an actions list to setup the grid
     *
     * @return {array}
     */
    setupActionList() {
      return [
        this.reset,
        this.calNumberOfColumns,
        this.calMaxGridRows,
        this.createRowsAndCols.bind(this),
      ]
    },

    /** Reset grid
     *
     * @return {void}
     */
    reset() {
      array = [];
      row = 0;
      column = 0;
    },

    /** Increment to the next column or row
     *
     * @return {void}
     */
    nextPoint(index) {
      if (column < (store.maxGridColumns - 1)) {
        column += 1;

      } else {
        column = 0;
        row += 1;

        if (index < (store.tilesLength - 1)) {
          if (!this.isRowAvailable(row)) {
            this.addNewRow();
          }
        }
      }
    },

    /** Calculate the number or columns required
     *
     * @return {void}
     */
    calNumberOfColumns() {
      const { tile } = store.settings.breakpoints[store.breakpoints.index];
      maxGridColumns = Math.floor(store.container.width / tile.width);
    },

    /** Calculate the number of rows required
     *
     * @return {void}
     */
    calMaxGridRows() {
      maxGridRows = Math.round(store.tilesLength / maxGridColumns);
    },

    /** Create maximum rows and columns inside the grid
     *
     * @return {void}
     */
    createRowsAndCols() {
      for (let row = 0; row < maxGridRows; row += 1) {
        // if grid row does not have an array then
        // create an array to represent columns
        if (!array[row]) {
          array[row] = this.createColumns(maxGridColumns);
        }
      }
    },

    /** Update grid array that a tile will fit within a specific area
     *
     * @param {object} tile
     */
    update(tile) {
      const { width, height } = tile;

      for (let i = 0; i < height; i += 1) {
        for (let ii = 0; ii < width; ii += 1) {
          array[row + i][column + ii] = 1;
        }
      }
    },

    /** Calculate the number of rows required
     *
     * @return {void}
     */
    newRowRequired() {
      if (array.length === row) {
        this.addNewRow();
      }
    },

    /** Add a new row to the grid array
     *
     * @return {void}
     */
    addNewRow() {
      array[array.length] = this.createColumns(maxGridColumns);
    },

    /** If every column is empty then remove the row from the grid
     *
     * @return {boolean}
     */
    removeEmptyRows(func) {
      const newArray = array.filter((col) => {
        return col.find((boolean => boolean));
      });

      array = [ ...newArray ];
      func(array.length);
    },

    /** If grid point is empty return the callback
     *
     * @return {callback}
     */
    pointIsEmpty(callback) {
      if (!array[row][column]) {
        return callback(this.hasSpaceFor.bind(this));
      }
    },

    /** Return current row and column
     *
     * @return {object}
     */
    currentPoint() {
      return { row, column };
    },

    /** Return maximum columns
     *
     * @return {number}
     */
    getMaxColumns() {
      return maxGridColumns;
    },

    /** Return maximum rows
     *
     * @return {number}
     */
    getMaxRows() {
      return array.length;
    },

    /** Create a new row of columns
     *
     * @return {object}
     */
    createColumns(columns) {
      return new Array(columns).fill(0);
    },

    /** If there is a space available for a tile
     *
     * @return {boolean}
     */
    isSpaceAvailable() {
      return array[row][column];
    },

    /** If a there is a row available for a new tile
     *
     * @return {boolean}
     */
    isRowAvailable() {
      return array[row];
    },

    /** Checks if a tile can fit in the current point of the grid
     *
     * @return {boolean}
     */
    hasSpaceFor(tile) {
      const { width, height } = tile;
      let spaceAvailable = 0;

      for (let i = 0; i < height; i += 1) {
        for (let ii = 0; ii < width; ii += 1) {

          if ((column + ii) < maxGridColumns) {
            // Add another row to fit tile
            if (array.length <= (row + i)) {
              array[array.length] = this.createColumns(maxGridColumns);
            }

            // does grid have space for tile ( 0 is yes and 1 in no)
            if (array[row + i][column + ii]) spaceAvailable += 1;
          } else {
            spaceAvailable += 1;
          }
        }
      }

      if (!spaceAvailable) {
        this.update(tile);
      }
      return !spaceAvailable;
    },
  }
};

export default Grid;
