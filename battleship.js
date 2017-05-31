import {
  SHIPS,
	shipsCopy,
  ROWS,
  COLS,
  GRIDSIZE,
  CELLSIZE,
  DIRECTIONS,
  SHIPCOLOR,
  HITCOLOR,
  BGCOLOR,
  MISSCOLOR,
	MISS,
	HIT,
	SUNK,
	DUPLICATED,
} from './constants';
import {checkShipsForTile,
			  detectAdjacentShips,
			  randomTile,
			  buildAdjacencyArray,
			  addRandomPosition} from './battleship-helper';

import * as TeamPlayer1 from './players/Player';
import * as TeamPlayer2 from './players/Player2';


var playerOne = new Player(TeamPlayer1);
var playerTwo = new Player(TeamPlayer2);
var turnCounter = null;

function Player(teamPlayer) {
  this.hitTiles = [];
  this.missTiles = [];
	this.shipArray = shipsCopy();
	this.turnCount = 0;

  this.name = teamPlayer.getName();
  this.attack = teamPlayer.attack;
  this.attackResult = teamPlayer.attackResult;
}

function Tile(row, col) {
  this.row = row;
  this.col = col;
  this.hit = false;
  this.miss = false;
  this.ship = false;
}

Tile.prototype = {
      detectAdjacentShips:
    function () {
      if (this.row - 1 === 0) {

      }
    },

  detectAdjacentMisses: function (misses, startTile) {
      var adjacent = buildAdjacencyArray(startTile);
      var match = false;
      adjacent.forEach(function(tileObj, index, array) {
        if (misses.indexOf(tileObj.tile) != -1) {
          match = true;
          return;
        }
      });
      return match;
    },

  findAdjacentHits: function (hits, startTile) {
      var adjacent = buildAdjacencyArray(startTile);
      var match, direction;
      adjacent.forEach(function(tileObj, index, array) {
        match = hits.indexOf(tileObj.tile)
        if (match != -1) {
          direction = tileObj.direction;
        }
      });
      return direction;
    }
}

function detectAdjacentMisses(misses, startTile) {
  var adjacent = buildAdjacencyArray(startTile);
  var match = false;
  adjacent.forEach(function(tileObj, index, array) {
    if (misses.indexOf(tileObj.tile) != -1) {
      match = true;
      return;
    }
  });
  return match;
}

function findAdjacentHits(hits, startTile) {
  var adjacent = buildAdjacencyArray(startTile);
  var match, direction;
  adjacent.forEach(function(tileObj, index, array) {
    match = hits.indexOf(tileObj.tile)
    if (match != -1) {
      direction = tileObj.direction;
    }
  });
  return direction;
}

function checkForShip(player, tile) {
  var foundShip = null;
  player.shipArray.forEach(function(ship, index, array) {
    if (ship.tilesOccupied.indexOf(tile) != -1 && ship.health > 0) {
      foundShip = ship;
    }
  });
  console.log(foundShip);
  return foundShip;
};

function damageShip(player, ship) {
	var hitType = HIT;
  ship.health -= 1;
  if (ship.health == 0) {
    var index = player.shipArray.indexOf(ship);
    if (index != -1) {
			hitType = SUNK;
      drawMessage(player.messageArea, player.name + "'s " + ship.shipType + " has been sunk.");
      player.shipArray.splice(index, 1);
    }
  }
	return hitType;
};

function playerLost(player) {
  let isPlayerLost =  player.shipArray.length == 0;
  if (isPlayerLost) {
    drawMessage(player, "Ah, poor " + player.name  + ". Didn't stand a chance.");
  }
  return isPlayerLost;
}

function guessCheck(player, guess) {
  console.log("Checking guess: " + guess);
  return (player.missTiles.indexOf(guess) == -1 && player.hitTiles.indexOf(guess) == -1); //true if guess was not used before
}

function removeTile(ship, tile) {
  var index = ship.tilesOccupied.indexOf(tile);
  return ship.tilesOccupied.splice(index, 1).join("");
}

// ---------------------
// Entry point
// ---------------------
window.onload = function () {
  draw();
}

function draw() {
  turnCounter = document.getElementById("number-of-turns");
  var player1Grid = document.getElementById("main-grid");
  var player2Grid = document.getElementById("hit-miss-grid");
  var player1Ctx = player1Grid.getContext("2d");
  var player2Ctx = player2Grid.getContext("2d");
  playerOne.grid = player1Grid;
  playerOne.context = player1Ctx;
  playerTwo.grid = player2Grid;
  playerTwo.context = player2Ctx;
  playerOne.messageArea = document.getElementById("message-area-one");
  playerTwo.messageArea = document.getElementById("message-area-two");
  playerOne.nameArea = document.getElementById("first-player-name");
  playerTwo.nameArea = document.getElementById("second-player-name");
  newGame();
}

//=====================================____GAME____======================================================

function newGame() {
  drawMessage(playerOne.nameArea, playerOne.name);
  drawMessage(playerTwo.nameArea, playerTwo.name);
  playerOne.shipArray.forEach(addRandomPosition);
  playerTwo.shipArray.forEach(addRandomPosition);
  drawBoardFor(playerOne);
  drawBoardFor(playerTwo);
  turnGame(playerOne, playerTwo);
}

function turnGame(playerOne, playerTwo) { //while players not lost request them to new turn else game finished
  if (playerLost(playerOne) == false && playerLost(playerTwo) == false) {
		playerOne.turnCount++;
    setTimeout( cpuTurn, 1000, playerOne, playerTwo);
  }
}

function cpuTurn(attacker, victim) {
  var attackCoord = attacker.attack(); //request shot coordinates player bot (attacker) !!!
  let attackResult = attackHandler(attacker, victim, attackCoord);
  attacker.attackResult(attackResult, attackCoord); // return to bot atackResult  may be need here new thread
  refreshGrid(attacker, victim.context, CELLSIZE);
  if (attackResult != DUPLICATED) {
    let letterCoord = characterToCoord(attackCoord.slice(0, 1));
    let numberCoord = rowNumberToCoord(attackCoord.slice(1, attackCoord.length));
    //animateHitMissText(attackResult, [letterCoord, numberCoord], attacker, victim);
    }
  if (playerLost(victim)) {
    drawMessage(attacker.messageArea, "Ah, poor " + victim.name  + ". Didn't stand a chance.");
		drawMessage(turnCounter, "  Congratulations to " + attacker.name + " !!! He won in " + attacker.turnCount + " turns.");
  } else if (attackResult == HIT || attackResult == SUNK) {
    turnGame(attacker, victim);
  } else {
    turnGame(victim, attacker);
  }
}

function attackHandler(attacker, victim, tile) {
	var attackResult = '';
  if (guessCheck(attacker, tile)) {
    drawMessage(victim.messageArea, "Attacking " + victim.name + " in tile " + tile);
    var ship = checkForShip(victim, tile);
    if (ship != null) {
      drawMessage(victim.messageArea, "Booyah! A hit on " + victim.name + "!");
      attackResult = damageShip(victim, ship);
      attacker.hitTiles.push(removeTile(ship, tile));
    }
    else {
			attackResult = MISS;
      drawMessage(victim.messageArea, "Ohh! That was a bad miss.");
      attacker.missTiles.push(tile);
    }
  }
  else {
    drawMessage(attacker.messageArea, "You've already tried that tile. Pick another one.");
    attackResult = DUPLICATED;
  }

	return attackResult;
};

function drawBoardFor(player) {
  drawBG(player.context);
	drawShips(player.shipArray, player.context);
  drawGrid(player.context, CELLSIZE);
}

function refreshGrid(player, context, cellSize) {
  drawHits(player, context);
  drawMisses(player, context);
  drawGrid(context, cellSize);
}

function drawHits(player, context) {
  context.fillStyle = HITCOLOR;
  drawTileArray(player.hitTiles, context);
}

function drawMisses(player, context) {
  context.fillStyle = MISSCOLOR;
  drawTileArray(player.missTiles, context);
}

function drawMessage(element, message) {
  element.innerHTML = message;
}

function appendMessage(element, message) {
  element.innerHTML = element.innerHTML + "\n" + message;
}

function characterToCoord(x) { // receiving a letter exmp A
  return  ROWS.indexOf(x);
}

function rowNumberToCoord(y) { // receiving a number exmp 10
  return COLS[+y - 1];
}

function drawGrid(context, cellSize) {
  for (var x=0; x < GRIDSIZE; x++) {
    for (var y=0; y < GRIDSIZE; y++) {
      context.strokeRect(x * cellSize,y * cellSize,cellSize,cellSize);
    };
  };
}

function drawBG(context) {
  context.fillStyle = BGCOLOR;
  context.fillRect(0, 0, GRIDSIZE * CELLSIZE, GRIDSIZE * CELLSIZE);
}

function drawShips(ships, context) {
  var type;
  context.fillStyle = SHIPCOLOR;
  ships.forEach(function(ship, index, array) {
    type = ship.shipType[0];
    drawTileArray(ship.tilesOccupied, context);
  });
}

function drawTileArray(array, context) {
  var row, col;
  array.forEach(function(tile, index, array) {
    row = ROWS.indexOf(tile[0]);
    col = tile.slice(1) - 1;
    context.fillRect(col * CELLSIZE,row * CELLSIZE,CELLSIZE,CELLSIZE);
  });
}

//UI drawers and animations

function animateHitMissText(hit, coords, attacker, victim) {
  var newCoords;
  if (coords[0] <= 320) {
    newCoords = [(coords[0] + 20), (coords[1] + 20)];
  }
  else {
    newCoords = [(coords[0] - 110), (coords[1] + 20)];
  }
  var canvasSize = GRIDSIZE * CELLSIZE;
  var totalSteps = 60;
  var step = 0;
  var text = hit;
	var rgba = null
  if (hit == MISS) {
    rgba = "rgba(237,83,0,1)";
  }
  else {
    rgba = "rgba(0,130,23,1)";
  }
  var fadeIn = setInterval(function() {
    attacker.context.clearRect(0, 0, canvasSize, canvasSize);
    drawBoardFor(attacker);
    refreshGrid(victim, attacker.context, CELLSIZE);
    attacker.context.save();
    attacker.context.font = "38px itcMachine";
    attacker.context.fillStyle = rgba + (step / 30) + ")";
    attacker.context.strokeStyle = "1px rgba(255,255,255,0.3)";
    attacker.context.fillText(text, newCoords[0], newCoords[1]);
    attacker.context.strokeText(text, newCoords[0], newCoords[1]);
    attacker.context.restore();
    step += 1;
    if (step > (totalSteps / 2)) {
      clearInterval(fadeIn);
      step = 0;
      var fadeOut = setInterval(function() {
        attacker.context.clearRect(0, 0, canvasSize, canvasSize);
				drawBoardFor(attacker);
        refreshGrid(victim, attacker.context, CELLSIZE);
        attacker.context.save();
        attacker.context.font = (38 - (step / 5)) + "px itcMachine";
        attacker.context.fillStyle = rgba + (1 - (step / 60)) + ")";
        attacker.context.strokeStyle = "1px rgba(255,255,255,0.3)";
        attacker.context.fillText(text, newCoords[0], newCoords[1]);
        attacker.context.strokeText(text, newCoords[0], newCoords[1]);
        attacker.context.restore();
        step += 1;
        if (step > totalSteps) {
          clearInterval(fadeOut);
          attacker.context.clearRect(0, 0, canvasSize, canvasSize);
          drawBoardFor(attacker);
        }
      }, 1);
    }
  }, 1);
}

// function clickHandler(event) {
//   console.log(event);
//   var coords = getPosition(event);
//   var column = coordToColumn(coords[0]);
//   var row = coordToRow(coords[1]);
//   var tile = row + column;
//   var hit = attack(playerOne, playerTwo, tile);
//   if (hit != null) {
//     drawBG(playerTwo.context);
//     refreshGrid(playerOne, playerTwo.context, CELLSIZE);
//     animateHitMissText(hit, coords, playerTwo.context);
//     event.srcElement.removeEventListener("mousedown", clickHandler, false);
//     if (playerLost(playerTwo)) {
//       drawMessage(playerTwo.messageArea, "Shucks, I lost to the puny human.");
//     }
//     else {
//       cpuTurn(playerTwo, playerOne);
//     }
//   }
// }

