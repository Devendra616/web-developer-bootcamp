
var numSquares = 6;
var colors =[];
var pickedColor;
var colorDisplay = document.getElementById('colorDisplay');
var squares = document.querySelectorAll('.square');
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var btnModes = document.querySelectorAll('.btnMode');

init();

function init(){
	setupModelisteners();
	setupSquares();
	reset();
}

function setupModelisteners() {
	//initalise the modes easy/hard
	for(var i=0;i<btnModes.length;i++){	
		btnModes[i].addEventListener("click",function(){
			btnModes[0].classList.remove('selected');
			btnModes[1].classList.remove('selected');
			this.classList.add('selected');				
			if(this.textContent === "Easy"){
				numSquares = 3;
			}else{
				numSquares=6;
			}
			reset();
		});
	}	
}


function setupSquares(){
	//click listeners to squares
	for(var i=0;i<squares.length;i++){
	//add click listener
		squares[i].addEventListener("click",function(){
			var clickedColor = this.style.backgroundColor;
			
			if(clickedColor !== pickedColor){
				this.style.backgroundColor = "transparent";
				messageDisplay.textContent = "Wrong!";
				
			}else{
				messageDisplay.textContent = "Correct!";
				h1.style.backgroundColor = pickedColor;
				changeColors();
				resetButton.textContent = "Play Again?";
			}
		});
	}
}


function reset(){
	colors = generateRandomColor(numSquares);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	h1.style.backgroundColor = "steelblue";
	for(var i=0;i<squares.length;i++){
		if(colors[i]){
			squares[i].style.backgroundColor = colors[i];	
			squares[i].style.display = "block";
		} else{
			squares[i].style.display = "none";
		}
	}

	messageDisplay.textContent="";
	resetButton.textContent = "New Color";
}


resetButton.addEventListener("click",function(){
	reset();
})

//change color of each square to matched color
function changeColors(){
	for(var i=0;i<squares.length;i++){
		squares[i].style.backgroundColor = pickedColor;
	}
}

function pickColor(){
	var random = Math.floor(Math.random()*colors.length);
	return colors[random];
}

function generateRandomColor(num){
	var arr = [];
	for(var i=0;i<num;i++){
		arr.push(getRandomColor());
	}
	return arr;
}

function getRandomColor(){
	var red= Math.floor(Math.random()*256);
	var green= Math.floor(Math.random()*256);
	var blue= Math.floor(Math.random()*256);

	return "rgb("+red+", "+green+", "+blue+")";	
}