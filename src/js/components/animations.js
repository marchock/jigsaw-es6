import { addClass, removeClass } from './utils';

/* Animate tiles
 * @Class
 */
class Animations {
  constructor(settings) {
    this.settings = settings;
  }

  /* Start animation
   */
  start(e) {
    this.ele = e;
    this.counter = this.settings.startLoop;
    this.loop();
  }

  /* Check if all tiles have been animated
   */
  loop() {
    if (this.counter < this.settings.stopPoint) {
      this.jigsawTimer(1000 / this.settings.load.framerate);
    } else {
      this.removeClassFromElements();
    }
  }

  /* Remove class name from tile element
   */
  removeClassFromElements() {
    let { startLoop, stopPoint } = this.settings;
    for (let i = startLoop; i < stopPoint; i += 1) {
      removeClass(this.ele[i], "animate start");
    }
  }

  /* Add class name to tile element
   */
  addClassToTiles() {
      addClass(this.ele[this.counter], "start");
      this.counter += 1;
      this.loop();
  }

  /* Set a delay to add class to the next tile
   * @param {number} time
   */
  jigsawTimer(time) {
    clearTimeout(this.jTimer);

    this.jTimer = setTimeout(() => {
        this.addClassToTiles();
    }, time);
  }

}

export default Animations;
