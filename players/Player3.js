const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BOARD = new Map()
  .set("A", [...(new Array(10))])
  .set("B", [...(new Array(10))])
  .set("C", [...(new Array(10))])
  .set("D", [...(new Array(10))])
  .set("E", [...(new Array(10))])
  .set("F", [...(new Array(10))])
  .set("G", [...(new Array(10))])
  .set("H", [...(new Array(10))])
  .set("I", [...(new Array(10))])
  .set("J", [...(new Array(10))])
let shot;

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
	return "Davide";
};

const MISS = "MISS";
const HIT = "HIT";
const SUNK = "SUNK";
const DUPLICATED = "DUPLICATED";

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
  const [row, col] = shot;
  const rowIdx = ROWS.findIndex((r) => r === row);
  let newRowIdx;
  let newColIdx;
  const offsets = [[-1, 0], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]];
  for (let offset of offsets) {
    newRowIdx = rowIdx + offset[0];
    newColIdx = col + offset[1];
    if (newRowIdx >= 0 && newRowIdx <= 9 && newColIdx >= 1 && newColIdx <= 10) {
      if (cellStatus([ROWS[newRowIdx], newColIdx]) === HIT) {
        markSunk([ROWS[newRowIdx], newColIdx]);
      }
      markCell([ROWS[newRowIdx], newColIdx], MISS);
    }
  }
}

function markCell([row, col], tag) {
  let item = BOARD.get(row);
  item[col-1] = tag;
}

function cellStatus([row, cell]) {
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
  const rowIdx = Math.floor(Math.random() * ROWS.length);
  const colIdx  = Math.floor(Math.random() * ROWS.length);
  let nextShot;
  for (let row of BOARD.keys()) {
    const index = BOARD.get(row).findIndex((el) => !el);
    if (index !== -1) {
      nextShot = [row, index + 1];
      break;
    }
  }
  return nextShot;
}

export {
  getName,
  attack,
  attackResult,
};