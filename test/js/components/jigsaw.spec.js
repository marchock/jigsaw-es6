import Jigsaw from '../../../src/js/jigsaw';


let body = document.createElement('body');
body.innerHTML = `
<div class="container">
  <div class="jigsaw">
  </div>
</div>
`


let jigsaw = new Jigsaw({

  element: body.querySelector('.container'),

 select: {
     option: "json",
     //data: data.tiles
     url: 'http://localhost:8080/api/tiles'
 },

 load: {
     btn: true,
     index: 20,
     animate: true,
     framerate: 32
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
             padding: 18
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
 ],

 tileTemplate: (data , parent) => {
     var e = document.createElement("div");
        //  p = document.createElement("p"),
        //  t = document.createTextNode("text");


     e.setAttribute("class", "item " + data.classname);
     e.innerHTML = data.html;
     parent.appendChild(e);
 }

});





// let app = document.createElement('div');
//
// let settings = {
//   gameType: 'default',
//   opponent: 'player',
//   bestOf: 1
// };

describe('Jigsaw', () => {



  it('should exist"', () => {
    expect(jigsaw).to.exist;
  });

  describe('Breakpoints', () => {

    it('should calculate tile width, height and padding"', () => {


      console.log(jigsaw.tiles)
      console.log('tile width: ', jigsaw.settings.tileWidth);

      expect(jigsaw).to.exist;


    })

  });


  // let game = null;
  //
  // beforeEach(function() {
  //   game = new Game(app);
  // });

  // it('should have two players "player 1 and player 2"', () => {
  //   expect(game.player1.$ele.classList.contains('player-1')).to.be.true;
  //   expect(game.player2.$ele.classList.contains('player-2')).to.be.true;
  // });
  //
  // describe('#Player 1', () => {
  //   beforeEach(function() {
  //     game = new Game(app);
  //     game.start(settings);
  //   });
  //
  //   it('should have name "computer"', () => {
  //     expect(game.player1.name.player).to.equal('computer');
  //   });
  //
  //   describe('##Scoreboard', () => {
  //     beforeEach(function() {
  //       game = new Game(app);
  //     });
  //
  //     it('should display 1 dot if game is set to best of 1', () => {
  //       settings.bestOf = 1;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(1);
  //     });
  //
  //
  //     it('should display 2 dot if game is set to best of 3', () => {
  //       settings.bestOf = 3;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(2);
  //     });
  //
  //     it('should display 3 dot if game is set to best of 5', () => {
  //       settings.bestOf = 5;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(3);
  //     });
  //   });
  //
  // });
  //
  // describe('#Player 2', () => {
  //   beforeEach(function() {
  //     game = new Game(app);
  //   });
  //
  //   it('should have a name "computer" if "computer Vs computer""', () => {
  //     settings.opponent = 'computer';
  //     game.start(settings);
  //     expect(game.player2.name.player).to.be.oneOf(['computer', 'player']);
  //   });
  //
  //   it('should have a name "player" if "computer Vs player""', () => {
  //     game.start(settings);
  //     expect(game.player2.name.player).to.be.oneOf(['computer', 'player']);
  //   });
  //
  //
  //   describe('##Scoreboard', () => {
  //     beforeEach(function() {
  //       game = new Game(app);
  //     });
  //
  //     it('should display 1 dot if game is set to best of 1', () => {
  //       settings.bestOf = 1;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(1);
  //     });
  //
  //
  //     it('should display 2 dot if game is set to best of 3', () => {
  //       settings.bestOf = 3;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(2);
  //     });
  //
  //     it('should display 3 dot if game is set to best of 5', () => {
  //       settings.bestOf = 5;
  //       game.start(settings);
  //       let spanTags = game.player1.scoreboard.$ele.querySelectorAll('span');
  //       expect(spanTags.length).to.equal(3);
  //     });
  //   });
  // });
  //
  //
  //
  // describe('#Buttons', () => {
  //   beforeEach(function() {
  //     game = new Game(app);
  //   });
  //
  //   it('should have three buttons if "Rock Paper Scissors" Selected', () => {
  //     game.start(settings);
  //     let buttons = game.gameButtons.$ele.querySelectorAll('div');
  //     expect(game.gameButtons.handSigns).to.eql(['rock', 'paper', 'scissors']);
  //     expect(buttons.length).to.equal(3);
  //   });
  //
  //
  //   it('should have five buttons if "Rock Paper Scissors Lizard Spock" Selected', () => {
  //     //let s = Object.assign({}, settings);
  //     settings.gameType = 'variation';
  //     game.start(settings);
  //     let buttons = game.gameButtons.$ele.querySelectorAll('div');
  //     expect(game.gameButtons.handSigns).to.eql(['rock', 'paper', 'scissors', 'lizard', 'spock']);
  //     expect(buttons.length).to.equal(5);
  //   });
  // });


});
