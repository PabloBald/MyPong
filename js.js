const body = document.getElementsByTagName('body');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const soundPing = document.getElementById("ping");
const soundPong = document.getElementById("pong");
const soundGoal = document.getElementById("goal");
const p1score = document.getElementById("p1Score");
const p2score = document.getElementById("p2Score");

//Adding a event listener to DOM for the inputs
window.addEventListener('keydown',menumov,false)
//Save key states, and modify the paddle positions by the states
var keyState = {}; 
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

//Canvas style
canvas.style.backgroundColor = "black";
canvas.height = 800;
canvas.width= 1200;
canvas.style.marginLeft = "0px"
canvas.style.marginTop = "0px"
//Variables

let intervalId= setInterval(animate,1000/60)
let pSpeed = 5 //Paddle Speed
let start = false //Initialize start with FALSE value to show the "Press START menu"
let touchCount = 0 //Touch counter
let first = true //Variable used to switch texts between pressStart or pause
let result = {
    playerOnepoints : 0,
    playerTwoPoints : 0
}
let paddle1 = {
    x: 2,
    width: canvas.height/40,
    height: canvas.height/5,
    y: canvas.height/2
}
let paddle2 = {
    x: canvas.width,
    width: canvas.height/40,
    height: canvas.height/5,
    y: canvas.height/2
}
let ball = {
    y: canvas.height/2,
    x: canvas.width/2,
    radiusX: canvas.height/60,
    radiusY: canvas.height/60,
    xDirection: getRandomInt(2),
    yDirection: getRandomInt(2),
    speed : 3
}

//Functions
function animate(){
    score()
    if(start == true){
            //Clear canvas every frame
            ctx.clearRect(0,0,canvas.width,canvas.height)
            //Create paddle for each player
            createPaddle(paddle1.x,paddle1.y,paddle1.width,paddle1.height)   //Player 1
            createPaddle(paddle2.x-paddle2.width-2,paddle2.y,paddle2.width,paddle2.height)  //Player2
            // New movement system for paddles added
            //Paddle1
            if (keyState[87]){
                paddle1.y -= 1 *pSpeed;
            }    
            if (keyState[83] || keyState[68]){
                paddle1.y += 1*pSpeed;
            }
            //Paddle2
            if (keyState[38]){
                paddle2.y -= 1 *pSpeed;
            }    
            if (keyState[40] || keyState[68]){
                paddle2.y += 1*pSpeed;
            }

            if(paddle1.y <= 0){
                paddle1.y = 0
            }
            if(paddle1.y+paddle1.height >= canvas.height){
                paddle1.y = canvas.height-paddle1.height
            }
            if(paddle2.y <= 0){
                paddle2.y = 0
            }
            if(paddle2.y+paddle2.height >= canvas.height){
                paddle2.y = canvas.height-paddle2.height
            }

            
            createBall(ctx)
            ballMove()
            
            
    }else if(start == false && first == true){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        pressStart(canvas.width/4,canvas.height/2-10)
    }        
}
function createBall(context)
{
    context.fillStyle = "white";
    context.beginPath();
    context.ellipse(ball.x, ball.y, ball.radiusY, ball.radiusX, 0, 0, Math.PI * 2, false);
    context.fill();
}
function createPaddle(x,y,w,h){
    
    ctx.fillStyle = "white";
    ctx.fillRect(x,y,w,h)
}
function ballMove(){
    
    if(ball.yDirection == 1){
        ball.y+=1*ball.speed
    }
    if(ball.yDirection == 0){
        ball.y-=1*ball.speed
    }
    if(ball.xDirection == 1){
        ball.x+=1*ball.speed
    }
    if(ball.xDirection == 0){
        ball.x-=1*ball.speed 
    }
    
    if(ball.yDirection==1 && ball.y >= canvas.height){
        ball.yDirection--
    }
    if(ball.yDirection==0 && ball.y <= 0){
        ball.yDirection++
    }

    //Collision on paddle 1
    if(ball.xDirection == 0 && ball.x <= paddle1.x+paddle1.width && ball.y >= paddle1.y && (ball.y <= paddle1.y+paddle1.height)){
        ball.xDirection = 1
        touchCount++
        console.log(touchCount)
        if(touchCount%10 == 0){
            console.log("Speed incremented")
            ball.speed++
        }
        playAudio(soundPing)
    }
    //Collision on paddle2
    if(ball.xDirection == 1 && ball.x >= paddle2.x-paddle2.width-2 && ball.y >= paddle2.y && ball.y <= (paddle2.y+paddle2.height)){
        ball.xDirection= 0
        touchCount++
        console.log(touchCount)
        if(touchCount%10 == 0){
            console.log("Speed incremented")
            ball.speed++
        }
        playAudio(soundPong)
    }
    if(ball.x > canvas.width || ball.x < 0){
        if(ball.x >canvas.width){
            result.playerOnepoints++
           playAudio(soundGoal)
        }
        if(ball.x < 0 ){
            result.playerTwoPoints++
            playAudio(soundGoal)
        }
        reset()
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function reset(){
    //reset ball
    ball.x = canvas.width/2
    ball.y = canvas.height/2
    //random ball direction
    ball.xDirection =  getRandomInt(2)
    ball.yDirection =  getRandomInt(2) 
    //Reset paddles
    setPaddleY(paddle1,paddle1.height)
    setPaddleY(paddle2,paddle2.height)
    //Reset ball speed
    ball.speed = ball.speed
    //Reset touch count
    touchCount = 0
}
function setPaddleY(paddle,height){
    paddle.y = canvas.height/2-height/2
}
function menumov(e){
    e.preventDefault()
    e = e.keyCode;
    if(e==82){
        reset()
        resetScore()

    }
    if(e==13 &&start == true){
            clearInterval(intervalId)
            pressStart()
            start = false
            }else if(e==13 &&start == false){
             intervalId=setInterval(animate,1000/60)
             ctx.clearRect(0,0,canvas.width,canvas.height)
             start = true
             reset()
             resetScore()
             return intervalId
    } 
    if(e==80 &&start == true){
        clearInterval(intervalId)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        pause(canvas.width/4,canvas.height/2-10)
        start = false
        }else if(e==80 &&start == false){
         intervalId=setInterval(animate,1000/60)
         ctx.clearRect(0,0,canvas.width,canvas.height)
         start = true
         return intervalId
  }        
}
function inputsDown(e){
    e.preventDefault()
    e = e.keyCode;
    if(e==87&& paddle1.y != 0 ){
        paddle1.y = paddle1.y-1*pSpeed
    }
    if(e==83 && paddle1.y+paddle1.height != canvas.height){
        paddle1.y = paddle1.y+1*pSpeed
    }
    if(e==38&& paddle2.y != 0 ){
        paddle2.y = paddle2.y-1*pSpeed
    }
    if(e==40 && paddle2.y+paddle2.height != canvas.height){
        paddle2.y = paddle2.y+1*pSpeed
    }
    
}

function inputsUp(e){
    
    e = e.keyCode;
    if(e==87&& paddle1.y != 0 ){
        paddle1.y = paddle1.y-1*pSpeed
    }
    if(e==83 && paddle1.y+paddle1.height != canvas.height){
        paddle1.y = paddle1.y+1*pSpeed
    }
    if(e==38&& paddle2.y != 0 ){
        paddle2.y = paddle2.y-1*pSpeed
    }
    if(e==40 && paddle2.y+paddle2.height != canvas.height){
        paddle2.y = paddle2.y+1*pSpeed
    }
    e.preventDefault()
}
function inputsPressed(e){
    
    e = e.keyCode;
    if(e==87&& paddle1.y != 0 ){
        paddle1.y = paddle1.y-1*pSpeed
    }
    if(e==83 && paddle1.y+paddle1.height != canvas.height){
        paddle1.y = paddle1.y+1*pSpeed
    }
    if(e==38&& paddle2.y != 0 ){
        paddle2.y = paddle2.y-1*pSpeed
    }
    if(e==40 && paddle2.y+paddle2.height != canvas.height){
        paddle2.y = paddle2.y+1*pSpeed
    }
    e.preventDefault()
}

function playAudio(audio){
    audio.play();
}
function score(){
    p1score.innerHTML = result.playerOnepoints
    p2score.innerHTML = result.playerTwoPoints
}  
function pressStart(x, y){
        first = true
        ctx.fillStyle = "White";
        ctx.font = "bold 50px ARCADECLASSIC";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillText("PRESS   ENTER   TO   START",x,y);
        ctx.strokeText("PRESS   ENTER   TO   START",x,y);

}
function resetScore(){
     //reset score
     result.playerOnepoints = 0
     result.playerTwoPoints = 0
}
function pause(x,y){
        first = false
        ctx.fillStyle = "White";
        ctx.font = "bold 50px ARCADECLASSIC";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillText("PAUSE!   PRESS   P   TO   RESUME",x,y);
        ctx.strokeText("PAUSE!   PRESS   P   TO   RESUME",x,y);
}
