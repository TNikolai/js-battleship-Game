
//=======================================================CONSTANTS:

var SHIPS = [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] }, { shipType: "Battleship", health: 4, tilesOccupied: [] },
{ shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }];

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var GRIDSIZE = 10;
var P1CELLSIZE = 40;
var P2CELLSIZE = 40;
var CELLSIZE = 40;
var CIRCLESIZE = 15;
var DIRECTIONS = ["up", "right", "down", "left"];
var SHIPCOLOR = "green";
var HITCOLOR = "rgb(219, 57, 57)";
var BGCOLOR = "rgb(191, 234, 255)";
var MISSCOLOR = "white";

//===================================================Players CODE:


function attackResult(isHit, coordinates) {
  //handle here attackResult if isHit == true then your attack is successfull
};

function attack() {
  return randomTile();
};

function randomTile() {
  return ROWS[Math.floor(Math.random() * GRIDSIZE)] + COLS[Math.floor(Math.random() * GRIDSIZE)];
};

//request bot to return ships array positions

//===================================================GAME ENGINE

var playerOne = new Player("Player 1", attack, attackResult);
var playerTwo = new Player("Player 2", attack, attackResult);
playerOne.opponent = playerTwo;
playerTwo.opponent = playerOne;
var tileAttempts = 0;
var start;
var turnCounter = null;

function Player(name, attack) {
  this.board = new GameBoard(GRIDSIZE);
  this.hitTiles = [];
  this.missTiles = [];
  this.opponent = null;
  this.lastGuesses = [{ hit: false, tile: ""}, { hit: false, tile: ""}];
  this.nextGuesses = [];
  
  this.name = name;
  this.attack = attack;
  this.attackResult = attackResult;
  this.shipArray = new ShipArray();
}

function ShipArray() {
  return [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] }, { shipType: "Battleship", health: 4, tilesOccupied: [] },
          { shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }];
}

function Tile(board, row, col) {
  this.board = board;
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

function GameBoard(size) {
  this.board = [];
  var newRow;
  for (var r = 0; r < size; r++) {
    newRow = [];
    for (var c = 0; c < size; c++) {
      newRow.push(new Tile(r, c));
    }
  }
}

GameBoard.prototype = {

}

function getStartingHealth(type) {
  var health = null;
  SHIPS.forEach(function(ship, index, array) {
    if (ship.shipType === type) {
      health = ship.health;
    }
  });
  // Raise "Bad Ship Type" error?
  return health;
};

function getOrientation(ships, shipSize, startTile) {
  var dirIndex;
  var initialRow = startTile[0];
  var initialCol = startTile.slice(1);
  var dirFound = false;
  var attempts = 0;
  while (dirFound == false) {
    attempts += 1;
    if (attempts > 50) {
      break;
    }
    dirIndex = Math.floor(Math.random() * 3);
    if (dirIndex == 0 && !(GRIDSIZE - shipSize < ROWS.indexOf(initialRow)) && !(detectUpCollision(ships, shipSize, startTile))) {
      dirFound = true;
    }
    else if (dirIndex == 1 && !(GRIDSIZE - shipSize < COLS.indexOf(initialCol)) && !(detectRightCollision(ships, shipSize, startTile))) {
      dirFound = true;
    }
    else if (dirIndex == 2 && !((shipSize - 1) > ROWS.indexOf(initialRow)) && !(detectDownCollision(ships, shipSize, startTile))) {
      dirFound = true;
    }
    else if (dirIndex == 3 && !((shipSize - 1) > COLS.indexOf(initialCol)) && !(detectLeftCollision(ships, shipSize, startTile))) {
      dirFound = true;
    }
  }
  if (dirFound) {
    return DIRECTIONS[dirIndex];
  }
  else {
    return false;
  }
}

function detectUpCollision(ships, shipSize, startTile) {
  var match = false;
  var tile = startTile;
  for (var i = 0; i < shipSize; i++) {
    if (checkShipsForTile(ships, tile) || detectAdjacentShips(ships, tile)) {
      match = true;
      break;
    }
    tile = nextRowUp(tile[0]) + tile.slice(1);
  }
  return match;
}

function detectDownCollision(ships, shipSize, startTile) {
  var match = false;
  var tile = startTile;
  for (var i = 0; i < shipSize; i++) {
    if (checkShipsForTile(ships, tile) || detectAdjacentShips(ships, tile)) {
      match = true;
      break;
    }
    tile = nextRowDown(tile[0]) + tile.slice(1);
  }
  return match;
}

function detectRightCollision(ships, shipSize, startTile) {
  var match = false;
  var tile = startTile;
  for (var i = 0; i < shipSize; i++) {
    if (checkShipsForTile(ships, tile) || detectAdjacentShips(ships, tile)) {
      match = true;
      break;
    }
    tile = tile[0] + nextColUp(tile.slice(1));
  }
  return match;
}

function detectLeftCollision(ships, shipSize, startTile) {
  var match = false;
  var tile = startTile;
  for (var i = 0; i < shipSize; i++) {
    if (checkShipsForTile(ships, tile) || detectAdjacentShips(ships, tile)) {
      match = true;
      break;
    }
    tile = tile[0] + nextColDown(tile.slice(1));
  }
  return match;
}


function buildAdjacencyArray(startTile) {
  adjacent = [];
  adjacent.push({ direction: "right", tile: startTile[0] + nextColUp(startTile.slice(1))});
  adjacent.push({ direction: "left", tile: startTile[0] + nextColDown(startTile.slice(1))});
  adjacent.push({ direction: "down", tile: nextRowUp(startTile[0]) + startTile.slice(1)});
  adjacent.push({ direction: "up", tile: nextRowDown(startTile[0]) + startTile.slice(1)});
  adjacent.push(nextRowDown(startTile[0]) + nextColDown(startTile.slice(1)));
  adjacent.push(nextRowUp(startTile[0]) + nextColDown(startTile.slice(1)));
  adjacent.push(nextRowDown(startTile[0]) + nextColUp(startTile.slice(1)));
  adjacent.push(nextRowUp(startTile[0]) + nextColUp(startTile.slice(1)));
  return adjacent;
}

function detectAdjacentShips(ships, startTile) {
  var adjacent = buildAdjacencyArray(startTile);
  var match = false;
  adjacent.forEach(function(tileObj, index, array) {
    if (checkShipsForTile(ships, tileObj.tile)) {
      match = true;
      return;
    }
  });
  return match;
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

function oppositeDirection(direction) {
  if (direction == "left") { return "right"; }
  if (direction == "right") { return "left"; }
  if (direction == "up") { return "down"; }
  if (direction == "down") { return "up"; }
}

function nextColDown(col) {
  return COLS[COLS.indexOf(col) - 1];
}

function nextColUp(col) {
  return COLS[COLS.indexOf(col) + 1];
}

function nextRowDown(row) {
  return ROWS[ROWS.indexOf(row) - 1];
};

function nextRowUp(row) {
  return ROWS[ROWS.indexOf(row) + 1];
};

function randomizeShips(player) {
  player.shipArray.forEach(addRandomPosition);
}

function addRandomPosition(ship, index, array) {
  console.log("Adding positions for " + ship.shipType);
  var size = getStartingHealth(ship.shipType);
  var dir = false;
  if (size != null) {
    while (dir == false) {
      tileAttempts += 1;
      console.log("Tile attempts: " + tileAttempts);
      currentTile = randomTile();
      while (detectAdjacentShips(array, currentTile)) {
        tileAttempts += 1;
        console.log("Tile attempts: " + tileAttempts);
        currentTile = randomTile();
      }
      console.log("Generating direction for " + ship.shipType + " starting in " + currentTile);
      dir = getOrientation(array, size, currentTile);
    }
    console.log("Going in direction " + dir + " from " + currentTile + " for " + ship.shipType);
    while (ship.tilesOccupied.length < size) {
      ship.tilesOccupied.push(currentTile);
      var nextTile = currentTile;
      for (var i = 1; i < size; i++) {
        if (dir == "up") {
          nextTile = nextRowUp(nextTile[0]) + nextTile.slice(1);
        }
        else if (dir == "right") {
          nextTile = nextTile[0] + nextColUp(nextTile.slice(1));
        }
        else if (dir == "down") {
          nextTile = nextRowDown(nextTile[0]) + nextTile.slice(1);
        }
        else {
          nextTile = nextTile[0] + nextColDown(nextTile.slice(1));
        }
        ship.tilesOccupied.push(nextTile);
      }
    }
  }
}

function checkShipsForTile(ships, tile) {
  var match = false;
  ships.forEach(function(ship, index, array) {
    if (ship.tilesOccupied.indexOf(tile) != -1) {
      console.log("Ship found on " + tile);
      match = true;
    }
  });
  return match;
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

function addShip(player, type, tiles) {
  tiles.forEach(function(tile) {
    if (checkForShip(player, tile))
      return null;
  });
  player.shipArray.push({
    shipType: type,
    health: getStartingHealth(type),
    tilesOccupied: tiles
  });
};

function damageShip(player, ship) {
  ship.health -= 1;
  if (ship.health == 0) {
    var index = player.shipArray.indexOf(ship);
    if (index != -1) {
      drawMessage(player.messageArea, player.name + "'s " + ship.shipType + " has been sunk.");
      player.shipArray.splice(index, 1);
      player.opponent.lastGuesses[0].sunk = true;
    }
  }
};

function removeTile(ship, tile) {
  var index = ship.tilesOccupied.indexOf(tile);
  return ship.tilesOccupied.splice(index, 1).join("");
}

function totalPlayerHealth(player) {
  var totalHealth = 0
  player.shipArray.forEach(function(ship, index, array) {
    totalHealth += ship.health;
  });
  return totalHealth;
}

function playerLost(player) {
  let isPlayerLost =  player.shipArray.length == 0;
  if (isPlayerLost) {
    drawMessage(player, "Ah, poor " + player.name  + ". Didn't stand a chance.");
  }
  return isPlayerLost;
}

function guessesAfterHit(cpu, tile) {
  var guesses = [];
  var newTile;
  if (tile[0] != ROWS[0]) {
    guesses.push(nextRowDown(tile[0]) + tile.slice(1));
  }
  if (tile[1] != COLS[0]) {
    guesses.push(tile[0] + nextColDown(tile.slice(1)));
  }
  if (tile[0] != ROWS[GRIDSIZE - 1]) {
    guesses.push(nextRowUp(tile[0]) + tile.slice(1));
  }
  if (tile[1] != COLS[GRIDSIZE - 1]) {
    guesses.push(tile[0] + nextColUp(tile.slice(1)));
  }
  return guesses;
}

function guessCheck(player, guess) {
  console.log("Checking guess: " + guess);
  return (player.missTiles.indexOf(guess) == -1 && player.hitTiles.indexOf(guess) == -1); //true if guess was not used before
}

var extrapolateMovement = function(tile1, tile2) {
  var rowDiff = ROWS.indexOf(tile2[0]) - ROWS.indexOf(tile1[0]);
  var colDiff = tile2.slice(1) - tile1.slice(1);
  return ROWS[ROWS.indexOf(tile2[0]) + rowDiff].concat(parseInt(tile2.slice(1)) + colDiff);
}

var addLastGuess = function(player, guess) {
  if (player.lastGuesses.unshift(guess) > 5) {
    player.lastGuesses.pop();
  }
}

// ---------------------
// Entry point 
// ---------------------
function draw() {
  turnCounter = document.getElementById("numberOfTurns");
  var player1Grid = document.getElementById("main-grid");
  var player2Grid = document.getElementById("hit-miss-grid");
  var player1Ctx = player1Grid.getContext("2d");
  var player2Ctx = player2Grid.getContext("2d");
  var turnCount = 0;
  playerOne.grid = player1Grid;
  playerOne.context = player1Ctx;
  playerTwo.grid = player2Grid;
  playerTwo.context = player2Ctx;
  playerOne.messageArea = document.getElementById("message-area-one");
  playerTwo.messageArea = document.getElementById("message-area-two");
  newGame();
}



//=====================================____GAME____======================================================

function newGame() {
  playerOne.shipArray.forEach(addRandomPosition);
  playerTwo.shipArray.forEach(addRandomPosition);
  drawBoardFor(playerOne);
  drawBoardFor(playerTwo);
  turnGame(playerOne, playerTwo);
}

function drawBoardFor(player) {
  drawBG(player.context);
  drawShips(player.shipArray, player.context);
  drawGrid(player.context, CELLSIZE);
}

function turnGame(playerOne, playerTwo) { //while players not lost request them to new turn else game finished
  if (playerLost(playerOne) == false && playerLost(playerTwo) == false) {
    setTimeout( cpuTurn, 1000, playerOne, playerTwo);
  }
  else {
    //appendMessage(turnCounter, "And it only took " + turnCount + " turns.");
    drawMessage(turnCounter, "And it only took " + turnCount + " turns.");
  }
}

function cpuTurn(attacker, victim) {
  var attackCoord = attacker.attack(); //request shot coordinates player bot (attacker) !!! 
  let hit = attackHandler(attacker, victim, attackCoord);
  attacker.attackResult(hit, attackCoord); // return to bot atackResult
  //drawBoardFor(victim);
  refreshGrid(attacker, victim.context, CELLSIZE);
  if (hit != null) {
    let letterCoord = characterToCoord(attackCoord.slice(0, 1));
    let numberCoord = rowNumberToCoord(attackCoord.slice(1, attackCoord.length));
    //drawBG(victim.context);
    //refreshGrid(victim, attacker.context, CELLSIZE);
    //animateHitMissText(hit, [letterCoord, numberCoord], attacker.context);
    }
  if (playerLost(victim)) {
    drawMessage(attacker.messageArea, "Ah, poor " + victim.name  + ". Didn't stand a chance.");
  } else if (hit == true) {
    turnGame(attacker, victim);
  } else {
    turnGame(victim, attacker);
  }
}

function attackHandler(attacker, victim, tile) {
  if (guessCheck(attacker, tile)) {
    drawMessage(victim.messageArea, "Attacking " + victim.name + " in tile " + tile);
    var ship = checkForShip(victim, tile);
    if (ship != null) {
      drawMessage(victim.messageArea, "Booyah! A hit on " + victim.name + "!");
      addLastGuess(attacker, { hit: true, tile: tile });
      damageShip(victim, ship);
      attacker.hitTiles.push(removeTile(ship, tile));
      return true;
    }
    else {
      drawMessage(victim.messageArea, "Ohh! That was a bad miss.");
      addLastGuess(attacker, { hit: false, tile: tile });
      attacker.missTiles.push(tile);
      return false;
    }
  }
  else {
    drawMessage(victim.messageArea, "You've already tried that tile. Pick another one.");
    return null;
  }
};

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

function refreshGrid(player, context, cellSize) {
  drawHits(player, context);
  drawMisses(player, context);
  drawGrid(context, cellSize);
}

function characterToCoord(x) { // receiving a letter exmp A
  console.log(x + "  characterToCoord");
  return  ROWS.indexOf(x);
}

function rowNumberToCoord(y) { // receiving a number exmp 10
  console.log(y + "   rowNumberToCoord");
  return COLS[+y - 1];
}

//UI drawers and animations

function animateHitMissText(hit, coords, context) {

  console.log("Hit or Miss  ", hit);
  console.log("Coordinates  ", coords);
  console.log("Context ", context);

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
  var text;
  if (hit) {
    text = "HIT!";
    rgba = "rgba(0,130,23,";
  }
  else {
    text = "MISS!";
    rgba = "rgba(237,83,0,";
  }
  var fadeIn = setInterval(function() {
    context.clearRect(0, 0, canvasSize, canvasSize);
    drawBG(context);
    refreshGrid(playerOne, context, CELLSIZE);
    context.save();
    context.font = "38px itcMachine";
    context.fillStyle = rgba + (step / 30) + ")";
    context.strokeStyle = "1px rgba(255,255,255,0.3)";
    context.fillText(text, newCoords[0], newCoords[1]);
    context.strokeText(text, newCoords[0], newCoords[1]);
    context.restore();
    step += 1;
    if (step > (totalSteps / 2)) {
      clearInterval(fadeIn);
      step = 0;
      var fadeOut = setInterval(function() {
        context.clearRect(0, 0, canvasSize, canvasSize);
        drawBG(context);
        refreshGrid(playerOne, context, CELLSIZE);
        context.save();
        context.font = (38 - (step / 5)) + "px itcMachine";
        context.fillStyle = rgba + (1 - (step / 60)) + ")";
        context.strokeStyle = "1px rgba(255,255,255,0.3)";
        context.fillText(text, newCoords[0], newCoords[1]);
        context.strokeText(text, newCoords[0], newCoords[1]);
        context.restore();
        step += 1;
        if (step > totalSteps) {
          clearInterval(fadeOut);
          context.clearRect(0, 0, canvasSize, canvasSize);
          drawBG(context);
        }
      }, 1);
    }
  }, 1);
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

// function drawCircleArray(array, context) {
//   var row, col;
//   array.forEach(function(tile, index, array) {
//     row = ROWS.indexOf(tile[0]);
//     col = tile.slice(1) - 1;
//     context.arc(col * CELLSIZE + (CELLSIZE/2), row * CELLSIZE + (CELLSIZE/2), CIRCLESIZE, 0, 2 * Math.PI);
//     context.fill();
//   });
// }


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

