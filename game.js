const startButton = document.getElementById("startbutton");
const backButton = document.getElementById("backbutton");

const page1 = document.getElementById("page1");
const pageplay = document.getElementById("pageplay");

window.addEventListener("load", () => {
  page1.classList.remove("hidden");
  pageplay.classList.add("hidden");
})

document.addEventListener("DOMContentLoaded", function () {
  startButton.addEventListener("click", function () {
    page1.classList.add("hidden");
    pageplay.classList.remove("hidden");
  });

  backButton.addEventListener("click", function () {
    page1.classList.remove("hidden");
    pageplay.classList.add("hidden");
  });
})

let faceMesh;
let faces = [];
let eaterNormal;
let eaterEat;
let foodsize = 90;

let cam;
let img;
let segmenter;
let segmentationData = [];

const options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

const goodArray = [
  "media/cake1.gif",
  "media/cake2.gif",
  "media/purin.gif",
]

const badArray = [
  "media/bad.gif",
]

let goodFoods = generateFoodPositions(5);
let goodImages = [];

let badFoods = generateFoodPositions(3);
let badImages = [];
let score = 0;


function preload() {
  eaterNormal = loadImage('media/normal.png');
  eaterEat = loadImage('media/eat.png');

  for (let i = 0; i < goodArray.length; i++) {
    goodImages.push(loadImage(goodArray[i]));
  }

  for (let i = 0; i < badArray.length; i++) {
    badImages.push(loadImage(badArray[i]));
  }

  goodeat = loadSound('media/good.mp3', () => { goodeat.setVolume(1); });
  badeat = loadSound('media/miss.mp3', () => { badeat.setVolume(1); });

  faceMesh = ml5.faceMesh(options);
}

function setup() {
  const myCanvas = createCanvas(1300, 720);
  myCanvas.parent('canvas-container');
  background(255);

  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  faceMesh.detectStart(cam, gotFaces);
}
function draw() {
    image(cam, 0, 0, 960, 720);
    // a transparent layer
    fill(0, 0, 0, 180); 
    rect(0, 0, 960, 720);
  
    textSize(18);
    fill(255);
    noStroke();
    rect(1000, 250, 200, 200);
    image(eaterNormal, 1000, 250, 200, 200);
  
    rect(1140, 502, 40, 20);
    fill(0);
    text(`Your score: ${score}`, 1040, 520);
    textSize(16);
    text('Open your mouth to control the size and eat food!', 980, 220);
  
    if (faces.length > 0 && faces[0].lips && faces[0].lips.keypoints) {
      let mouthCenterX = faces[0].lips.keypoints[10].x;
      let mouthCenterY = faces[0].lips.keypoints[10].y;
      let mouthGap = faces[0].lips.keypoints[24].y - faces[0].lips.keypoints[15].y;
      // let imageSize = map(mouthGap, 0, 30, 50, 200);
      let imageSize = 100;
  
      if (mouthGap > 15) {
        image(eaterEat, mouthCenterX + imageSize*1.2, mouthCenterY + imageSize, imageSize, imageSize);
      } else {
        image(eaterNormal, mouthCenterX + imageSize*1.2, mouthCenterY + imageSize, imageSize, imageSize);
      }
  
      for (let i = 0; i < goodFoods.length; i++) {
        image(goodImages[i % goodImages.length], goodFoods[i].x, goodFoods[i].y, foodsize, foodsize);
      }
  
      for (let i = 0; i < badFoods.length; i++) {
        image(badImages[i % badImages.length], badFoods[i].x, badFoods[i].y, foodsize, foodsize);
      }
  
      for (let i = 0; i < goodFoods.length; i++) {
        if (mouthGap > 15 && dist(mouthCenterX + imageSize*1.2, mouthCenterY + imageSize, goodFoods[i].x, goodFoods[i].y) < imageSize / 2 + foodsize / 2) {
          goodFoods[i].x = Math.random() * 500 + 100;
          goodFoods[i].y = Math.random() * 300 + 100;
          goodeat.play();
          score++;
        }
      }
  
      for (let i = 0; i < badFoods.length; i++) {
        if (mouthGap > 15 && dist(mouthCenterX + imageSize*1.2, mouthCenterY + imageSize, badFoods[i].x, badFoods[i].y) < imageSize / 2 + foodsize / 2) {
          badFoods[i].x = Math.random() * 500 + 100;
          badFoods[i].y = Math.random() * 300 + 100;
          badeat.play();
          score -= 2;
        }
      }
    }
  }

  function gotFaces(results) {
    faces = results;
  }
  
  function generateFoodPositions(count) {
    const foodPositions = [];
  
    for (let i = 0; i < count; i++) {
      foodPositions.push({
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100
      });
    }
  
    return foodPositions;
  }
  
  function resetImageSize() {
    imageSize = 50;
  }
