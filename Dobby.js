let myCanvas;
let myCanvasHeight = 576;
let myCanvasWidth = 360;
let context;

console.log("working");
//Dobby 
let dobbyHeight = 46;
let dobbyWidth = 46;
let dobbyX = myCanvasWidth / 2 - dobbyWidth / 2;
let dobbyY = myCanvasHeight * 7 / 8 - dobbyHeight;
let dobbyRightImage;
let dobbyLeftImage;

//  physics
let velocityX = 0;
let velocityY = 0; //dobby jumpo startted 
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;
//platform
let platformArray = []
let platformHeight = 18;
let platformWidth = 60;
let platformImg;


let Score = 0;
let maxScore = 0;

let gameStarted = false;
let gameOver = false;

let dobby = {
    img: null,
    x: dobbyX,
    y: dobbyY,
    width: dobbyWidth,
    height: dobbyHeight
}

window.onload = function () {
    myCanvas = document.getElementById("myCanvas");
    myCanvas.height = myCanvasHeight;
    myCanvas.width = myCanvasWidth;
    context = myCanvas.getContext("2d"); // this is  used to draw on board



    //load images

    //right facing dobby image
    dobbyRightImage = new Image();
    dobbyRightImage.src = "./images/dobby-right.png";
    dobby.img = dobbyRightImage;
    console.log(dobbyRightImage)

    dobbyRightImage.onload = function () {
        context.drawImage(dobby.img, dobby.x, dobby.y, dobby.height, dobby.width)
    }

    //left facing dobby image
    dobbyLeftImage = new Image();
    dobbyLeftImage.src = "./images/dobby-left.png";


    console.log(dobbyLeftImage)





    platformImg = new Image();
    console.log(platformImg);
    platformImg.src = "./images/platform.png";

    velocityY = initialVelocityY;

    placePlatform();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDobby)

    context.fillStyle = "black";
    console.log(context.font);
    context.font = '20px monospace';
    context.fillText("Press 'Space' to Start", myCanvasWidth / 5.4, myCanvasHeight / 2);



}

function update() {
    requestAnimationFrame(update);
    ///////////////// IMP //////////////////
    

    if (!gameStarted) { // Check if the game has started
        return; // If not started, do nothing
    }
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);// to remove overlapping on canvas we used clearRect()

  
    if (dobby.x > myCanvasWidth) {
        dobby.x = 0;// Wrap dobby to the left edge
    }

    else if (dobby.x + dobby.width < 0) {

        dobby.x = myCanvasWidth;// Wrap dobby to the right edge
    }
   

    
    //platform movements
    velocityY += gravity;
    dobby.y += velocityY;

    dobby.x += velocityX;   // Update dobby's position based on velocityX
    document.addEventListener('keydown', moveDobby);
  
    if (dobby.y > myCanvas.height) {
        gameOver = true;
    }

    context.drawImage(dobby.img, dobby.x, dobby.y, dobby.height, dobby.width)
   
    //draw the platform 
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];

        if (velocityY < 0 && dobby.y < myCanvasHeight * 3 / 4) {
            platform.y -= initialVelocityY; // this will make slide platform down
        }
        if (detectCollision(dobby, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height)

    }
    //clear platforms and new  plaform
    while (platformArray.length > 0 && platformArray[0].y >= myCanvasHeight) {
        platformArray.shift(); //removes first element from the array 
        newPlatform();

    } 
    updateScore();
    context.fillStyle = "black";
    context.font = '16px monospace, Arial, sans-serif';
    context.fillText(Score, 5, 20);

    if (gameOver) {
        context.font = '16px monospace, Arial, sans-serif';
        context.fillText("Score : " + Score, myCanvasWidth / 2.8, myCanvasHeight * 0.8);

        context.fillText("Game Over : Press 'Space' to  Restart", myCanvasWidth / 15, myCanvasHeight * 0.77);
    }
}

function moveDobby(e) {
    if (e.code == "Space") {
        if (!gameStarted) { // If the game hasn't started yet
            gameStarted = true; // Set the game as started
            placePlatform(); // Initialize platforms
            return; // Exit the function to prevent further actions
        }
        if (gameOver) {
            dobby = {
                img: dobbyRightImage,
                x: dobbyX,
                y: dobbyY,
                width: dobbyWidth,
                height: dobbyHeight
            }
            velocityX = 0;
            velocityY = initialVelocityY;
            Score = 0;
            maxScore = 0;
            gameOver = false;
            placePlatform();
        }
    }
    
    if (e.code == "ArrowLeft" || e.code == "KeyA") {  //e.code is used to check if the pressed key is "ArrowLeft" (left arrow key) or "KeyA" (the 'A' key).
        velocityX = -4;
        dobby.img = dobbyLeftImage
    }
    else if (e.code == "ArrowRight" || e.code == " KeyD") {
        velocityX = 4;
        dobby.img = dobbyRightImage
    }
    else if (e.code == "Space" && gameOver) {

        dobby = {
            img: dobbyRightImage,
            x: dobbyX,
            y: dobbyY,
            width: dobbyWidth,
            height: dobbyHeight
        }
        velocityX = 0 ;
        velocityY = initialVelocityY;
        Score = 0 ;
        maxScore = 0 ;
        gameOver = false ;
        placePlatform();

    }
}


function placePlatform() {

    platformArray = [];
    //starting platform
    let platform = {
        img: platformImg,
        x: myCanvasWidth / 2,
        y: myCanvasHeight - 50,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform)

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * myCanvasWidth * 3 / 4);  //  (0 - 1) * myCanvasWidth*3/4

        //starting platform
        let platform = {
            img: platformImg,
            x: randomX,
            y: myCanvasHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform)
    }


}

function newPlatform() {
    let randomX = Math.floor(Math.random() * myCanvasWidth * 3 / 4);  //  (0 - 1) * myCanvasWidth*3/4
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform)
}


function detectCollision(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&//a's top right corner passes b's top left corner
        a.y < b.y + b.height &&//a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50 * Math.random())
    if (velocityY < 0) {
        maxScore += points;
        if (Score < maxScore) {
            Score = maxScore;

        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}