import Elements from './elements';
import Tiles from './tiles';
import BrowserResize from './browser-resize';
import Animations from './animations';
import Utils from './utils';
import Store from './Store';

class OptionHTML {

  constructor(settings) {
    const store = Store;
    store.settings = settings;
    store.elements = new Elements(store, new Animations(store));
    store.tiles = Tiles.buildArray(store);
    store.stopPoint = Utils.updateStopPoint(store);
    new BrowserResize(store);
  }
}

export default OptionHTML;