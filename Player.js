
import {ROWS, COLS, GRIDSIZE} from 'constants';

function attack(attacker, tile) {
  return randomTile();
};

function randomTile() {
  return ROWS[Math.floor(Math.random() * GRIDSIZE)] + COLS[Math.floor(Math.random() * GRIDSIZE)];
};

/*
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
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  }
  else if (!cpu.lastGuesses[0].sunk) {
    while (cpu.nextGuesses.length > 0 && nextTile == undefined) {
      newGuess = cpu.nextGuesses.shift();
      if (guessCheck(cpu, newGuess)) {
        nextTile = newGuess;
      }
    }
  }
  if (nextTile == undefined) {
    nextTile = randomTile();
    while (guessCheck(cpu, nextTile) == false || detectAdjacentMisses(cpu.missTiles, nextTile)) {
      nextTile = randomTile();
      guessCount += 1;
      if (guessCheck(cpu, nextTile) && guessCount > 50) {
        break;
      }
    }
  }
  return nextTile;
}
*/
export default attack;