require('../css/main.scss');
import "babel-polyfill";
import Jigsaw from './jigsaw';

new Jigsaw({

  load: {
    btn: true,
    index: 20,
  },

  breakpoints: [
    {
      position: 320,
      tile: {
        width: 200,
        height: 200,
        padding: 8
      }
    },
    {
      position: 480,
      tile: {
        width: 160,
        height: 130,
        padding: 10
      }
    },
    {
      position: 1200,
      tile: {
        width: 200,
        height: 180,
        padding: 20
      }
    }
  ],

  tile: [
    {
      classname: "largeitem",
      w: 2,
      h: 2
    },
    {
      classname: "smallitem",
      w: 1,
      h: 1
    }
  ]
});