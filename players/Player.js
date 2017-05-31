import {ROWS, COLS, GRIDSIZE} from '../constants';
import {
    getStartingHealth,
    detectAdjacentShips,
    randomTile,
    getOrientation,
    nextRowDown,
    nextRowUp,
    nextColUp,
    nextColDown,
    buildAdjacencyArray,
} from '../battleship-helper';

 var bot = {
  hitTiles: [],
  missTiles: [],
  opponent: null,
  lastGuesses: [{ hit: false, tile: ""}, { hit: false, tile: ""}],
  nextGuesses: [],
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
    }
    else {
      addLastGuess(bot, { hit: false, tile: coordinates });
      bot.missTiles.push(coordinates);
    }
};

function attack() {
  let nextGuess = cpuTilePick(bot);
  return randomTile();
};

// Player attack funtionality -----------------------------------

function guessesAfterHit(cpu, tile) {
  var guesses = [];
  var newTile;
  if (tile && tile[0] != ROWS[0]) {
    guesses.push(nextRowDown(tile[0]) + tile.slice(1));
  }
  if (tile && tile[1] != COLS[0]) {
    guesses.push(tile[0] + nextColDown(tile.slice(1)));
  }
  if (tile && tile[0] != ROWS[GRIDSIZE - 1]) {
    guesses.push(nextRowUp(tile[0]) + tile.slice(1));
  }
  if (tile && tile[1] != COLS[GRIDSIZE - 1]) {
    guesses.push(tile[0] + nextColUp(tile.slice(1)));
  }
  return guesses;
}

function guessCheck(player, guess) {
  console.log("Checking guess: " + guess);
  return (player.missTiles.indexOf(guess) == -1 && player.hitTiles.indexOf(guess) == -1);
}

var extrapolateMovement = function(tile1, tile2) {
  var rowDiff = ROWS.indexOf(tile2[0]) - ROWS.indexOf(tile1[0]);
  var colDiff = tile2.slice(1) - tile1.slice(1);
  console.log("Extropolate" + tile1 + tile2);
  console.log(ROWS[ROWS.indexOf(tile2[0]) + rowDiff]);
  return ROWS[ROWS.indexOf(tile2[0]) + rowDiff] + (parseInt(tile2.slice(1)) + colDiff);
}

var addLastGuess = function(player, guess) {
  if (player.lastGuesses.unshift(guess) > 5) {
    player.lastGuesses.pop();
  }
}

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
      }
      else {
        cpu.nextGuesses = cpu.nextGuesses.concat(guessesAfterHit(cpu, startTile));
      }
    }
    else {
      cpu.nextGuesses = guessesAfterHit(cpu, startTile);
    }
    while (cpu.nextGuesses.length > 0 && nextTile == undefined) {
      console.log("while (cpu.nextGuesses.length > 0 && nextTile == undefined)");
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  }
  else if (!cpu.lastGuesses[0].sunk) {
    while (cpu.nextGuesses.length > 0 && nextTile == undefined) {
      console.log("while (cpu.nextGuesses.length > 0 && nextTile == undefined) {");
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  }
  if (nextTile == undefined) {
    nextTile = randomTile();
    while (guessCheck(cpu, nextTile) == false || detectAdjacentMisses(cpu.missTiles, nextTile)) {
      console.log("while (guessCheck(cpu, nextTile) == false || detectAdjacentMisses(cpu.missTiles, nextTile)) {");
      nextTile = randomTile();
      guessCount += 1;
      if (guessCheck(cpu, nextTile) && guessCount > 50) {
        break;
      }
    }
  }
  return nextTile;
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

export {
  getName,
  attack,
  attackResult,
};
