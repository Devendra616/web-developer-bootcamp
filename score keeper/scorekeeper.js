var p1Button = document.querySelector("#p1");
var p2Button = document.querySelector("#p2");
var p1Display= document.querySelector('#p1Display');
var p2Display= document.querySelector('#p2Display');
var resetButton = document.querySelector('#reset');
var numInput = document.querySelector("input[type=number]");
var winningScoreDisplay=  document.querySelector("p span");
var p1Score = 0;
var p2Score = 0;
var gameOver = false;
var winningScore = 5;

p1Button.addEventListener("click",function(){
	if(!gameOver){
		p1Score++;
		if(p1Score=== winningScore){
			p1Display.classList.add('winner');
			gameOver = true;
		}
		p1Display.textContent = p1Score;
	}
});
p2Button.addEventListener("click",function(){
	if(!gameOver){
		p2Score++;
		if(p2Score=== winningScore){
			p2Display.classList.add('winner');
			gameOver = true;
		}
		p2Display.textContent = p2Score;
	}
});

resetButton.addEventListener("click",function(){
	reset();
});

numInput.addEventListener("change",function(){
	winningScore = Number(this.value);
	winningScoreDisplay.textContent = winningScore;
	reset(); //to reset game as max score is changed in between
});

function reset(){
	p1Display.classList.remove("winner");
	p2Display.classList.remove("winner");
	p1Score = p2Score =0;
	p1Display.textContent = p1Score;
	p2Display.textContent = p2Score;
	gameOver = false;
	numInput.value="";
}