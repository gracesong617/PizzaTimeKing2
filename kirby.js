let faceMesh;
let video;
let eye;
let cheek;
let faces = [];
let options = {
    maxFaces: 20,
    refineLandmarks: false,
    flipHorizontal: true // *****
};

function preload() {
    faceMesh = ml5.faceMesh(options);
    eye = loadImage('media/eye.png');
    cheek = loadImage('media/cheek.png');
}

function setup() {

    const myCanvas = createCanvas(320,240);
    myCanvas.parent('canvas-container1');
    video = createCapture(VIDEO, { flipped: true }); // flipped the video
    video.size(320,240);
    video.hide();

    faceMesh.detectStart(video, gotFaces);
}

function draw() {
    // draw the webcam video
    image(video, 0, 0, 320,240);

    // draw the faces' bounding boxes
    for (let j = 0; j < faces.length; j++) {
        let face = faces[j];

        strokeWeight(3);

       
        // fill(255,80);
        noFill();
        // noStroke();
        stroke(251,232,247);
        strokeWeight(5);
 

        let keypoint = face.faceOval.keypoints[0o6];
        let x = keypoint.x;
        let y = keypoint.y;
        textSize(20);
        stroke(0)
        fill(251,232,247)
        text('You are Kirby!', x/2-90 , y/2-50)

        let lefteyepoint = face.leftEye;
        let lefteyex = lefteyepoint.x;
        let lefteyey = lefteyepoint.y;
        image(eye,lefteyex/2,lefteyey/2-10,20,30)

        let righteyepoint = face.rightEye;
        let righteyex = righteyepoint.x;
        let righteyey = righteyepoint.y;
        image(eye,righteyex/2-2,righteyey/2-10,20,30)

        let cheek1keypoint = face.faceOval.keypoints[27];
        let cheek1x = cheek1keypoint.x;
        let cheek1y = cheek1keypoint.y;
        image(cheek,cheek1x/2-8,cheek1y/2,20,10)

        let cheek2keypoint = face.faceOval.keypoints[9];
        let cheek2x = cheek2keypoint.x;
        let cheek2y = cheek2keypoint.y;
        image(cheek,cheek2x/2-8,cheek2y/2,20,10)

    }
}

function gotFaces(results) {
    faces = results;
}