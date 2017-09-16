const Store = {
  settings: null,
  elements: null,
  grid: [],
  tiles: [],
  stopPoint: 0,
  tile: {
    padding: 0,
    height: 0,
    width: 0
  },
  container: {
    height: 0,
    width: 0,
    gutter: 0,
    maxWidth: 10000,
    minWidth: 0,
  },
  breakpoints: {
    list: [],
    index: 0,
  },
  tilesLength: 0,
  maxGridColumns: 0,
  maxGridRows: 0,
  rebuildAllTiles: false,
  loadMoreTiles: false
};

export default Store;