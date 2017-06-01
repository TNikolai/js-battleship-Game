import {
  SHIPS,
  ROWS,
  COLS,
  GRIDSIZE,
  CELLSIZE,
  DIRECTIONS,
} from './constants';

var tileAttempts = 0;

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

function randomTile() {
  return ROWS[Math.floor(Math.random() * GRIDSIZE)] + COLS[Math.floor(Math.random() * GRIDSIZE)];
};

function getStartingHealth(type) {
  var health = null;
  SHIPS.forEach(function(ship, index, array) {
    if (ship.shipType === type) {
      health = ship.health;
    }
  });
  if (health == null) { console.log("-----------Bad Ship Type!!!-------------");}
  return health;
};

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
  var adjacent = [];
  adjacent.push({ direction: "right", tile: startTile[0] + nextColUp(startTile.slice(1))});
  adjacent.push({ direction: "left", tile: startTile[0] + nextColDown(startTile.slice(1))});
  adjacent.push({ direction: "down", tile: nextRowUp(startTile[0]) + startTile.slice(1)});
  adjacent.push({ direction: "up", tile: nextRowDown(startTile[0]) + startTile.slice(1)});

  adjacent.push({ dirrection: 'top-left', tile: nextRowDown(startTile[0]) + nextColDown(startTile.slice(1)) }); // nearest diagonals
  adjacent.push({ dirrection: 'bottom-left', tile: nextRowUp(startTile[0]) + nextColDown(startTile.slice(1)) });
  adjacent.push({ dirrection: 'top-right', tile: nextRowDown(startTile[0]) + nextColUp(startTile.slice(1)) });
  adjacent.push({ dirrection: 'bottom-right', tile: nextRowUp(startTile[0]) + nextColUp(startTile.slice(1)) });

  return adjacent;
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
      while (detectAdjacentShips(ships, currentTile)) { // You cant use this point because near this point u have ship !!!
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
        console.log("---------------nextTile");
        console.log(nextTile);
        ship.tilesOccupied.push(nextTile);
      }
    }
  }
}

function tileToCoordinates(tile) {
  var rowIndex = ROWS.indexOf(tile[0]);
  var colIndex = tile.slice(1);
  let x = 400 * colIndex / 10;
  let y = 400 * rowIndex / 10;

  return [x, y];
}


export {
		addRandomPosition,
    tileToCoordinates,
    checkShipsForTile,
    getStartingHealth,
    detectAdjacentShips,
    randomTile,
    getOrientation,
    buildAdjacencyArray,
    nextRowDown,
    nextRowUp,
    nextColUp,
    nextColDown,
    oppositeDirection,
}
