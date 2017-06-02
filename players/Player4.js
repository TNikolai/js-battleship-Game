
const [HIT, MISS, SUNK, DUPLICATED] = ['HIT', 'MISS', 'SUNK', 'DUPLICATED'];
const EMPTY_SPOT = 0;
const SHIP_SPOT = 1;
const MISS_SPOT = -1;
const SUNK_SHIP = 2;
let ships = {
  4: 1,
  3: 2,
  2: 3,
  1: 4
}
const grid = Array(10).fill(Array(10).fill(EMPTY_SPOT));
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'H', 'I', 'J'];
let phase = 'random';
let lastHit = [-1, -1];
let target = [0, 0];

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
var randomNumber = function () {
  return Math.floor(Math.random() * 10);
}
var pickRandom = function () {
  var a = randomNumber();
  var b = randomNumber();
  if (grid[a][b] === EMPTY_SPOT) {
    return [a, b];
  } else {
    pickRandom();
  }
}

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
  let hits = [];
  let available = [];
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
      var tempXL = hits[0]
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
      var tempYT = hits[0]
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

export {
  getName,
  attack,
  attackResult,
};