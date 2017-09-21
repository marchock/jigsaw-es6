import Elements from './elements';

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


const DEFAULT_STORE = {
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

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const GET_ELEMENTS = 'GET_ELEMENTS';
export const CREATE_TILES_ARRAY = 'CREATE_TILES_ARRAY';
export const RESET_TILES_ARRAY = 'RESET_TILES_ARRAY';
export const GET_STOP_POINT = 'GET_STOP_POINT';
export const GET_MAX_GRID_COLUMNS = 'GET_MAX_GRID_COLUMNS';
export const GET_CONTAINER_MIN_WIDTH = 'GET_CONTAINER_MIN_WIDTH';
export const UPDATE_CONTAINER_WIDTH = 'UPDATE_CONTAINER_WIDTH';
export const GET_BREAKPOINTS_LIST = 'GET_BREAKPOINTS_LIST';
export const GET_BREAKPOINTS_LIST_INDEX = 'GET_BREAKPOINTS_LIST_INDEX';
export const UPDATE_TILE_PARAM = 'UPDATE_TILE_PARAM';
export const UPDATE_REBUILD_ALL_TILES = 'UPDATE_REBUILD_ALL_TILES';
export const RESET_GRID = 'RESET_GRID';
export const UPDATE_TILES_LENGTH = 'UPDATE_TILES_LENGTH';
export const UPDATE_MAX_GRID_ROWS = 'UPDATE_MAX_GRID_ROWS';
export const CREATE_GRID_ROWS_COLUMNS = 'CREATE_GRID_ROWS_COLUMNS';


// TODO: make this a singleton

import EventEmitter from 'events';
import Animations from './animations';
import Tiles from './tiles';
import Utils from './utils';
import BrowserResize from './browser-resize';
import Grid from './grid';

class JigStore extends EventEmitter {
  constructor() {
    super();
    this.store = DEFAULT_STORE;
  }

  get() {
    return this.store;
  }

  dispatch(Action, payload) {


    switch(Action) {

      case UPDATE_SETTINGS: {
        this.store = {...this.store, settings: {...payload}};
        break;
      }

      case GET_ELEMENTS: {
        this.store = { ...this.store, elements: new Elements(this.store, new Animations(this.store))};
        break;
      }

      case CREATE_TILES_ARRAY: {
        const tiles = Tiles.buildArray(this.store);
        this.store = { ...this.store, tiles: [ ...tiles ] };
        break;
      }

      case RESET_TILES_ARRAY: {
        const tiles = Tiles.reset([ ...this.store.tiles ]);
        this.store = { ...this.store, tiles: [ ...tiles ] };
        break;
      }

      case GET_STOP_POINT: {
        this.store = { ...this.store, stopPoint: Utils.updateStopPoint(this.store) };
        break;
      }

      case GET_MAX_GRID_COLUMNS: {
        this.store = { ...this.store, maxGridColumns: Utils.calNumberOfColumns(this.store) };
        break;
      }

      case RESET_GRID: {
        this.store = { ...this.store, grid: [] };
        break;
      }

      case UPDATE_REBUILD_ALL_TILES: {
        this.store = { ...this.store, rebuildAllTiles: payload };
        break;
      }


      case UPDATE_TILE_PARAM: {
        const tile = Tiles.updateTileParam(this.store);
        this.store = { ...this.store, tile: { ...tile } };
        break;
      }

      case GET_CONTAINER_MIN_WIDTH: {
        const container = { ...this.store.container };
        this.store = { ...this.store,
          container: { ...container, minWidth: BrowserResize.findSmallestBreakpointPosition(this.store)}
        };
        break;
      }

      case UPDATE_CONTAINER_WIDTH: {
        const container = { ...this.store.container };
        const width = BrowserResize.getWidth(Elements.getContainerWidth, this.store);
        this.store = { ...this.store,
          container: { ...container, width: width}
        };
        break;
      }

      case GET_BREAKPOINTS_LIST: {
        const breakpoints = { ...this.store.breakpoints };
        this.store = { ...this.store,
          breakpoints: { ...breakpoints, list: BrowserResize.createBreakPointList(this.store)}
        };
        break;
      }

      case GET_BREAKPOINTS_LIST_INDEX: {
        const breakpoints = { ...this.store.breakpoints };
        this.store = { ...this.store,
          breakpoints: { ...breakpoints, index: BrowserResize.findBreakPointListIndex(this.store)}
        };
        break;
      }

      case UPDATE_TILES_LENGTH: {
        this.store = { ...this.store, tiles: Tiles.calTotalNumber(this.store) };
        break;
      }

      case UPDATE_MAX_GRID_ROWS: {
        this.store = { ...this.store, maxGridRows: Grid.calMaxGridRows(this.store) };
        break;
      }

      case CREATE_GRID_ROWS_COLUMNS: {
        const grid = Grid.createRowsAndCols(this.store);
        this.store = { ...this.store, grid: [ ...grid ] };
        break;
      }
    }

    console.log(this.store);
  }
}

export let jigStore = new JigStore();
