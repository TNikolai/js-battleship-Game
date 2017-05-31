(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oppositeDirection = exports.nextColDown = exports.nextColUp = exports.nextRowUp = exports.nextRowDown = exports.buildAdjacencyArray = exports.getOrientation = exports.randomTile = exports.detectAdjacentShips = exports.getStartingHealth = exports.checkShipsForTile = exports.addRandomPosition = undefined;

var _constants = require("./constants");

var tileAttempts = 0;

function checkShipsForTile(ships, tile) {
  var match = false;
  ships.forEach(function (ship, index, array) {
    if (ship.tilesOccupied.indexOf(tile) != -1) {
      console.log("Ship found on " + tile);
      match = true;
    }
  });
  return match;
}

function randomTile() {
  return _constants.ROWS[Math.floor(Math.random() * _constants.GRIDSIZE)] + _constants.COLS[Math.floor(Math.random() * _constants.GRIDSIZE)];
};

function getStartingHealth(type) {
  var health = null;
  _constants.SHIPS.forEach(function (ship, index, array) {
    if (ship.shipType === type) {
      health = ship.health;
    }
  });
  if (health == null) {
    console.log("-----------Bad Ship Type!!!-------------");
  }
  return health;
};

function detectAdjacentShips(ships, startTile) {
  var adjacent = buildAdjacencyArray(startTile);
  var match = false;
  adjacent.forEach(function (tileObj, index, array) {
    if (checkShipsForTile(ships, tileObj.tile)) {
      match = true;
      return;
    }
  });
  return match;
}

function getOrientation(ships, shipSize, startTile) {
  var dirIndex;
  var initialRow = startTile[0];
  var initialCol = startTile.slice(1);
  var dirFound = false;
  var attempts = 0;
  while (dirFound == false) {
    attempts += 1;
    if (attempts > 70) {
      break;
    }
    dirIndex = Math.floor(Math.random() * 3);
    if (dirIndex == 0 && !(_constants.GRIDSIZE - shipSize < _constants.ROWS.indexOf(initialRow)) && !detectUpCollision(ships, shipSize, startTile)) {
      dirFound = true;
    } else if (dirIndex == 1 && !(_constants.GRIDSIZE - shipSize < _constants.COLS.indexOf(initialCol)) && !detectRightCollision(ships, shipSize, startTile)) {
      dirFound = true;
    } else if (dirIndex == 2 && !(shipSize - 1 > _constants.ROWS.indexOf(initialRow)) && !detectDownCollision(ships, shipSize, startTile)) {
      dirFound = true;
    } else if (dirIndex == 3 && !(shipSize - 1 > _constants.COLS.indexOf(initialCol)) && !detectLeftCollision(ships, shipSize, startTile)) {
      dirFound = true;
    }
  }
  if (dirFound) {
    return _constants.DIRECTIONS[dirIndex];
  } else {
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
  var adjacent = [];
  adjacent.push({ direction: "right", tile: startTile[0] + nextColUp(startTile.slice(1)) });
  adjacent.push({ direction: "left", tile: startTile[0] + nextColDown(startTile.slice(1)) });
  adjacent.push({ direction: "down", tile: nextRowUp(startTile[0]) + startTile.slice(1) });
  adjacent.push({ direction: "up", tile: nextRowDown(startTile[0]) + startTile.slice(1) });

  adjacent.push({ dirrection: 'top-left', tile: nextRowDown(startTile[0]) + nextColDown(startTile.slice(1)) }); // nearest diagonals
  adjacent.push({ dirrection: 'bottom-left', tile: nextRowUp(startTile[0]) + nextColDown(startTile.slice(1)) });
  adjacent.push({ dirrection: 'top-right', tile: nextRowDown(startTile[0]) + nextColUp(startTile.slice(1)) });
  adjacent.push({ dirrection: 'bottom-right', tile: nextRowUp(startTile[0]) + nextColUp(startTile.slice(1)) });

  return adjacent;
}

function oppositeDirection(direction) {
  if (direction == "left") {
    return "right";
  }
  if (direction == "right") {
    return "left";
  }
  if (direction == "up") {
    return "down";
  }
  if (direction == "down") {
    return "up";
  }
}

function nextColDown(col) {
  return _constants.COLS[_constants.COLS.indexOf(col) - 1];
}

function nextColUp(col) {
  return _constants.COLS[_constants.COLS.indexOf(col) + 1];
}

function nextRowDown(row) {
  return _constants.ROWS[_constants.ROWS.indexOf(row) - 1];
};

function nextRowUp(row) {
  return _constants.ROWS[_constants.ROWS.indexOf(row) + 1];
};

function addRandomPosition(ship, index, ships) {
  console.log("Adding positions for " + ship.shipType);
  var size = getStartingHealth(ship.shipType);
  var dir = false;
  var currentTile;
  if (size != null) {
    while (dir == false) {
      tileAttempts += 1;
      console.log("Tile attempts: " + tileAttempts);
      currentTile = randomTile();
      while (detectAdjacentShips(ships, currentTile)) {
        // You cant use this point because near this point u have ship !!!
        tileAttempts += 1;
        console.log("Tile attempts: " + tileAttempts);
        currentTile = randomTile();
      }
      console.log("Generating direction for " + ship.shipType + " starting in " + currentTile);
      dir = getOrientation(ships, size, currentTile);
    }
    console.log("Going in direction " + dir + " from " + currentTile + " for " + ship.shipType);

    while (ship.tilesOccupied.length < size) {
      console.log("---------------currentTile");
      console.log(currentTile);
      ship.tilesOccupied.push(currentTile);
      var nextTile = currentTile;
      for (var i = 1; i < size; i++) {
        if (dir == "up") {
          nextTile = nextRowUp(nextTile[0]) + nextTile.slice(1);
        } else if (dir == "right") {
          nextTile = nextTile[0] + nextColUp(nextTile.slice(1));
        } else if (dir == "down") {
          nextTile = nextRowDown(nextTile[0]) + nextTile.slice(1);
        } else {
          nextTile = nextTile[0] + nextColDown(nextTile.slice(1));
        }
        console.log("---------------nextTile");
        console.log(nextTile);
        ship.tilesOccupied.push(nextTile);
      }
    }
  }
}

exports.addRandomPosition = addRandomPosition;
exports.checkShipsForTile = checkShipsForTile;
exports.getStartingHealth = getStartingHealth;
exports.detectAdjacentShips = detectAdjacentShips;
exports.randomTile = randomTile;
exports.getOrientation = getOrientation;
exports.buildAdjacencyArray = buildAdjacencyArray;
exports.nextRowDown = nextRowDown;
exports.nextRowUp = nextRowUp;
exports.nextColUp = nextColUp;
exports.nextColDown = nextColDown;
exports.oppositeDirection = oppositeDirection;

},{"./constants":3}],2:[function(require,module,exports){
'use strict';

var _constants = require('./constants');

var _battleshipHelper = require('./battleship-helper');

var _Player = require('./players/Player');

var TeamPlayer1 = _interopRequireWildcard(_Player);

var _Player2 = require('./players/Player2');

var TeamPlayer2 = _interopRequireWildcard(_Player2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var playerOne = new Player(TeamPlayer1);
var playerTwo = new Player(TeamPlayer2);
var turnCounter = null;

function Player(teamPlayer) {
  this.hitTiles = [];
  this.missTiles = [];
  this.shipArray = (0, _constants.shipsCopy)();
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
  detectAdjacentShips: function detectAdjacentShips() {
    if (this.row - 1 === 0) {}
  },

  detectAdjacentMisses: function detectAdjacentMisses(misses, startTile) {
    var adjacent = (0, _battleshipHelper.buildAdjacencyArray)(startTile);
    var match = false;
    adjacent.forEach(function (tileObj, index, array) {
      if (misses.indexOf(tileObj.tile) != -1) {
        match = true;
        return;
      }
    });
    return match;
  },

  findAdjacentHits: function findAdjacentHits(hits, startTile) {
    var adjacent = (0, _battleshipHelper.buildAdjacencyArray)(startTile);
    var match, direction;
    adjacent.forEach(function (tileObj, index, array) {
      match = hits.indexOf(tileObj.tile);
      if (match != -1) {
        direction = tileObj.direction;
      }
    });
    return direction;
  }
};

function detectAdjacentMisses(misses, startTile) {
  var adjacent = (0, _battleshipHelper.buildAdjacencyArray)(startTile);
  var match = false;
  adjacent.forEach(function (tileObj, index, array) {
    if (misses.indexOf(tileObj.tile) != -1) {
      match = true;
      return;
    }
  });
  return match;
}

function findAdjacentHits(hits, startTile) {
  var adjacent = (0, _battleshipHelper.buildAdjacencyArray)(startTile);
  var match, direction;
  adjacent.forEach(function (tileObj, index, array) {
    match = hits.indexOf(tileObj.tile);
    if (match != -1) {
      direction = tileObj.direction;
    }
  });
  return direction;
}

function checkForShip(player, tile) {
  var foundShip = null;
  player.shipArray.forEach(function (ship, index, array) {
    if (ship.tilesOccupied.indexOf(tile) != -1 && ship.health > 0) {
      foundShip = ship;
    }
  });
  console.log(foundShip);
  return foundShip;
};

function damageShip(player, ship) {
  var hitType = _constants.HIT;
  ship.health -= 1;
  if (ship.health == 0) {
    var index = player.shipArray.indexOf(ship);
    if (index != -1) {
      hitType = _constants.SUNK;
      drawMessage(player.messageArea, player.name + "'s " + ship.shipType + " has been sunk.");
      player.shipArray.splice(index, 1);
    }
  }
  return hitType;
};

function playerLost(player) {
  var isPlayerLost = player.shipArray.length == 0;
  if (isPlayerLost) {
    drawMessage(player, "Ah, poor " + player.name + ". Didn't stand a chance.");
  }
  return isPlayerLost;
}

function guessCheck(player, guess) {
  console.log("Checking guess: " + guess);
  return player.missTiles.indexOf(guess) == -1 && player.hitTiles.indexOf(guess) == -1; //true if guess was not used before
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
};

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
  playerOne.shipArray.forEach(_battleshipHelper.addRandomPosition);
  playerTwo.shipArray.forEach(_battleshipHelper.addRandomPosition);
  drawBoardFor(playerOne);
  drawBoardFor(playerTwo);
  turnGame(playerOne, playerTwo);
}

function turnGame(playerOne, playerTwo) {
  //while players not lost request them to new turn else game finished
  if (playerLost(playerOne) == false && playerLost(playerTwo) == false) {
    playerOne.turnCount++;
    setTimeout(cpuTurn, 1000, playerOne, playerTwo);
  }
}

function cpuTurn(attacker, victim) {
  var attackCoord = attacker.attack(); //request shot coordinates player bot (attacker) !!!
  var attackResult = attackHandler(attacker, victim, attackCoord);
  attacker.attackResult(attackResult, attackCoord); // return to bot atackResult  may be need here new thread
  refreshGrid(attacker, victim.context, _constants.CELLSIZE);
  if (attackResult != _constants.DUPLICATED) {
    var letterCoord = characterToCoord(attackCoord.slice(0, 1));
    var numberCoord = rowNumberToCoord(attackCoord.slice(1, attackCoord.length));
    //animateHitMissText(attackResult, [letterCoord, numberCoord], attacker, victim);
  }
  if (playerLost(victim)) {
    drawMessage(attacker.messageArea, "Ah, poor " + victim.name + ". Didn't stand a chance.");
    drawMessage(turnCounter, "  Congratulations to " + attacker.name + " !!! He won in " + attacker.turnCount + " turns.");
  } else if (attackResult == _constants.HIT || attackResult == _constants.SUNK) {
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
    } else {
      attackResult = _constants.MISS;
      drawMessage(victim.messageArea, "Ohh! That was a bad miss.");
      attacker.missTiles.push(tile);
    }
  } else {
    drawMessage(attacker.messageArea, "You've already tried that tile. Pick another one.");
    attackResult = _constants.DUPLICATED;
  }

  return attackResult;
};

function drawBoardFor(player) {
  drawBG(player.context);
  drawShips(player.shipArray, player.context);
  drawGrid(player.context, _constants.CELLSIZE);
}

function refreshGrid(player, context, cellSize) {
  drawHits(player, context);
  drawMisses(player, context);
  drawGrid(context, cellSize);
}

function drawHits(player, context) {
  context.fillStyle = _constants.HITCOLOR;
  drawTileArray(player.hitTiles, context);
}

function drawMisses(player, context) {
  context.fillStyle = _constants.MISSCOLOR;
  drawTileArray(player.missTiles, context);
}

function drawMessage(element, message) {
  element.innerHTML = message;
}

function appendMessage(element, message) {
  element.innerHTML = element.innerHTML + "\n" + message;
}

function characterToCoord(x) {
  // receiving a letter exmp A
  return _constants.ROWS.indexOf(x);
}

function rowNumberToCoord(y) {
  // receiving a number exmp 10
  return _constants.COLS[+y - 1];
}

function drawGrid(context, cellSize) {
  for (var x = 0; x < _constants.GRIDSIZE; x++) {
    for (var y = 0; y < _constants.GRIDSIZE; y++) {
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };
  };
}

function drawBG(context) {
  context.fillStyle = _constants.BGCOLOR;
  context.fillRect(0, 0, _constants.GRIDSIZE * _constants.CELLSIZE, _constants.GRIDSIZE * _constants.CELLSIZE);
}

function drawShips(ships, context) {
  var type;
  context.fillStyle = _constants.SHIPCOLOR;
  ships.forEach(function (ship, index, array) {
    type = ship.shipType[0];
    drawTileArray(ship.tilesOccupied, context);
  });
}

function drawTileArray(array, context) {
  var row, col;
  array.forEach(function (tile, index, array) {
    row = _constants.ROWS.indexOf(tile[0]);
    col = tile.slice(1) - 1;
    context.fillRect(col * _constants.CELLSIZE, row * _constants.CELLSIZE, _constants.CELLSIZE, _constants.CELLSIZE);
  });
}

//UI drawers and animations

function animateHitMissText(hit, coords, attacker, victim) {
  var newCoords;
  if (coords[0] <= 320) {
    newCoords = [coords[0] + 20, coords[1] + 20];
  } else {
    newCoords = [coords[0] - 110, coords[1] + 20];
  }
  var canvasSize = _constants.GRIDSIZE * _constants.CELLSIZE;
  var totalSteps = 60;
  var step = 0;
  var text = hit;
  var rgba = null;
  if (hit == _constants.MISS) {
    rgba = "rgba(237,83,0,1)";
  } else {
    rgba = "rgba(0,130,23,1)";
  }
  var fadeIn = setInterval(function () {
    attacker.context.clearRect(0, 0, canvasSize, canvasSize);
    drawBoardFor(attacker);
    refreshGrid(victim, attacker.context, _constants.CELLSIZE);
    attacker.context.save();
    attacker.context.font = "38px itcMachine";
    attacker.context.fillStyle = rgba + step / 30 + ")";
    attacker.context.strokeStyle = "1px rgba(255,255,255,0.3)";
    attacker.context.fillText(text, newCoords[0], newCoords[1]);
    attacker.context.strokeText(text, newCoords[0], newCoords[1]);
    attacker.context.restore();
    step += 1;
    if (step > totalSteps / 2) {
      clearInterval(fadeIn);
      step = 0;
      var fadeOut = setInterval(function () {
        attacker.context.clearRect(0, 0, canvasSize, canvasSize);
        drawBoardFor(attacker);
        refreshGrid(victim, attacker.context, _constants.CELLSIZE);
        attacker.context.save();
        attacker.context.font = 38 - step / 5 + "px itcMachine";
        attacker.context.fillStyle = rgba + (1 - step / 60) + ")";
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

},{"./battleship-helper":1,"./constants":3,"./players/Player":4,"./players/Player2":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SHIPS = [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] }, { shipType: "Battleship", health: 4, tilesOccupied: [] }, { shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }];
// const SHIPS = [{ shipType: "Battleship", health: 4, tilesOccupied: [] },
// 			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
// 			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] }
// 						  ];

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var GRIDSIZE = 10;
var CELLSIZE = 40;
var DIRECTIONS = ["up", "right", "down", "left"];
var SHIPCOLOR = "green";
var HITCOLOR = "rgb(219, 57, 57)";
var BGCOLOR = "rgb(191, 234, 255)";
var MISSCOLOR = "white";

var MISS = 'MISS';
var HIT = 'HIT';
var SUNK = 'SUNK';
var DUPLICATED = 'DUPLICATED';

function shipsCopy() {
  return JSON.parse(JSON.stringify(SHIPS));
}

exports.SHIPS = SHIPS;
exports.shipsCopy = shipsCopy;
exports.ROWS = ROWS;
exports.COLS = COLS;
exports.GRIDSIZE = GRIDSIZE;
exports.CELLSIZE = CELLSIZE;
exports.DIRECTIONS = DIRECTIONS;
exports.SHIPCOLOR = SHIPCOLOR;
exports.HITCOLOR = HITCOLOR;
exports.BGCOLOR = BGCOLOR;
exports.MISSCOLOR = MISSCOLOR;
exports.MISS = MISS;
exports.HIT = HIT;
exports.SUNK = SUNK;
exports.DUPLICATED = DUPLICATED;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attackResult = exports.attack = exports.getName = undefined;

var _constants = require('../constants');

var _battleshipHelper = require('../battleship-helper');

var bot = {
  hitTiles: [],
  missTiles: [],
  opponent: null,
  lastGuesses: [{ hit: false, tile: "" }, { hit: false, tile: "" }],
  nextGuesses: []
};

function getName() {
  return "Hero";
};

function attackResult(isHit, coordinates) {
  //handle here attackResult if isHit == true then your attack was successfull.
  //coordinates is previos attacked coordinates.
  if (isHit) {
    addLastGuess(bot, { hit: true, tile: coordinates });
    bot.hitTiles.push(coordinates);
  } else {
    addLastGuess(bot, { hit: false, tile: coordinates });
    bot.missTiles.push(coordinates);
  }
};

function attack() {
  var nextGuess = cpuTilePick(bot);
  return (0, _battleshipHelper.randomTile)();
};

// Player attack funtionality -----------------------------------

function guessesAfterHit(cpu, tile) {
  var guesses = [];
  var newTile;
  if (tile && tile[0] != _constants.ROWS[0]) {
    guesses.push((0, _battleshipHelper.nextRowDown)(tile[0]) + tile.slice(1));
  }
  if (tile && tile[1] != _constants.COLS[0]) {
    guesses.push(tile[0] + (0, _battleshipHelper.nextColDown)(tile.slice(1)));
  }
  if (tile && tile[0] != _constants.ROWS[_constants.GRIDSIZE - 1]) {
    guesses.push((0, _battleshipHelper.nextRowUp)(tile[0]) + tile.slice(1));
  }
  if (tile && tile[1] != _constants.COLS[_constants.GRIDSIZE - 1]) {
    guesses.push(tile[0] + (0, _battleshipHelper.nextColUp)(tile.slice(1)));
  }
  return guesses;
}

function guessCheck(player, guess) {
  console.log("Checking guess: " + guess);
  return player.missTiles.indexOf(guess) == -1 && player.hitTiles.indexOf(guess) == -1;
}

var extrapolateMovement = function extrapolateMovement(tile1, tile2) {
  var rowDiff = _constants.ROWS.indexOf(tile2[0]) - _constants.ROWS.indexOf(tile1[0]);
  var colDiff = tile2.slice(1) - tile1.slice(1);
  console.log("Extropolate" + tile1 + tile2);
  console.log(_constants.ROWS[_constants.ROWS.indexOf(tile2[0]) + rowDiff]);
  return _constants.ROWS[_constants.ROWS.indexOf(tile2[0]) + rowDiff] + (parseInt(tile2.slice(1)) + colDiff);
};

var addLastGuess = function addLastGuess(player, guess) {
  if (player.lastGuesses.unshift(guess) > 5) {
    player.lastGuesses.pop();
  }
};

function removeTile(ship, tile) {
  var index = ship.tilesOccupied.indexOf(tile);
  return ship.tilesOccupied.splice(index, 1).join("");
}

function cpuTilePick(cpu) {
  var startTile, nextTile, newGuess;
  var guessCount = 0;
  if (cpu.lastGuesses[0].hit && !cpu.lastGuesses[0].sunk) {
    startTile = cpu.lastGuesses[0].tile;
    if (cpu.lastGuesses[1].hit) {
      newGuess = extrapolateMovement(cpu.lastGuesses[1].tile, cpu.lastGuesses[0].tile);
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
        cpu.nextGuesses = cpu.nextGuesses.concat(guessesAfterHit(cpu, nextTile));
      } else {
        cpu.nextGuesses = cpu.nextGuesses.concat(guessesAfterHit(cpu, startTile));
      }
    } else {
      cpu.nextGuesses = guessesAfterHit(cpu, startTile);
    }
    while (cpu.nextGuesses.length > 0 && nextTile == undefined) {
      console.log("while (cpu.nextGuesses.length > 0 && nextTile == undefined)");
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  } else if (!cpu.lastGuesses[0].sunk) {
    while (cpu.nextGuesses.length > 0 && nextTile == undefined) {
      console.log("while (cpu.nextGuesses.length > 0 && nextTile == undefined) {");
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  }
  if (nextTile == undefined) {
    nextTile = (0, _battleshipHelper.randomTile)();
    while (guessCheck(cpu, nextTile) == false || detectAdjacentMisses(cpu.missTiles, nextTile)) {
      console.log("while (guessCheck(cpu, nextTile) == false || detectAdjacentMisses(cpu.missTiles, nextTile)) {");
      nextTile = (0, _battleshipHelper.randomTile)();
      guessCount += 1;
      if (guessCheck(cpu, nextTile) && guessCount > 50) {
        break;
      }
    }
  }
  return nextTile;
}

function detectAdjacentMisses(misses, startTile) {
  var adjacent = (0, _battleshipHelper.buildAdjacencyArray)(startTile);
  var match = false;
  adjacent.forEach(function (tileObj, index, array) {
    if (misses.indexOf(tileObj.tile) != -1) {
      match = true;
      return;
    }
  });
  return match;
}

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{"../battleship-helper":1,"../constants":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attackResult = exports.attack = exports.getName = undefined;

var _constants = require('../constants');

var _battleshipHelper = require('../battleship-helper');

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "Navi";
};

/**
 * @param {Boolean} isHit if isHit == true then your attack was successfull.
 * @param {String} coordinates Previos attacked coordinates.
 * @return {void}
 */
function attackResult(isHit, coordinates) {};

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
  return (0, _battleshipHelper.randomTile)();
};

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{"../battleship-helper":1,"../constants":3}]},{},[2]);
