/* Component: Browser Resize
 *
 * Updates container width and tracks which breakpoint the browser size fits and then passes it to the
*/

import Elements from './elements';
import Tiles from './tiles';
import Utils from './utils';
import Grid from './grid';

class BrowserResize {

  constructor(store) {
    store.container.minWidth = BrowserResize.findSmallestBreakpointPosition(store);
    store.breakpoints.list = BrowserResize.createBreakPointList(store);
    window.addEventListener('resize', BrowserResize.update.bind(null, store));
    setTimeout(() => {BrowserResize.update(store);}, 300);
  }

  /* This is triggered by browser resize event.
   * Finds the container width and breakpoint index
   *
   *
   * @param {Object} - store
   * @param {Number} - MIN_CONTAINER_WIDTH
   * @return {void}
   */
  static update(store) {
    const { getWidth, findBreakPointListIndex } = BrowserResize;
    store.container.width = getWidth(Elements.getContainerWidth, store);
    store.breakpoints.index = findBreakPointListIndex(store);
    store.maxGridColumns = Utils.calNumberOfColumns(store);
    store.tile = Tiles.updateTileParam(store);
    store.rebuildAllTiles = true;
    store.tiles = Tiles.reset(store.tiles);
    store.grid = Grid.reset();

    // Trigger for a new render
    Tiles.build(store);
  }

  // Return a list of breakpoint positions
  // @param { array } breakpoints
  // @return { array }
  //
  // @example array returned
  // [
  //   [320, 479],
  //   [480, 1199],
  //   [1200, 10000],
  // ]
  //
  static createBreakPointList({settings, container}) {
    return settings.breakpoints.reduce((acc, breakpoint, index) => {
      const endPosition = settings.breakpoints[index+1]
        ? settings.breakpoints[index+1].position
        : container.maxWidth;

      acc.push([breakpoint.position, endPosition]);
      return acc;
    }, []);
  }

  /* Return container width no smaller than the smallest breakpoint position
   * @return {number}
   */
  static getWidth(func, store) {
    const containerWidth = func(store);
    return (containerWidth > store.container.minWidth) ? containerWidth : store.container.minWidth;
  }

  /* Return the smallest breakpoint position in the array
   * @return {number}
   */
  static findSmallestBreakpointPosition(store) {
    const { breakpoints } = store.settings;

    return breakpoints
      .reduce((accumulator, breakpoint) => (accumulator > breakpoint.position)
        ? (accumulator = breakpoint.position)
        : accumulator,
        store.container.maxWidth
      );
  }

  /* Find a breakpoint in the array that the container width is within the
   * boundary and return an index
   * @return {number}
   */
  static findBreakPointListIndex({breakpoints, container}) {
    return breakpoints.list
      .reduce((accumulator, breakpoint, index) =>
        (breakpoint[1] >= container.width && breakpoint[0] < container.width)
          ? (accumulator = index)
          : accumulator,
      0);
  }
}
export default BrowserResize;
