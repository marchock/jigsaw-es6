/* Component: Browser Resize
 *
 * Updates container width and tracks which breakpoint the browser size fits and then passes it to the
*/

import Elements from './elements';
import OptionHTML from './OptionHTML';
import { calNumberOfColumns, resetTiles, updateTileParam } from './tiles';


export const browserResize = (store) => {
  store.container.minWidth = findSmallestBreakpointPosition(store);
  store.breakpoints.list = createBreakPointList(store);

  return () => {
    // should i create an action list ?
    store.container.width = getWidth(Elements.getContainerWidth, store);
    store.breakpoints.index = findBreakPointListIndex(store);
    store.maxGridColumns = calNumberOfColumns(store);
    store.tile = updateTileParam(store);
    store.rebuildAllTiles = true;
    store.tiles = resetTiles(store.tiles);

    // Trigger for a new render
    OptionHTML.update(store);
  }
};


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
 * @return {number}
 */
const getWidth = (func, store) => {
  const containerWidth = func(store);
  return (containerWidth > store.container.minWidth) ? containerWidth : store.container.minWidth;
};


/** Return the smallest breakpoint position in the array
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