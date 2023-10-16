const p5Container = document.querySelector('#p5-container');
let w = p5Container.clientWidth;
let h = p5Container.clientHeight;

let message = "Lea Naisberg is a designer & coder based in New York exploring the future of generative design & interactive technologies";
let fontSize;

let letters = [];
let hiddenLetters = [];


// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint

let engine;
let world;
let runner;
let thickness = 500;

//bodies
let boxes = [];
let box1;
let box2;
let myMouse;
let ground, leftWall, rightWall, ceiling;
let canvas;
let mConstraint;
let col = 255;
let myFont;

function preload(){
    myFont = loadFont("https://cdn.jsdelivr.net/gh/lnaisberg/hero/GeneralSans-Medium.ttf");
}


function setup() {
  engine = Engine.create();
  canvas = createCanvas(w, h);
  canvas.parent(p5Container);
  canvas.style('position', 'absolute');
  canvas.style('position', 0);
  canvas.style('z-index', 0);
  background(0);
  rectMode(CENTER);
  calcFontSize();
  textSize(fontSize);
  textFont(myFont);
  fillHiddenLetter();
  placeText();
  world = engine.world;
  
  ground = Bodies.rectangle(width/2, height + thickness/2, 3000, thickness, {isStatic: true});
  leftWall = Bodies.rectangle(0 - thickness/2, height/2, thickness, 3000, {isStatic: true});
  rightWall = Bodies.rectangle(width + thickness/2, height/2, thickness, 3000, {isStatic: true});
  ceiling = Bodies.rectangle(width/2, 0 - thickness/2, 3000, thickness, {isStatic: true});

  let myMouse = Mouse.create(canvas.elt);
  myMouse.pixelRatio = pixelDensity();
  
  let options = {
    mouse: myMouse
  }

  
  mConstraint = MouseConstraint.create(engine, options);

  Composite.add(world, [ground, leftWall, rightWall, ceiling, mConstraint]);
  runner = Runner.create();
  Runner.run(runner, engine);
}

function calcFontSize(){
    if(width > 1000){
      fontSize = width * 0.05;
    }
  
    if(width < 1000 && width > 700){
      fontSize = width * 0.06;
    }
  
    if(width < 700 && width > 450){
      fontSize = width * 0.02;
    }
  
    if(width < 300){
      fontSize = width * 0.02;
    }
}

function fillHiddenLetter(){
  for(let i = 0; i < message.length; i++){
    hiddenLetters.push(createVector(i, false));
  }
}

function placeText(){
  
    let posX = width * 0.15;
    let posY = height * 0.3;
    let maxLine = width * 0.70;
    let currentLine = 0;
    let lineCount = 1;
    textSize(fontSize); 
  
    for (let i = 0; i < message.length; i++) {
      let char = message.charAt(i);
      posX += textWidth(char);
      currentLine += textWidth(char);
      if(char == " "){
        let index = 1;
        let wordLength = 0;
        while(message.charAt(i + index) != " " && (i + index) < message.length){
          let char2 = message.charAt(i + index);
          wordLength += textWidth(char2);
          index++;
        }
        if(wordLength + currentLine > maxLine){
          posX = width * 0.15;
          posY += fontSize * 1.2;
          currentLine = 0;
          lineCount++;
        }
      }
    }
  
    // print(lineCount);
  
    let totalHeight = fontSize * 1.2 * (lineCount-1) + fontSize;
    posY = (height - totalHeight)/2 + fontSize/2;
  
  
    posX = width * 0.15;
    // posY = height * 0.3;
    currentLine = 0;
  
    push();
  
    for (let i = 0; i < message.length; i++) {
      let char = message.charAt(i);
  
      letters.push(new Letter(posX, posY, fontSize, message.charAt(i), hiddenLetters[i]));
      posX += textWidth(char);
      currentLine += textWidth(char);
  
      if(char == " "){
        let index = 1;
        let wordLength = 0;
        while(message.charAt(i + index) != " " && (i + index) < message.length){
          let char2 = message.charAt(i + index);
          wordLength += textWidth(char2);
          index++;
        }
        if(wordLength + currentLine > maxLine){
          posX = width * 0.15;
          posY += fontSize * 1.2;
          currentLine = 0;
        }
      }
      
    }
    pop();
  }

function draw() {
  background(0,10);
//   print(getFrameRate());
  push();
  pop();
  blendMode(DIFFERENCE);
  for(let i = 0; i < boxes.length; i++){
    boxes[i].show();
  }
  for (let i = 0; i < message.length; i++) {
    blendMode(BLEND);
    letters[i].show();
  }
}

function keyPressed() {
  if (key == "r" || key == "R") {
    for (let i = 0; i < message.length; i++) {
      letters[i].hide.y = false;
    }
  } else {

  }
}

function windowResized() {
  w = p5Container.clientWidth;
  h = p5Container.clientHeight;
//   w = windowWidth;
//   h = windowHeight;
  resizeCanvas(w, h);
  calcFontSize();
  background(0);
  letters = [];
  for(let i = 0; i < boxes.length; i ++){
    boxes[i].remove();
    // boxes[i].updateSize();
  }
  boxes = [];
  hiddenLetters = [];
  fillHiddenLetter();
  placeText();

  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
      width/2,
      height + thickness/2
    )
  );

  Matter.Body.setPosition(
   leftWall,
    Matter.Vector.create(
      0 - thickness/2,
      height/2
    )
  );

  Matter.Body.setPosition(
    rightWall,
     Matter.Vector.create(
       width + thickness/2,
       height/2
     )
   );

   Matter.Body.setPosition(
    ceiling,
     Matter.Vector.create(
      width/2,
      0 - thickness/2
     )
   );
}

//-------------------------------------------------------------

class Letter{
  constructor(x, y, fontSize, char, hide){
      this.x = x;
      this.y = y;
      this.fontSize = fontSize;
      this.char = char;
      fill(0);
      this.w = textWidth(this.char);
      this.hide = hide;
      this.hideFrame = 0;
      this.op = 0;
  }
  
  checkHover(){
      if(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y - this.fontSize/2 && mouseY < this.y + this.fontSize/2){
          if(this.char != " " && this.hide.y == false){
              boxes.push(new Box(this.x + this.w/2, this.y, this.w, this.fontSize, this.char));
              if(boxes.length > 70){
                 boxes[0].remove();
                 boxes.splice(0, 1);
              }
              
          }
          this.hide.y = true;
          hiddenLetters[this.hide.x].y = true; 
          this.hideFrame = frameCount;
      }
  }

  show(){
      textAlign(LEFT, CENTER);
      stroke(2);
      noFill();
      fill(235);
      noStroke();
      
      push();
      if(this.hide.y == false){
          fill(230);
          text(this.char, this.x, this.y);
          this.checkHover();
      } else if(frameCount > this.hideFrame + 100 && frameCount <= this.hideFrame + 355){
          fill(230, this.op);
          this.op++;
          text(this.char, this.x, this.y);
          if(this.op == 100){
              this.hide.y = false;
              hiddenLetters[this.hide.x].y = false; 
              this.op = 0;
          }
      }
      pop();
      blendMode(BLEND);
  }
}

//-------------------------------------------------------------

class Box{
  constructor(x, y, w, h, char){
      let options = {
          friction: 0.1,
          restitution: 1,
          frictionAir: 0.1,
          slop: 0,
          timeScale: 0.5
      }
      this.padding = h/15;
      this.x = x;
      this.y = y;
      this.char = char;
      this.w = w;
      this.fontSize = h;
      // this.fSize = h*2;
      this.txta = textHeight(this.char, h, 'yes', undefined, undefined);
    this.txtb = textHeight(this.char, h, undefined, 'yes', undefined);
      this.txta *= 1.6;
      this.txtb *= 1.6;
      this.txth = (this.txta + this.txtb);

      this.body = Bodies.rectangle(this.x, this.y, this.w + this.padding * 3, this.txta + this.txtb + this.padding * 3, options);
      Composite.add(world, this.body);


      //pick colors
      this.colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
      this.r = int(random(5));
      this.c = color(this.colors[this.r]);
      this.colors.splice(this.r, 1);
      this.r = int(random(4));
      this.c2 = color(this.colors[this.r]);
      
  }

  remove(){
      Composite.remove(world, this.body);
  }
  

  show(){
      fill(0);
      let pos = this.body.position;
      let angle = this.body.angle;
      push();
      fill(this.c);
      translate(pos.x, pos.y);
      rotate(angle);

      rectMode(CENTER); 

      fill(this.c);
      rect(0, 0, this.w + this.padding * 3, this.txta+ this.txtb+ this.padding * 3)

      fill(this.c2);
      // fill(255);
      textAlign(LEFT,CENTER);
      if(this.txta > this.fontSize * 2.5/4){
          text(this.char, -this.w/2, -this.fontSize * 0.14);
      } else if(this.txtb > this.fontSize * 0.1){
          text(this.char, -this.w/2, -this.fontSize * 0.34);
      } else{
          text(this.char, -this.w/2, - this.fontSize * 0.23);
      }
      pop();
  }
}

//------------------------------------------------------------------

function textHeight(text, textsize, abovesize, belowsize, maxheight) {
  var above;
  var below;
  push();
  if (textsize != undefined) {
    textSize(textsize);
  }
  if (maxheight != undefined) {
    text = 'Ç';
  }
  if (text.includes('Å')) {
    above = textWidth(11)*91.75/100;
  } else if (text.includes('Ô')) {
    above = textWidth(11)*90.25/100;
  } else if (text.includes('Ó')) {
    above = textWidth(11)*90.15/100;
  } else if (text.includes('Ò')) {
    above = textWidth(11)*90.10/100;
  } else if (text.includes('√')) {
    above = textWidth(11)*89.75/100;
  } else if (text.includes('È')||text.includes('Í')||text.includes('Î')) {
    above = textWidth(11)*88.5/100;
  } else if (text.includes('Ì')||text.includes('Û')||text.includes('Ç')||text.includes('Á')||text.includes('Â')||text.includes('Ê')||text.includes('Ú')||text.includes('Ù')) {
    above = textWidth(11)*88.25/100;
  } else if (text.includes('Ÿ')||text.includes('Ë')||text.includes('Ï')) {
    above = textWidth(11)*85.5/100;
  } else if (text.includes('')) {
    above = textWidth(11)*78.25/100;
  } else if (text.includes('å')) {
    above = textWidth(11)*76.65/100;
  } else if (text.includes('$')) {
    above = textWidth(11)*74.75/100;
  } else if (text.includes('∫')) {
    above = textWidth(11)*73/100;
  } else if (text.includes('∂')||text.includes('O')) {
    above = textWidth(11)*71.25/100;
  } else if (text.includes('@')||text.includes('C')||text.includes('Ø')||text.includes('º')||text.includes('ª')||text.includes('€')||text.includes('◊')) {
    above = textWidth(11)*71.10/100;
  } else if (text.includes('Q')||text.includes('S')||text.includes('G')||text.includes('ƒ')) {
    above = textWidth(11)*71/100;
  } else if (text.includes('é')||text.includes('è')||text.includes('à')||text.includes('ù')||text.includes('`')||text.includes('´')||text.includes('ê')||text.includes('î')||text.includes('ô')||text.includes('Œ')) {
    above = textWidth(11)*70.75/100;
  } else if (text.includes('{')||text.includes('}')) {
    above = textWidth(11)*70.5/100;
  } else if (text.includes('(')||text.includes(')')||text.includes('f')||text.includes('ﬁ')||text.includes('ﬂ')||text.includes('|')||text.includes('ß')) {
    above = textWidth(11)*70.25/100;
  } else if (text.includes('?')) {
    above = textWidth(11)*70.10/100;
  } else if (text.includes('Ω')) {
    above = textWidth(11)*69.90/100;
  } else if (text.includes('“')||text.includes('‘')||text.includes('‰')) {
    above = textWidth(11)*69.85/100;
  } else if (text.includes('[')||text.includes(']')) {
    above = textWidth(11)*69.75/100;
  } else if (text.includes('d')||text.includes('h')) {
    above = textWidth(11)*69.5/100;
  } else if (text.includes('#')||text.includes('"')||text.includes("'")||text.includes('§')||text.includes('!')||text.includes('A')||text.includes('Z')||text.includes('E')||text.includes('R')||text.includes('T')||text.includes('Y')||text.includes('U')||text.includes('i')||text.includes('I')||text.includes('P')||text.includes('^')||text.includes('*')||text.includes('D')||text.includes('F')||text.includes('H')||text.includes('j')||text.includes('J')||text.includes('k')||text.includes('K')||text.includes('l')||text.includes('L')||text.includes('M')||text.includes('W')||text.includes('X')||text.includes('V')||text.includes('b')||text.includes('B')||text.includes('N')||text.includes('/')||text.includes('”')||text.includes('’')||text.includes('¶')||text.includes('Æ')||text.includes('®')||text.includes('†')||text.includes('™')||text.includes('‡')||text.includes('∏')||text.includes('∑')||text.includes('∆')||text.includes('©')) {
    above = textWidth(11)*69.25/100;
  } else if (text.includes('£')) {
    above = textWidth(11)*69.10/100;
  } else if (text.includes('&')) {
    above = textWidth(11)*69/100;
  } else if (text.includes('¨')||text.includes('ë')||text.includes('ï')) {
    above = textWidth(11)*68/100;
  } else if (text.includes('2')||text.includes('6')||text.includes('8')) {
    above = textWidth(11)*67.75/100;
  } else if (text.includes('3')||text.includes('4')||text.includes('9')||text.includes('0')||text.includes('°')||text.includes('⁄')) {
    above = textWidth(11)*67.5/100;
  } else if (text.includes('%')) {
    above = textWidth(11)*67.25/100;
  } else if (text.includes('1')) {
    above = textWidth(11)*67/100;
  } else if (text.includes('5')) {
    above = textWidth(11)*66.5/100;
  } else if (text.includes('7')||text.includes('¥')) {
    above = textWidth(11)*66.25/100;
  } else if (text.includes('t')) {
    above = textWidth(11)*64.5/100;
  } else if (text.includes('¢')) {
    above = textWidth(11)*60/100;
  } else if (text.includes('∞')) {
    above = textWidth(11)*53.10/100;
  } else if (text.includes('ç')||text.includes('o')||text.includes('ø')) {
    above = textWidth(11)*52/100;
  } else if (text.includes('c')) {
    above = textWidth(11)*51.90/100;
  } else if (text.includes('s')||text.includes('æ')||text.includes('œ')) {
    above = textWidth(11)*51.75/100;
  } else if (text.includes('a')||text.includes('e')||text.includes('r')||text.includes('p')) {
    above = textWidth(11)*51.65/100;
  } else if (text.includes('m')||text.includes('n')) {
    above = textWidth(11)*51.60/100;
  } else if (text.includes('q')) {
    above = textWidth(11)*51.5/100;
  } else if (text.includes('g')) {
    above = textWidth(11)*51.25/100;
  } else if (text.includes('¿')) {
    above = textWidth(11)*50.75/100;
  } else if (text.includes('z')||text.includes('y')||text.includes('u')||text.includes('w')||text.includes('x')||text.includes('v')||text.includes('¡')) {
    above = textWidth(11)*50.5/100;
  } else if (text.includes('µ')) {
    above = textWidth(11)*50.35/100;
  } else if (text.includes('ı')) {
    above = textWidth(11)*50.25/100;
  } else if (text.includes('<')||text.includes('>')||text.includes('π')||text.includes('≤')||text.includes('≥')) {
    above = textWidth(11)*50.10/100;
  } else if (text.includes(';')||text.includes(':')) {
    above = textWidth(11)*49.80/100;
  } else if (text.includes('+')||text.includes('±')) {
    above = textWidth(11)*49.25/100;
  } else if (text.includes('÷')) {
    above = textWidth(11)*48.25/100;
  } else if (text.includes('•')) {
    above = textWidth(11)*45/100;
  } else if (text.includes('«')||text.includes('»')||text.includes('‹')||text.includes('›')) {
    above = textWidth(11)*42.60/100;
  } else if (text.includes('≈')) {
    above = textWidth(11)*41.75/100;
  } else if (text.includes('·')) {
    above = textWidth(11)*39.10/100;
  } else if (text.includes('=')||text.includes('¬')) {
    above = textWidth(11)*38.75/100;
  } else if (text.includes('~')) {
    above = textWidth(11)*34.20/100;
  } else if (text.includes('-')) {
    above = textWidth(11)*31.25/100;
  } else if (text.includes('—')||text.includes('–')) {
    above = textWidth(11)*30.15/100;
  } else if (text.includes('…')) {
    above = textWidth(11)*10.4/100;
  } else if (text.includes(',')||text.includes('.')||text.includes('„')||text.includes('‚')) {
    above = textWidth(11)*10.25/100;
  } else if (text.includes('_')) {
    above = textWidth(11)*-7.25/100;
  }
  if (text.includes('Ç')||text.includes('ç')) {
    below = textWidth(11)*21.65/100;
  } else if (text.includes('g')) {
    below = textWidth(11)*21.25/100;
  } else if (text.includes('y')) {
    below = textWidth(11)*20.5/100;
  } else if (text.includes('§')||text.includes('j')) {
    below = textWidth(11)*20.25/100;
  } else if (text.includes('p')||text.includes('q')) {
    below = textWidth(11)*20/100;
  } else if (text.includes('µ')) {
    below = textWidth(11)*19.80/100;
  } else if (text.includes('ƒ')) {
    below = textWidth(11)*19.70/100;
  } else if (text.includes('{')||text.includes('}')) {
    below = textWidth(11)*19.65/100;
  } else if (text.includes('(')||text.includes(')')||text.includes('∫')) {
    below = textWidth(11)*19.5/100;
  } else if (text.includes('¿')) {
    below = textWidth(11)*19.40/100;
  } else if (text.includes('[')||text.includes(']')) {
    below = textWidth(11)*18.90/100;
  } else if (text.includes('¡')) {
    below = textWidth(11)*18.75/100;
  } else if (text.includes('¶')) {
    below = textWidth(11)*17/100;
  } else if (text.includes('‡')) {
    below = textWidth(11)*15.40/100;
  } else if (text.includes('†')) {
    below = textWidth(11)*15.35/100;
  } else if (text.includes(',')||text.includes(';')||text.includes('„')||text.includes('‚')) {
    below = textWidth(11)*14.25/100;
  } else if (text.includes('∏')||text.includes('∑')) {
    below = textWidth(11)*14.10/100;
  } else if (text.includes('_')) {
    below = textWidth(11)*12/100;
  } else if (text.includes('$')||text.includes('¢')) {
    below = textWidth(11)*11.10/100;
  } else if (text.includes('Q')) {
    below = textWidth(11)*5.5/100;
  } else if (text.includes('‰')) {
    below = textWidth(11)*2.5/100;
  } else if (text.includes('')||text.includes('ø')) {
    below = textWidth(11)*2.20/100;
  } else if (text.includes('@')||text.includes('O')||text.includes('S')||text.includes('Ø')||text.includes('Ô')||text.includes('Ò')||text.includes('◊')||text.includes('Ó')) {
    below = textWidth(11)*2/100;
  } else if (text.includes('8')||text.includes('s')||text.includes('œ')) {
    below = textWidth(11)*1.90/100;
  } else if (text.includes('9')||text.includes('0')||text.includes('√')||text.includes('Ù')||text.includes('ô')||text.includes('Ú')||text.includes('Û')||text.includes('J')||text.includes('G')||text.includes('o')) {
    below = textWidth(11)*1.80/100;
  } else if (text.includes('é')||text.includes('⁄')||text.includes('∂')||text.includes('€')||text.includes('ê')||text.includes('ë')||text.includes('C')||text.includes('%')||text.includes('d')||text.includes('U')||text.includes('e')||text.includes('3')||text.includes('6')||text.includes('è')) {
    below = textWidth(11)*1.75/100;
  } else if (text.includes('5')||text.includes('æ')||text.includes('å')||text.includes('£')||text.includes('a')||text.includes('à')) {
    below = textWidth(11)*1.65/100;
  } else if (text.includes('&')||text.includes('Œ')||text.includes('b')) {
    below = textWidth(11)*1.5/100;
  } else if (text.includes('c')) {
    below = textWidth(11)*1.45/100;
  } else if (text.includes('u')||text.includes('ß')||text.includes('ù')) {
    below = textWidth(11)*1.35/100;
  } else if (text.includes('π')) {
    below = textWidth(11)*0.85/100;
  } else if (text.includes('<')||text.includes('>')) {
    below = textWidth(11)*0.80/100;
  } else if (text.includes('t')) {
    below = textWidth(11)*0.75/100;
  } else if (text.includes('#')||text.includes('1')||text.includes('2')||text.includes('w')||text.includes('M')||text.includes('m')||text.includes('L')||text.includes('l')||text.includes('K')||text.includes('k')||text.includes('H')||text.includes('h')||text.includes('F')||text.includes('f')||text.includes('D')||text.includes('P')||text.includes('I')||text.includes('i')||text.includes('Y')||text.includes('T')||text.includes('R')||text.includes('r')||text.includes('E')||text.includes('Z')||text.includes('z')||text.includes('A')||text.includes('!')||text.includes('7')||text.includes('4')||text.includes('Ÿ')||text.includes('+')||text.includes('/')||text.includes(':')||text.includes('.')||text.includes('?')||text.includes('N')||text.includes('n')||text.includes('B')||text.includes('V')||text.includes('v')||text.includes('X')||text.includes('x')||text.includes('W')||text.includes('±')||text.includes('…')||text.includes('ı')||text.includes('©')||text.includes('≥')||text.includes('≤')||text.includes('|')||text.includes('Ë')||text.includes('È')||text.includes('Í')||text.includes('Ï')||text.includes('Î')||text.includes('Ì')||text.includes('ﬂ')||text.includes('ﬁ')||text.includes('∆')||text.includes('Ω')||text.includes('¥')||text.includes('ï')||text.includes('î')||text.includes('®')||text.includes('Ê')||text.includes('Å')||text.includes('Â')||text.includes('Æ')||text.includes('Á')) {
    below = textWidth(11)*0/100;
  } else if (text.includes('÷')) {
    below = textWidth(11)*-1/100;
  } else if (text.includes('≈')) {
    below = textWidth(11)*-7.35/100;
  } else if (text.includes('›')||text.includes('‹')||text.includes('»')||text.includes('«')) {
    below = textWidth(11)*-10/100;
  } else if (text.includes('¬')||text.includes('=')) {
    below = textWidth(11)*-10.5/100;
  } else if (text.includes('~')) {
    below = textWidth(11)*-15.05/100;
  } else if (text.includes('∞')) {
    below = textWidth(11)*-16.10/100;
  } else if (text.includes('-')) {
    below = textWidth(11)*-22.5/100;
  } else if (text.includes('–')||text.includes('—')) {
    below = textWidth(11)*-23.25/100;
  } else if (text.includes('•')) {
    below = textWidth(11)*-24.10/100;
  } else if (text.includes('·')) {
    below = textWidth(11)*-27/100;
  } else if (text.includes('^')) {
    below = textWidth(11)*-28.5/100;
  } else if (text.includes('™')) {
    below = textWidth(11)*-35/100;
  } else if (text.includes('º')||text.includes('ª')) {
    below = textWidth(11)*-38.90/100;
  } else if (text.includes('°')) {
    below = textWidth(11)*-39/100;
  } else if (text.includes('"')||text.includes("'")||text.includes('*')) {
    below = textWidth(11)*-41.5/100;
  } else if (text.includes('”')||text.includes('’')) {
    below = textWidth(11)*-44.75/100;
  } else if (text.includes('“')||text.includes('‘')) {
    below = textWidth(11)*-45.25/100;
  } else if (text.includes('´')||text.includes('`')) {
    below = textWidth(11)*-57.10/100;
  } else if (text.includes('¨')) {
    below = textWidth(11)*-58.25/100;
  }

  if (text != '') {
    if (abovesize != undefined && belowsize != undefined) {
     return above+below;
    } else if (abovesize != undefined) {
      return above;
    } else if (belowsize != undefined) {
      return below;
    } else {
      return above+below;
    }
  } else {
    return 0;
  }
  pop();
}