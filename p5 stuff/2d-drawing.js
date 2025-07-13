// 2D Drawing Sketch - using p5.js instance mode
var sketch1 = function(p) {
  // All variables are scoped to this instance
  var canvasWidth = 800;
  var canvasHeight = 400;
  var gridSpacing = 40;
  var canvas;

  p.setup = function() {
    canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-1');
  };

  p.draw = function() {
    p.background('#90d5ff');
    drawGrid();
    drawPrimitives();
  };

  function drawGrid() {
    p.stroke(200);
    p.strokeWeight(1);
    for (var x = 0; x <= p.width; x += gridSpacing) {
      p.line(x, 0, x, p.height);
    }
    for (var y = 0; y <= p.height; y += gridSpacing) {
      p.line(0, y, p.width, y);
    }
  }

  function drawPrimitives() {
    // --- Maneki-neko (Lucky Cat) ---
    // Background
    p.background('#90d5ff');

    // --- Body (chubbier, bigger, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.beginShape();
    p.vertex(400, 340);
    p.bezierVertex(300, 370, 300, 210, 400, 180);
    p.bezierVertex(500, 210, 500, 370, 400, 340);
    p.endShape(p.CLOSE);

    // --- Head (bigger, rounder, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.beginShape();
    p.vertex(400, 120);
    p.bezierVertex(320, 120, 310, 210, 400, 210);
    p.bezierVertex(490, 210, 480, 120, 400, 120);
    p.endShape(p.CLOSE);

    // --- Ears (bigger, thin black outline) ---
    // Left ear outer
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.beginShape();
    p.vertex(350, 140);
    p.bezierVertex(320, 70, 390, 90, 380, 160);
    p.endShape(p.CLOSE);
    // Right ear outer
    p.beginShape();
    p.vertex(450, 140);
    p.bezierVertex(480, 70, 410, 90, 420, 160);
    p.endShape(p.CLOSE);
    // Left ear inner
    p.noStroke();
    p.fill(255, 180, 210);
    p.beginShape();
    p.vertex(355, 140);
    p.bezierVertex(330, 90, 385, 110, 377, 155);
    p.endShape(p.CLOSE);
    // Right ear inner
    p.beginShape();
    p.vertex(445, 140);
    p.bezierVertex(470, 90, 415, 110, 423, 155);
    p.endShape(p.CLOSE);

    // --- Face ---
    // Eyes (smiling, thin black outline)
    p.stroke(0);
    p.strokeWeight(3);
    p.noFill();
    p.arc(387, 170, 28, 14, Math.PI * 0.15, Math.PI * 0.85);
    p.arc(413, 170, 28, 14, Math.PI * 0.15, Math.PI * 0.85);
    // Nose (smaller, cuter, thin black outline)
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255, 170, 200);
    p.triangle(400, 175, 396, 180, 404, 180);
    // Mouth (thin black outline)
    p.noFill();
    p.stroke(0);
    p.strokeWeight(2);
    p.arc(400, 185, 18, 10, 0, Math.PI);
    p.arc(395, 185, 7, 5, Math.PI, Math.PI * 2);
    p.arc(405, 185, 7, 5, Math.PI, Math.PI * 2);
    // Whiskers (thin black outline)
    p.stroke(0);
    p.strokeWeight(2);
    p.line(380, 180, 340, 175);
    p.line(380, 185, 340, 185);
    p.line(380, 190, 340, 195);
    p.line(420, 180, 460, 175);
    p.line(420, 185, 460, 185);
    p.line(420, 190, 460, 195);

    // --- Collar (bigger, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(220, 40, 60);
    p.rect(355, 200, 90, 20, 12);

    // --- Medalion (bigger, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255, 220, 60);
    p.ellipse(400, 220, 36, 36);
    p.strokeWeight(2);
    p.ellipse(400, 220, 16, 16);
    p.noStroke();
    p.fill(255, 255, 180, 180);
    p.ellipse(408, 215, 8, 5);

    // --- Left Paw (bigger, chubbier, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.ellipse(330, 220, 54, 38);
    // Toes
    p.strokeWeight(2);
    p.arc(315, 230, 12, 8, 0, Math.PI);
    p.arc(330, 232, 16, 8, 0, Math.PI);
    p.arc(345, 230, 16, 8, 0, Math.PI);

    // --- Right Paw (bigger, chubbier, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.push();
    p.translate(470, 210);
    p.rotate(-0.6);
    p.ellipse(0, 0, 54, 38);
    // Toes
    p.strokeWeight(2);
    p.arc(-15, 10, 16, 8, 0, Math.PI);
    p.arc(0, 15, 16, 8, 0, Math.PI);
    p.arc(15, 10, 16, 8, 0, Math.PI);
    p.pop();

   

    // --- Feet (bigger, chubbier, thin black outline) ---
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.ellipse(370, 350, 36, 20);
    p.ellipse(430, 350, 36, 20);
    
  }
};

// Create the instance
var myp5_1 = new p5(sketch1, 'canvas-container-1'); 