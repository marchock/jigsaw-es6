import DEFAULT_SETTINGS from './components/settings';
import OptionHTML from './components/OptionHTML';

/* Responsive grid layouts
 * @Class
 */
class Jigsaw {
  /* Create Jigsaw
   * @param {object} options
   */
  constructor(options) {
    // copy options into settings
    this.settings = Object.assign(DEFAULT_SETTINGS, options);
    this.settings.stopPoint = this.settings.load.index;
    this.settings.eof = this.settings.load.index;
    new OptionHTML(this.settings);
  }
}

export default Jigsaw;
