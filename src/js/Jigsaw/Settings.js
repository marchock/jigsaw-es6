
export default {
  showGutter: false,

  classnames: {
      container: ".container",
      jigsaw: ".jigsaw",
      tiles: ".item",
      btnLoadMore: ".load-more"
  },


  load: {
      btn: false,
      index: 20,
  },

  breakpoints: [
      {
          position: 320,
          tile: {
              width: 120,
              height: 120,
              padding: 8
          }
      }
  ],

  tile: [
      {
          classname: "smallitem",
          w: 1,
          h: 1
      },
      {
          classname: "largeitem",
          w: 2,
          h: 2
      },
      {
          classname: "longitem",
          w: 2,
          h: 1
      },
      {
          classname: "tallitem",
          w: 1,
          h: 2
      }
  ],

  modifyTileHeight: 0,

  stopPoint: 20,

  startLoop: 0
};
