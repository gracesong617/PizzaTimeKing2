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


let handPose;
let video;
let hands = [];
let eater;
let eaterNormal;
let eaterEat;
let pinchhand;
let foodsize = 90;
const goodArray = [
  "media/cake1.gif",
  "media/cake2.gif",
  "media/purin.gif",
]

const badArray = [
  "media/bad.gif",
]

let goodFoods = generateFoodPositions(10);
let goodImages = [];

let badFoods = generateFoodPositions(5);
let badImages = [];
let score = 0;
// let xPositions = [];
// let yPositions = [];

// A variable to track a pinch between thumb and index
let pinch = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
  eaterNormal = loadImage('media/normal.png');
  eaterEat = loadImage('media/eat.png');
  pinchhand = loadImage('media/pinch.gif');
 
  for (let i = 0; i < goodArray.length; i++) {
    goodImages.push(loadImage(goodArray[i]));
}

for (let i = 0; i < badArray.length; i++) {
  badImages.push(loadImage(badArray[i]));
}

goodeat = loadSound('media/good.mp3', () => { goodeat.setVolume(1); });
badeat = loadSound('media/miss.mp3', () => { badeat.setVolume(1); });



}

function setup() {
  const myCanvas = createCanvas(1300,720);
  myCanvas.parent('canvas-container');
   background(255); 
  // Create the webcam video and hide it
  video = createCapture(VIDEO); 
  video.size(width, height);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  
}

function draw() {
  
  // Draw the webcam video
  image(video, 0, 0, 960,720);
  textSize(18);
  fill(255);
 noStroke();
  rect(1000, 250, 200,200); 
  image(pinchhand, 1000, 250, 200, 200);
 // Set the fill color to white
  rect(1140, 502, 40, 20); 
  fill(0)
  text(`Your score: ${score}`, 1040, 520);
  textSize(16);
  text('Pinch your thumb and index finger', 980, 200);
  text('to control the size and eat food!', 980, 220);




  for (let i = 0; i < goodFoods.length; i++) {
    image(goodImages[i % goodImages.length], goodFoods[i].x, goodFoods[i].y, foodsize, foodsize);
}

for (let i = 0; i < badFoods.length; i++) {
  image(badImages[i % badImages.length], badFoods[i].x, badFoods[i].y, foodsize, foodsize);
}


  // If there is at least one hand
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

    // This circle's size is controlled by a "pinch" gesture
    let imageSize = map(pinch*2, 0, width, 50, 200);
    if (imageSize > 90) {
      image(eaterEat, centerX, centerY, imageSize, imageSize);
  } else {
      image(eaterNormal, centerX, centerY, imageSize, imageSize);
  }
    console.log("Current imageSize:", imageSize);



    for (let i = 0; i < goodFoods.length; i++) {
    
      if (imageSize > 90 && dist(centerX, centerY, goodFoods[i].x, goodFoods[i].y) < imageSize / 2 + foodsize / 2) {
        goodFoods[i].x = Math.random() * 500 + 100;
        goodFoods[i].y = Math.random() * 300 + 100;
        goodeat.play();
        score ++;
      }
    }    


    for (let i = 0; i < badFoods.length; i++) {
    
      if (imageSize > 70 && dist(centerX, centerY, badFoods[i].x, badFoods[i].y) < imageSize / 2 + foodsize / 2) {
        badFoods[i].x = Math.random() * 500 + 100;
        badFoods[i].y = Math.random() * 300 + 100;
        badeat.play();
        score -= 2;
      }
    }    

  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
  console.log(hands);
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
