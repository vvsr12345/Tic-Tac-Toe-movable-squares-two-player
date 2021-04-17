var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];
var currentsqid;
const availablemoves={
	0 : [1,3,4],
	1 : [0,2,4],
	2 : [1,5,4],
	3 : [0,6,4],
	4 : [0,1,2,3,5,6,7,8],
	5 : [2,8,4],
	6 : [3,7,4],
	7 : [6,8,4],
	8 : [5,7,4],
};
var count=0;
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnclick, false);
	}
}

function turnclick(square){
	if (typeof origBoard[square.target.id] == 'number') {
		if(count==0){
			count=1;
			turnClick(square,huPlayer);
		}
		else if(count==1){
			count=0;
			turnClick(square,aiPlayer);
		}
	}
}

function turnClick(square,player) {
	let arr = emptySquares().length;
	if (typeof origBoard[square.target.id] == 'number' && arr>3) {
		turn(square.target.id, player);
	}
	let arr2 = emptySquares().length;
	if(arr2==3 && !checkWin(origBoard,player)){
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnclick, false);
		}
		turnselect(huPlayer);
	}
}

function turnselect(player){
	turnMove(player);
}

function turnMove(player){
	if(player==huPlayer){
		husquares=huSquares();
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener("mouseover", aimouseoversqid, false);
			cells[i].removeEventListener("click", aimouseclicksqid, false);
			cells[i].removeEventListener("mouseout", aimouseoutsqid, false);
		}
		for (var i of husquares) {
			cells[i].addEventListener("mouseover", humouseoversqid, false);
			cells[i].addEventListener("click", humouseclicksqid, false);
			cells[i].addEventListener("mouseout", humouseoutsqid, false);
		}
	}
	if(player==aiPlayer){
		aisquares=aiSquares();
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener("mouseover", humouseoversqid, false);
			cells[i].removeEventListener("click", humouseclicksqid, false);
			cells[i].removeEventListener("mouseout", humouseoutsqid, false);
		}
		for (var i of aisquares) {
			cells[i].addEventListener("mouseover", aimouseoversqid, false);
			cells[i].addEventListener("click", aimouseclicksqid, false);
			cells[i].addEventListener("mouseout", aimouseoutsqid, false);
		}
	}
}

function humouseoversqid(sqidmover){
	mouseoverfunc(sqidmover.target.id, huPlayer)
}

function humouseclicksqid(sqidmclick){
	mouseclick(sqidmclick.target.id, huPlayer)
}

function humouseoutsqid(sqidmout){
	mouseoutfunc(sqidmout.target.id, huPlayer)
}

function aimouseoversqid(sqidmover){
	mouseoverfunc(sqidmover.target.id, aiPlayer)
}

function aimouseclicksqid(sqidmclick){
	mouseclick(sqidmclick.target.id, aiPlayer)
}

function aimouseoutsqid(sqidmout){
	mouseoutfunc(sqidmout.target.id, aiPlayer)
}

function mouseoverfunc(squareid, player){
	if(player == huPlayer && origBoard[squareid] ==huPlayer){
		let availmoves=availablemoves[squareid];
		let totalavailmoves=emptySquares();
		let validmoves=getCommon(availmoves,totalavailmoves);
		document.getElementById(squareid).style.backgroundColor = validmoves.length>0 ? "blue" : "red";
		if (validmoves.length>0){
			for (let s of validmoves) {
				document.getElementById(s).style.backgroundColor ="lightblue";
			}
		}
	}
	if(player == aiPlayer && origBoard[squareid] ==aiPlayer){
		let availmoves=availablemoves[squareid];
		let totalavailmoves=emptySquares();
		let validmoves=getCommon(availmoves,totalavailmoves);
		document.getElementById(squareid).style.backgroundColor = validmoves.length>0 ? "blue" : "red";
		if (validmoves.length>0){
			for (let s of validmoves) {
				document.getElementById(s).style.backgroundColor ="lightblue";
			}
		}
	}
}

function mouseclick(squareid, player){
	if(player == huPlayer && origBoard[squareid] ==huPlayer){
		for (var i=0; i<9; i++) {
			document.getElementById(i).removeEventListener("click", humove, false);
		}
		var availmoves=availablemoves[squareid];
		var totalavailmoves=emptySquares();
		var validmoves=getCommon(availmoves,totalavailmoves);
		document.getElementById(squareid).style.backgroundColor = validmoves.length>0 ? "blue" : "red";
		if (validmoves.length>0){
			for (var s of validmoves) {
				document.getElementById(s).style.backgroundColor ="lightblue";
				document.getElementById(s).addEventListener('click',humove, false);
			}
		}
		function humove(squaremove){
			huplayermove(squaremove,squareid);
			for (var s of validmoves) {
				document.getElementById(s).removeEventListener("click", humove, false);
			}
		}
		currentsqid=squareid;
	}
	if(player == aiPlayer && origBoard[squareid] ==aiPlayer){
		for (var i=0; i<9; i++) {
			document.getElementById(i).removeEventListener("click", aimove, false);
		}
		var availmoves=availablemoves[squareid];
		var totalavailmoves=emptySquares();
		var validmoves=getCommon(availmoves,totalavailmoves);
		document.getElementById(squareid).style.backgroundColor = validmoves.length>0 ? "blue" : "red";
		if (validmoves.length>0){
			for (var s of validmoves) {
				document.getElementById(s).style.backgroundColor ="lightblue";
				document.getElementById(s).addEventListener('click',aimove, false);
			}
		}
		function aimove(squaremove){
			aiplayermove(squaremove,squareid);
			for (var s of validmoves) {
				document.getElementById(s).removeEventListener("click", aimove, false);
			}
		}
		currentsqid=squareid;
	}
}

function huplayermove(squaremove,squareid){
	if(currentsqid==squareid){
		squaremoveId=squaremove.target.id;
		origBoard[squareid] = parseInt(squareid);
		document.getElementById(squareid).innerText = '';
		origBoard[squaremoveId] = huPlayer;
		document.getElementById(squaremoveId).innerText = huPlayer;
		let gameWon = checkWin(origBoard, huPlayer);
		if (gameWon) gameOver(gameWon);
		if (!checkWin(origBoard, huPlayer)) turnselect(aiPlayer);
	}
}

function aiplayermove(squaremove,squareid){
	if(currentsqid==squareid){
		squaremoveId=squaremove.target.id;
		origBoard[squareid] = parseInt(squareid);
		document.getElementById(squareid).innerText = '';
		origBoard[squaremoveId] = aiPlayer;
		document.getElementById(squaremoveId).innerText = aiPlayer;
		let gameWon = checkWin(origBoard, aiPlayer);
		if (gameWon) gameOver(gameWon);
		if (!checkWin(origBoard, aiPlayer)) turnselect(huPlayer);
	}
}


function mouseoutfunc(squareid, player){
	for (var i = 0; i < 9; i++) {
		cells[i].style.removeProperty('background-color');
	}
}

function getCommon(arr1, arr2) {
  var common = [];
  for(var i=0 ; i<arr1.length ; ++i) {
    for(var j=0 ; j<arr2.length ; ++j) {
      if(arr1[i] == arr2[j]) {
        common.push(arr1[i]);
      }
    }
  }
  return common;
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	count=0;
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener("mouseover", humouseoversqid, false);
		cells[i].removeEventListener("click", humouseclicksqid, false);
		cells[i].removeEventListener("mouseout", humouseoutsqid, false);
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener("mouseover", aimouseoversqid, false);
		cells[i].removeEventListener("click", aimouseclicksqid, false);
		cells[i].removeEventListener("mouseout", aimouseoutsqid, false);
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnclick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "O win" : "X win");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function huSquares() {
	let husj=[];
	for(var i=0; i<9; i++){
		if(origBoard[i]==huPlayer){
			husj.push(i);
		}
	}
	return husj;
}

function aiSquares() {
	let aisj=[];
	for(var i=0; i<9; i++){
		if(origBoard[i]==aiPlayer){
			aisj.push(i);
		}
	}
	return aisj;
}