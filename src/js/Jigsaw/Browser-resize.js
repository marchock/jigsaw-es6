
import DOMElements from './DOMElements';
import Jigsaw from '../jigsaw';
import { calNumberOfColumns, resetTiles, updateTileParam } from './tiles';


const BrowserResize = (store) => {
  store.container.minWidth = findSmallestBreakpointPosition(store);
  store.breakpoints.list = createBreakPointList(store);

  return () => {
    // TODO: should an action list be create ?
    store.container.width = getWidth(DOMElements.getContainerWidth, store);
    store.breakpoints.index = findBreakPointListIndex(store);
    store.maxGridColumns = calNumberOfColumns(store);
    store.tile = updateTileParam(store);
    store.rebuildAllTiles = true;
    store.tiles = resetTiles(store.tiles);

    // Trigger for a new render
    Jigsaw.update(store);
  }
};

export default BrowserResize;


/** Return a list of breakpoint positions
 *
 * @param {object} store
 * @return {array}
 *
 * @example array
 *  [
 *   [320, 479],
 *   [480, 1199],
 *   [1200, 10000],
 *  ]
 *
 */
const createBreakPointList = ({settings, container}) => {
  return settings.breakpoints.reduce((acc, breakpoint, index) => {
    const endPosition = settings.breakpoints[index+1]
      ? settings.breakpoints[index+1].position
      : container.maxWidth;

    acc.push([breakpoint.position, endPosition]);
    return acc;
  }, []);
};


/** Find a breakpoint in the array that the container width is within the
 * boundary and return an index
 *
 * @param {object} store
 * @return {number}
 */
const findBreakPointListIndex = ({breakpoints, container}) => {
  return breakpoints.list
    .reduce((accumulator, breakpoint, index) =>
        (breakpoint[1] >= container.width && breakpoint[0] < container.width)
          ? (accumulator = index)
          : accumulator,
      0);
};

/** Return container width no smaller than the smallest breakpoint position
 *
 * @param {function} func
 * @param {object} store
 * @return {number}
 */
const getWidth = (func, store) => {
  const containerWidth = func(store);
  return (containerWidth > store.container.minWidth) ? containerWidth : store.container.minWidth;
};

/** Return the smallest breakpoint position in the array
 *
 * @param {object} store
 * @return {number}
 */
const findSmallestBreakpointPosition = (store) => {
  const { breakpoints } = store.settings;

  return breakpoints
    .reduce((accumulator, breakpoint) => (accumulator > breakpoint.position)
      ? (accumulator = breakpoint.position)
      : accumulator,
      store.container.maxWidth
    );
};