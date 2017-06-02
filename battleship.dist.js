(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oppositeDirection = exports.nextColDown = exports.nextColUp = exports.nextRowUp = exports.nextRowDown = exports.buildAdjacencyArray = exports.getOrientation = exports.randomTile = exports.detectAdjacentShips = exports.getStartingHealth = exports.checkShipsForTile = exports.tileToCoordinates = exports.addRandomPosition = undefined;

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

function tileToCoordinates(tile) {
  var rowIndex = _constants.ROWS.indexOf(tile[0]);
  var colIndex = tile.slice(1);
  var x = 400 * colIndex / 10;
  var y = 400 * rowIndex / 10;

  return [x, y];
}

exports.addRandomPosition = addRandomPosition;
exports.tileToCoordinates = tileToCoordinates;
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

var _Player = require('./players/Player1');

var TeamPlayer1 = _interopRequireWildcard(_Player);

var _Player2 = require('./players/Player2');

var TeamPlayer2 = _interopRequireWildcard(_Player2);

var _Player3 = require('./players/Player3');

var TeamPlayer3 = _interopRequireWildcard(_Player3);

var _Player4 = require('./players/Player4');

var TeamPlayer4 = _interopRequireWildcard(_Player4);

var _Player5 = require('./players/Player5');

var TeamPlayer5 = _interopRequireWildcard(_Player5);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var playerOne = new Player(TeamPlayer1);
var playerTwo = new Player(TeamPlayer5);
var turnCounter = null;
var explodeImg = new Image();
explodeImg.src = "explode.jpeg";
explodeImg.onload;

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
    setTimeout(cpuTurn, 50, playerOne, playerTwo);
  }
}

function cpuTurn(attacker, victim) {
  var attackCoord = attacker.attack(); //request shot coordinates player bot (attacker) !!!
  var attackResult = attackHandler(attacker, victim, attackCoord);
  attacker.attackResult(attackResult); // return to bot atackResult  may be need here new thread
  refreshGrid(attacker, victim.context, _constants.CELLSIZE);
  if (attackResult != _constants.DUPLICATED) {
    animateHitMissText(attackResult, attackCoord, victim, attacker);
  }
  if (playerLost(victim)) {
    drawMessage(attacker.messageArea, "Ah, poor " + victim.name + ". Didn't stand a chance.");
    drawMessage(turnCounter, "Congratulations to " + attacker.name + " !!! They won in " + attacker.turnCount + " turns.");
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

function animateHitMissText(hit, attackCoord, attacker, victim) {
  var coords = (0, _battleshipHelper.tileToCoordinates)(attackCoord);
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
    // animateText({text, attacker, victim, newCoords, rgba, step, canvasSize});
    animateAttack(attacker, attackCoord);
    step += 1;
    if (step > totalSteps / 2) {
      clearInterval(fadeIn);
      step = 0;
      var fadeOut = setInterval(function () {
        // animateText({text, attacker, victim, newCoords, rgba, step, canvasSize});
        animateAttack(attacker, attackCoord);
        step += 1;
        if (step > totalSteps) {
          clearInterval(fadeOut);
          attacker.context.clearRect(0, 0, canvasSize, canvasSize);
          drawBoardFor(attacker);
          refreshGrid(victim, attacker.context, _constants.CELLSIZE);
        }
      }, 1);
    }
  }, 1);
}

function animateAttack(attacker, tile) {
  var context = attacker.context;
  var pattern1 = context.createPattern(explodeImg, 'repeat');
  context.fillStyle = pattern1;
  var row = _constants.ROWS.indexOf(tile[0]);
  var col = tile.slice(1) - 1;
  context.fillRect(col * _constants.CELLSIZE, row * _constants.CELLSIZE, _constants.CELLSIZE, _constants.CELLSIZE);
}

function animateText(drawPrimiteves) {
  var text = drawPrimiteves.text,
      attacker = drawPrimiteves.attacker,
      victim = drawPrimiteves.victim,
      newCoords = drawPrimiteves.newCoords,
      rgba = drawPrimiteves.rgba,
      step = drawPrimiteves.step,
      canvasSize = drawPrimiteves.canvasSize;

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
}

},{"./battleship-helper":1,"./constants":3,"./players/Player1":5,"./players/Player2":6,"./players/Player3":7,"./players/Player4":8,"./players/Player5":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// const SHIPS = [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] },
// 		  				 { shipType: "Battleship", health: 4, tilesOccupied: [] },
// 			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] } ];
var SHIPS = [{ shipType: "Battleship", health: 4, tilesOccupied: [] }, { shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }, { shipType: "Cruiser", health: 1, tilesOccupied: [] }, { shipType: "Cruiser", health: 1, tilesOccupied: [] }, { shipType: "Cruiser", health: 1, tilesOccupied: [] }, { shipType: "Cruiser", health: 1, tilesOccupied: [] }];

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var POINT_UNKNOWN = exports.POINT_UNKNOWN = 'POINT_UNKNOWN';
var POINT_MISS = exports.POINT_MISS = 'POINT_MISS';
var POINT_SHIP = exports.POINT_SHIP = 'POINT_SHIP';
var POINT_SINKED = exports.POINT_SINKED = 'POINT_SINKED';

var MATRIX_SIZE = 10;

var Map = function () {
  function Map() {
    _classCallCheck(this, Map);

    this.map = [];
    this.lastPoint = {};
    this.hitDirection = null;
    this._generateMap();
  }

  _createClass(Map, [{
    key: 'getRecommendedPoint',
    value: function getRecommendedPoint() {
      var point = this._getRecommendedPoint();

      this.lastPoint = point;

      return this._stringifyPoint(point);
    }
  }, {
    key: '_getRecommendedPoint',
    value: function _getRecommendedPoint() {
      for (var i = 0; i < MATRIX_SIZE; i++) {
        for (var j = 0; j < MATRIX_SIZE; j++) {
          if (this.isPoint(i, j, POINT_SHIP)) {
            return this.getAttackFor(i, j);
          }
        }
      }

      return this.attackRandom();
    }
  }, {
    key: 'attackRandom',
    value: function attackRandom() {
      var unknownCells = [];

      for (var i = 0; i < MATRIX_SIZE; i++) {
        for (var j = 0; j < MATRIX_SIZE; j++) {
          if (this.isPoint(i, j, POINT_UNKNOWN)) {
            unknownCells.push({ i: i, j: j });
          }
        }
      }

      var length = unknownCells.length;

      return unknownCells[parseInt(Math.random() * length)];
    }
  }, {
    key: 'getAttackFor',
    value: function getAttackFor(i, j) {
      if (this.isPoint(i - 1, j, POINT_SHIP)) {
        return {
          i: this.searchUnknownUp(i, j),
          j: j
        };
      }

      if (this.isPoint(i + 1, j, POINT_SHIP)) {
        return {
          i: this.searchUnknownDown(i, j),
          j: j
        };
      }

      if (this.isPoint(i, j + 1, POINT_SHIP)) {
        return {
          i: i,
          j: this.searchUnknownRight(i, j)
        };
      }

      if (this.isPoint(i, j - 1, POINT_SHIP)) {
        return {
          i: i,
          j: this.searchUnknownLeft(i, j)
        };
      }

      // if not attack dir, attack random
      if (this.pointExists(i + 1, j)) {
        return {
          i: i + 1,
          j: j
        };
      }

      if (this.pointExists(i - 1, j)) {
        return {
          i: i - 1,
          j: j
        };
      }

      if (this.pointExists(i, j + 1)) {
        return {
          i: i,
          j: j + 1
        };
      }

      if (this.pointExists(i, j - 1)) {
        return {
          i: i,
          j: j - 1
        };
      }

      return this.attackRandom();
    }
  }, {
    key: 'searchUnknownLeft',
    value: function searchUnknownLeft(i, j) {
      var newJ = j;

      while (newJ > 0) {
        newJ--;
        if (this.isPoint(i, newJ, POINT_MISS) || this.isPoint(i, newJ, POINT_SINKED) || !this.pointExists(i, newJ)) {
          return j + 1;
        }

        if (this.isPoint(i, newJ, POINT_UNKNOWN)) {
          return newJ;
        }
      }
    }
  }, {
    key: 'searchUnknownRight',
    value: function searchUnknownRight(i, j) {
      var newJ = j;

      while (newJ > 0) {
        newJ++;
        if (this.isPoint(i, newJ, POINT_MISS) || this.isPoint(i, newJ, POINT_SINKED) || !this.pointExists(i, newJ)) {
          return j - 1;
        }

        if (this.isPoint(i, newJ, POINT_UNKNOWN)) {
          return newJ;
        }
      }
    }
  }, {
    key: 'searchUnknownUp',
    value: function searchUnknownUp(i, j) {
      var newI = i;

      while (newI > 0) {
        newI--;
        if (this.isPoint(newI, j, POINT_MISS) || this.isPoint(newI, j, POINT_SINKED) || !this.pointExists(newI, j)) {
          return i + 1;
        }

        if (this.isPoint(newI, j, POINT_UNKNOWN)) {
          return newI;
        }
      }
    }
  }, {
    key: 'searchUnknownDown',
    value: function searchUnknownDown(i, j) {
      var newI = i;

      while (newI > 0) {
        newI++;
        if (this.isPoint(newI, j, POINT_MISS) || this.isPoint(newI, j, POINT_SINKED) || !this.pointExists(newI, j)) {
          return i - 1;
        }

        if (this.isPoint(newI, j, POINT_UNKNOWN)) {
          return newI;
        }
      }
    }

    // direction()

  }, {
    key: '_generateMap',
    value: function _generateMap() {
      for (var i = 0; i < MATRIX_SIZE; i++) {
        this.map[i] = [];
        for (var j = 0; j < MATRIX_SIZE; j++) {
          this.map[i][j] = POINT_UNKNOWN;
        }
      }
    }
  }, {
    key: 'getPoint',
    value: function getPoint(i, j) {
      return this.map[i][j];
    }
  }, {
    key: 'getRandPoint',
    value: function getRandPoint() {
      this.lastPoint = {
        i: 1,
        j: 1
      };

      return this._stringifyPoint(this.lastPoint);
    }
  }, {
    key: '_stringifyPoint',
    value: function _stringifyPoint(point) {
      var strI = String.fromCharCode(65 + point.i);
      var strJ = (point.j + 1).toString();
      return strI + strJ;
    }
  }, {
    key: 'markPoint',
    value: function markPoint(i, j, status) {
      this.map[i][j] = status;
    }
  }, {
    key: 'markLastPoint',
    value: function markLastPoint(status) {
      this.markPoint(this.lastPoint.i, this.lastPoint.j, status);
    }
  }, {
    key: '_sinkSurrounding',
    value: function _sinkSurrounding(i, j) {
      this.map[i][j] = POINT_SINKED;

      for (var deltaI = -1; deltaI <= 1; deltaI++) {
        for (var deltaJ = -1; deltaJ <= 1; deltaJ++) {
          if (this.isPoint(i + deltaI, j + deltaJ, POINT_UNKNOWN)) {
            this.map[i + deltaI][j + deltaJ] = POINT_SINKED;
          }
        }
      }
    }
  }, {
    key: 'pointExists',
    value: function pointExists(i, j) {
      return i >= 0 && j >= 0 && i < MATRIX_SIZE && j < MATRIX_SIZE;
    }
  }, {
    key: 'isPoint',
    value: function isPoint(i, j, status) {
      if (this.pointExists(i, j)) {
        return this.map[i][j] === status;
      }

      return false;
    }
  }, {
    key: 'sinkArea',
    value: function sinkArea(i, j) {
      this._sinkSurrounding(i, j);

      if (this.isPoint(i - 1, j, POINT_SHIP)) {
        this.sinkArea(i - 1, j);
      }

      if (this.isPoint(i + 1, j, POINT_SHIP)) {
        this.sinkArea(i + 1, j);
      }

      if (this.isPoint(i, j - 1, POINT_SHIP)) {
        this.sinkArea(i, j - 1);
      }

      if (this.isPoint(i, j + 1, POINT_SHIP)) {
        this.sinkArea(i, j + 1);
      }
    }
  }, {
    key: 'sinkLastPointArea',
    value: function sinkLastPointArea() {
      this.sinkArea(this.lastPoint.i, this.lastPoint.j);
    }
  }]);

  return Map;
}();

exports.default = Map;
var map = exports.map = new Map();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attackResult = exports.attack = exports.getName = undefined;

var _Map = require('./Map');

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "AttackOnShip";
};

/**
 * MISS -> missed attack
 * HIT ->	hited ship but ship is not sunk yet
 * SUNK -> ship is dead
 * DUPLICATED -> once again you are attacked this coordinates
 * @param {String} result one of HIT, MISS, SUNK, DUPLICATED.
 * @return {void}
 */
function attackResult(result) {
  switch (result) {
    case 'DUPLICATED':
    case 'MISS':
      _Map.map.markLastPoint(_Map.POINT_MISS);
      break;
    case 'HIT':
      _Map.map.markLastPoint(_Map.POINT_SHIP);
      break;
    case 'SUNK':
      _Map.map.markLastPoint(_Map.POINT_SHIP);
      _Map.map.sinkLastPointArea();
  }
};

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
  return _Map.map.getRecommendedPoint();
};

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{"./Map":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var BOARD = new Map().set("A", [].concat(_toConsumableArray(new Array(10)))).set("B", [].concat(_toConsumableArray(new Array(10)))).set("C", [].concat(_toConsumableArray(new Array(10)))).set("D", [].concat(_toConsumableArray(new Array(10)))).set("E", [].concat(_toConsumableArray(new Array(10)))).set("F", [].concat(_toConsumableArray(new Array(10)))).set("G", [].concat(_toConsumableArray(new Array(10)))).set("H", [].concat(_toConsumableArray(new Array(10)))).set("I", [].concat(_toConsumableArray(new Array(10)))).set("J", [].concat(_toConsumableArray(new Array(10))));
var shot = void 0;

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "Davide";
};

var MISS = "MISS";
var HIT = "HIT";
var SUNK = "SUNK";
var DUPLICATED = "DUPLICATED";

/**
 * MISS -> missed attack
 * HIT ->	hited ship but ship is not sunk yet
 * SUNK -> ship is dead
 * DUPLICATED -> once again you are attacked this coordinates
 * @param {String} result one of HIT, MISS, SUNK, DUPLICATED.
 * @return {void}
 */
function attackResult(result) {
  markCell(shot, result);
  if (result === SUNK) {
    markSunk(shot);
  }
};

function markSunk(shot) {
  var _shot = _slicedToArray(shot, 2),
      row = _shot[0],
      col = _shot[1];

  var rowIdx = ROWS.findIndex(function (r) {
    return r === row;
  });
  var newRowIdx = void 0;
  var newColIdx = void 0;
  var offsets = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = offsets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var offset = _step.value;

      newRowIdx = rowIdx + offset[0];
      newColIdx = col + offset[1];
      if (newRowIdx >= 0 && newRowIdx <= 9 && newColIdx >= 1 && newColIdx <= 10) {
        if (cellStatus([ROWS[newRowIdx], col]) === HIT) {
          markSunk([ROWS[newRowIdx], col]);
        }
        markCell([ROWS[newRowIdx], col], MISS);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function markCell(_ref, tag) {
  var _ref2 = _slicedToArray(_ref, 2),
      row = _ref2[0],
      col = _ref2[1];

  var item = BOARD.get(row);
  item[col - 1] = tag;
}

function cellStatus(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      row = _ref4[0],
      cell = _ref4[1];

  return BOARD.get(row)[cell - 1];
}

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
  shot = getRandomCell();
  return shot.toString().replace(',', '');
};

function getRandomCell() {
  var rowIdx = Math.floor(Math.random() * ROWS.length);
  var colIdx = Math.floor(Math.random() * ROWS.length);
  var nextShot = void 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = BOARD.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var row = _step2.value;

      var index = BOARD.get(row).findIndex(function (el) {
        return !el;
      });
      if (index !== -1) {
        nextShot = [row, index + 1];
        break;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return nextShot;
}

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var BOARD = new Map().set("A", [].concat(_toConsumableArray(new Array(10)))).set("B", [].concat(_toConsumableArray(new Array(10)))).set("C", [].concat(_toConsumableArray(new Array(10)))).set("D", [].concat(_toConsumableArray(new Array(10)))).set("E", [].concat(_toConsumableArray(new Array(10)))).set("F", [].concat(_toConsumableArray(new Array(10)))).set("G", [].concat(_toConsumableArray(new Array(10)))).set("H", [].concat(_toConsumableArray(new Array(10)))).set("I", [].concat(_toConsumableArray(new Array(10)))).set("J", [].concat(_toConsumableArray(new Array(10))));
var shot = void 0;

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "Davide";
};

var MISS = "MISS";
var HIT = "HIT";
var SUNK = "SUNK";
var DUPLICATED = "DUPLICATED";

/**
 * MISS -> missed attack
 * HIT ->	hited ship but ship is not sunk yet
 * SUNK -> ship is dead
 * DUPLICATED -> once again you are attacked this coordinates
 * @param {String} result one of HIT, MISS, SUNK, DUPLICATED.
 * @return {void}
 */
function attackResult(result) {
  markCell(shot, result);
  if (result === SUNK) {
    markSunk(shot);
  }
};

function markSunk(shot) {
  var _shot = _slicedToArray(shot, 2),
      row = _shot[0],
      col = _shot[1];

  var rowIdx = ROWS.findIndex(function (r) {
    return r === row;
  });
  var newRowIdx = void 0;
  var newColIdx = void 0;
  var offsets = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = offsets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var offset = _step.value;

      newRowIdx = rowIdx + offset[0];
      newColIdx = col + offset[1];
      if (newRowIdx >= 0 && newRowIdx <= 9 && newColIdx >= 1 && newColIdx <= 10) {
        if (cellStatus([ROWS[newRowIdx], newColIdx]) === HIT) {
          markSunk([ROWS[newRowIdx], newColIdx]);
        }
        markCell([ROWS[newRowIdx], newColIdx], MISS);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function markCell(_ref, tag) {
  var _ref2 = _slicedToArray(_ref, 2),
      row = _ref2[0],
      col = _ref2[1];

  var item = BOARD.get(row);
  item[col - 1] = tag;
}

function cellStatus(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      row = _ref4[0],
      cell = _ref4[1];

  return BOARD.get(row)[cell - 1];
}

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
  shot = getRandomCell();
  return shot.toString().replace(',', '');
};

function getRandomCell() {
  var rowIdx = Math.floor(Math.random() * ROWS.length);
  var colIdx = Math.floor(Math.random() * ROWS.length);
  var nextShot = void 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = BOARD.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var row = _step2.value;

      var index = BOARD.get(row).findIndex(function (el) {
        return !el;
      });
      if (index !== -1) {
        nextShot = [row, index + 1];
        break;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return nextShot;
}

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HIT = 'HIT',
    MISS = 'MISS',
    SUNK = 'SUNK',
    DUPLICATED = 'DUPLICATED';

var EMPTY_SPOT = 0;
var SHIP_SPOT = 1;
var MISS_SPOT = -1;
var SUNK_SHIP = 2;
var ships = {
  4: 1,
  3: 2,
  2: 3,
  1: 4
};
var grid = Array(10).fill(Array(10).fill(EMPTY_SPOT));
var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'H', 'I', 'J'];
var phase = 'random';
var lastHit = [-1, -1];
var target = [0, 0];

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "NiavY";
};

/**
 * MISS -> missed attack
 * HIT ->	hited ship but ship is not sunk yet
 * SUNK -> ship is dead
 * DUPLICATED -> once again you are attacked this coordinates
 * @param {String} result one of HIT, MISS, SUNK, DUPLICATED.
 * @return {void}
 */
function attackResult(result) {
  switch (result) {
    case HIT:
      phase = 'hit';
      grid[target[0]][target[1]] = SHIP_SPOT;
      lastHit = target;
      break;
    case MISS:
      phase = 'miss';
      grid[target[0]][target[1]] = MISS_SPOT;
      break;
    case SUNK:
      markAround();
      grid[target[0]][target[1]] = SHIP_SPOT;
      phase = 'random';
      lastHit = [-1, -1];
      break;
    case DUPLICATED:
      console.log('ERRORRRR!!!!');
      grid[target[0]][target[1]] = MISS_SPOT;
      phase = 'random';
      break;
  }
  prepareAttack();
};

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
var randomNumber = function randomNumber() {
  return Math.floor(Math.random() * 10);
};
var pickRandom = function pickRandom() {
  var a = randomNumber();
  var b = randomNumber();
  if (grid[a][b] === EMPTY_SPOT) {
    return [a, b];
  } else {
    pickRandom();
  }
};

function prepareAttack() {
  if (phase == 'random') {
    target = pickRandom();
    return;
  }
  if (phase == 'miss') {
    if (lastHit[0] == -1) {
      target = pickRandom();
    } else {
      var available = getShipSpots();
      target = available[0];
    }
    return;
  }
  if (phase == 'hit') {
    var available = getShipSpots();
    target = available[0];
    return;
    // check around, for empty spots (recoursevly)
    // 1: []
    // for each empty spot check the length until miss
    // 2: [2, 5, 3, 1]
  }
}

function attack() {
  return LETTERS[target[0]] + (target[1] + 1);
};

function getShipSpots() {
  // count HITS
  var hits = [];
  var available = [];
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (grid[i][j] == SHIP_SPOT) {
        hits.push([i, j]);
      }
    }
  }
  if (hits.length == 1) {
    var x = hits[0][0];
    var y = hits[0][1];
    var UP = grid[x][y - 1];
    var RIGHT = grid[x + 1][y];
    var DOWN = grid[x][y + 1];
    var LEFT = grid[x - 1][y];
    if (UP != undefined && UP == EMPTY_SPOT) available.push([x, y - 1]);
    if (RIGHT != undefined && RIGHT == EMPTY_SPOT) available.push([x + 1, y]);
    if (DOWN != undefined && DOWN == EMPTY_SPOT) available.push([x, y + 1]);
    if (LEFT != undefined && LEFT == EMPTY_SPOT) available.push([x - 1, y]);
  } else {
    // if x are equals - return closest top and bottom
    if (hits[0][0] == hits[1][0]) {
      var tempXL = hits[0];
      while (true) {
        tempXL[0] -= 1;
        if (grid[tempXL[0]][tempXL[1]] == undefined) break;
        if (grid[tempXL[0]][tempXL[1]] == EMPTY_SPOT) {
          available.push(tempXL);
          break;
        }
      }
      var tempXR = hits[hits.length - 1];
      while (true) {
        tempXR[0] += 1;
        if (grid[tempXR[0]][tempXR[1]] == undefined) break;
        if (grid[tempXR[0]][tempXR[1]] == EMPTY_SPOT) {
          available.push(tempXR);
          break;
        }
      }
    }
    // if y are equals - return closest left and right
    if (hits[0][1] == hits[1][1]) {
      var tempYT = hits[0];
      while (true) {
        tempYT[1] -= 1;
        if (grid[tempYT[0]][tempYT[1]] == undefined) break;
        if (grid[tempYT[0]][tempYT[1]] == EMPTY_SPOT) {
          available.push(tempYT);
          break;
        }
      }
      var tempYB = hits[hits.length - 1];
      while (true) {
        tempYB[1] += 1;
        if (grid[tempYB[0]][tempYB[1]] == undefined) break;
        if (grid[tempYB[0]][tempYB[1]] == EMPTY_SPOT) {
          available.push(tempYB);
          break;
        }
      }
    }
    // return row
  }
  return available;
  // if only 1 hit, return cross
  // if 2+ hits return single row(column)
}
function markAround(target) {
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      var tempTarget = grid[target[0] + i][target[1] + j];
      if (tempTarget !== undefined) {
        if (tempTarget == EMPTY_SPOT || tempTarget == MISS_SPOT) {
          grid[target[0] + i][target[1] + j] = MISS_SPOT;
        } else {
          grid[target[0] + i][target[1] + j] = SUNK_SHIP;
          markAround(tempTarget);
        }
      }
    }
  }
}

exports.getName = getName;
exports.attack = attack;
exports.attackResult = attackResult;

},{}],9:[function(require,module,exports){
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
  return "Random Dummy";
};

/**
	MISS -> missed attack
	HIT ->	hited ship but ship is not sunk yet
	SUNK -> ship is dead
	DUPLICATED -> once again you are attacked this coordinates

 * @param {String} result one of [HIT, MISS, SUNK, DUPLICATED].
 * @param {String} coordinates Previos attacked coordinates.
 * @return {void}
 */
function attackResult(result, coordinates) {};

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
