
export const GridSetup = () => {
  let array = [];
  let maxGridColumns = 0;
  let maxGridRows = 0;
  let store = null;
  let row = 0;
  let column = 0;

  return {

    setup(s) {
      store = s;

      this
        .reset()
        .calNumberOfColumns()
        .calMaxGridRows()
        .createRowsAndCols();
    },

    reset() {
      array = [];
      row = 0;
      column = 0;
      return this;
    },

    pointIsEmpty(callback) {
      if (!array[row][column]) {
        return callback(this.hasSpaceFor.bind(this));
      }
    },

    next(index) {
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

    currentPoint() {
      return { row, column };
    },

    calNumberOfColumns() {
      const { tile } = store.settings.breakpoints[store.breakpoints.index];
      maxGridColumns = Math.floor(store.container.width / tile.width);
      return this;
    },

    calMaxGridRows() {
      maxGridRows = Math.round(store.tilesLength / maxGridColumns);
      return this;
    },

    createRowsAndCols() {
      for (let row = 0; row < maxGridRows; row += 1) {
        // if grid row does not have an array then
        // create an array to represent columns
        if (!array[row]) {
          array[row] = this.createColumns(maxGridColumns);
        }
      }
      return this;
    },

    getMaxColumns() {
      return maxGridColumns;
    },

    getMaxRows() {
      return array.length;
    },

    createColumns(columns) {
      return new Array(columns).fill(0);
    },

    isSpaceAvailable() {
      return array[row][column];
    },

    isRowAvailable() {
      return array[row];
    },

    update(tile) {
      const { width, height } = tile;

      for (let i = 0; i < height; i += 1) {
        for (let ii = 0; ii < width; ii += 1) {
          array[row + i][column + ii] = 1;
        }
      }
    },

    newRowRequired() {
      if (array.length === row) {
        this.addNewRow();
      }
    },

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

    addNewRow() {
      array[array.length] = this.createColumns(maxGridColumns);
    },

    removeEmptyRows(func) {
      const newArray = array.filter((col) => {
        return col.find((boolean => boolean));
      });

      array = [ ...newArray ];
      func(array.length);
    }
  }
};
