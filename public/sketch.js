let mic;
let r = 0;

let cols; let rows; let size = 10;
let minSize = 350; //Minimum image size
let maxSize = 510; //Maximum image size
let sizeSpeed = 0.95; //Pulse speed
let imgSize = 450; //Original image size

let d = []; 
//2D array: stores an array of various arrays, or a list of various lists, or an array of various one-dimensional arrays
let max; //The distance between the center of the canvas and the furthest circle

//Array of background colours
let colors = ["#ffffff","#DFDFDF","#A0A0A0","#3F3F3F","#4C4B4B","#313131","#898889","#B7B4B5","#FDFAFA","#676565"];
//let colors = ["#f72585","#b5179e","#7209b7","#0DC444","#480ca8","#3a0ca3","#3f37c9","#4361ee","#4895ef","#BF00FF"];

//Amount of colour rings
let rings = 3;

let audio_enabled = false;

function setup() {
  createCanvas(610, 610);

  let button = createButton("Clap Clap!");
  button.mousePressed(allowAudio);
  button.style('border', 'transparent');
  
  //I have pairs of chromatrope images to test out, if you want to try other pairs, you just need to change the number, like 07, 08 to 09, 10, or 11, 12.
  img = loadImage("chromatrope/07.jpg");
  img2 = loadImage("chromatrope/08.jpg");
  imageMode(CENTER);
  
  //Numbers of columns and rows for the ellipses
  cols = width/size;
  rows = height/size;
  
  //Using the Pythagoras theorem, imagine a triangle with 3 points: (0, 0), (0, height/2), (width/2, height/2). The max distance is the distance between (0, 0) and (width/2, height/2), which can be calculated with the following equation:
  max = sqrt(pow(width/2, 2) + pow(height/2, 2));
  
  //Create grids of ellipses
  for (let i = 0; i < cols; i++) {
    //Populate this 1D array with other empty 1D arrays
    d[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = i * size + size/2;
      let y = j * size + size/2;
      //Populate the array with the distances between the center of the canvas to each cell. dist() calculates the distance from each (x, y) co-ords to the canvas center.
      d[i][j] = dist(x, y, width/2, height/2);
      }
    }
  }

  function allowAudio () {
    getAudioContext().resume();

    mic = new p5.AudioIn ();
    mic.start ();

    audio_enabled = true;
  }

  function draw() {
    //Transparent background
    background(90, 0.1);
    //print(mic.getLevel());
    if(audio_enabled) {
      let amplitude = mic.getLevel() * 200;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          //Specify the amount of cells. Because each circle is drawn from the center of the circle, adding size/2 will have the circles drawn fully inside the canvas.
          let x = i * size + size/2;
          let y = j * size + size/2;
          //map(d[i][j], 0, max, 0, colors.length): map the value of the items in the colour arrays to the distance between the canvas center and the furthest circle from the center, the assign the final value to the 2D array.
          //colors.length * rings: specify the amount of colour rings
          //floor(map(d[i][j]), 0, max, 0, colors.length * rings) returns a value between 0 and 9, which is the amount of items in the colors array.
          //abs(d[i][j]): Because d[i][j] -= keeps decrementing, it will become a negative number at one point, and index needs to be an absolute number.
          
          let index = floor(map(abs(d[i][j]), 0, max, 0, colors.length * rings));
          //index % colours.length returns an interger between 0 and 9, always within the colour array so that the colours loop over and over again.
          let c = colors[index % colors.length];
          
          //Blend mode options
          blendMode(BLEND);
          //blendMode(SOFT_LIGHT);
          
          fill(c);
          noStroke();
          
          //Draw shapes based on the amount of cells in each row and column
          ellipse(x, y, size, size);
          //square(x, y, size);
          
          d[i][j] -= amplitude;
        }
      }
      
      //The rotation of the images corresponds to the amplitude.
      r = r + amplitude;
      //Change the size of the image based on the amplitude. I'm using a sine wave so that the size values transition smoothly as the amplitude changes. The sine value oscillates from -1 to 1, which is translated to the minimum and maximum sizes of the image, then assigned to amplitude * sizeSpeed which makes it reactive to the mic amplitude.
      imgSize = map(sin(amplitude * sizeSpeed), -1, 1, minSize, maxSize);
      blendMode(DIFFERENCE); //Creating the glass effect.
      push();
        translate(width/2, height/2);
        rotate(radians(r * 5));
        image(img, 0, 0, imgSize, imgSize);
      pop();
      push();
        translate(width/2, height/2);
        rotate(radians(-r * 5));
        image(img2, 0, 0, imgSize, imgSize);
      pop();
    }
  }