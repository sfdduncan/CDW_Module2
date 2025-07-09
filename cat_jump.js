var sketch2 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var numCats = 7;
  var cats = [];
  var catImg;

  p.preload = function() {
    catImg = p.loadImage('imgbin_32657e30d0b4bbed2327cf89950da6cb.png');
  };

  p.setup = function() {
    var canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-2');
    for (var i = 0; i < numCats; i++) {
      cats.push(new Cat(p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = function() {
    p.background('#fff7f0');
    for (var i = 0; i < cats.length; i++) {
      cats[i].update();
      cats[i].display();
    }
  };

  p.mousePressed = function() {
    for (var i = 0; i < cats.length; i++) {
      cats[i].jumpTo(p.random(p.width), p.random(p.height));
    }
  };

  function Cat(x, y) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = x;
    this.targetY = y;
    this.t = 1; // progress from 0 to 1
    this.jumpDuration = 60;

    this.jumpTo = function(tx, ty) {
      this.startX = this.x;
      this.startY = this.y;
      this.targetX = tx;
      this.targetY = ty;
      this.t = 0;
    };

    this.update = function() {
      if (this.t < 1) {
        this.t += 1 / this.jumpDuration;
        let easeT = p.sin(this.t * p.PI); // arc easing
        this.x = p.lerp(this.startX, this.targetX, this.t);
        this.y = p.lerp(this.startY, this.targetY, this.t) - 80 * easeT;
      }
    };

    this.display = function() {
      p.imageMode(p.CENTER);
      p.image(catImg, this.x, this.y, 100, 100);
    };
  }
};

var myp5_2 = new p5(sketch2, 'canvas-container-2');
