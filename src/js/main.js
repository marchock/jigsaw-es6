require('../css/main.scss');
import "babel-polyfill";

//import data from '../data/tiles.json';
import Jigsaw from './jigsaw';

/***********************************
 * HTML
 **********************************/
new Jigsaw({

  select: {
    option: "html",
  },

  load: {
    btn: true,
    index: 20,
    animate: false,
    framerate: 16
  },

  breakpoints: [
    {
      position: 320,
      tile: {
        width: 120,
        height: 120,
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



/***********************************
 * JSON LOCAL FILE
 **********************************/
// new Jigsaw({
//
//   element: document.querySelector('.container'),
//
//   select: {
//      option: "json",
//      //data: data.tiles
//      url: 'http://localhost:8080/api/tiles'
//   },
//
//   load: {
//      btn: true,
//      index: 20,
//      animate: true,
//      framerate: 32
//   },
//
//   breakpoints: [
//      {
//          position: 320,
//          tile: {
//              width: 120,
//              height: 120,
//              padding: 8
//          }
//      },
//      {
//          position: 480,
//          tile: {
//              width: 160,
//              height: 130,
//              padding: 10
//          }
//      },
//      {
//          position: 1200,
//          tile: {
//              width: 200,
//              height: 180,
//              padding: 18
//          }
//      }
//   ],
//
//   tile: [
//      {
//          classname: "largeitem",
//          w: 2,
//          h: 2
//      },
//      {
//          classname: "smallitem",
//          w: 1,
//          h: 1
//      }
//   ],
//
//   tileTemplate: (data , parent) => {
//      var e = document.createElement("div");
//         //  p = document.createElement("p"),
//         //  t = document.createTextNode("text");
//
//
//      e.setAttribute("class", "item " + data.classname);
//      e.innerHTML = data.html;
//      parent.appendChild(e);
//   }

//});
