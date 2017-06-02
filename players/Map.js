

export const POINT_UNKNOWN = 'POINT_UNKNOWN';
export const POINT_MISS = 'POINT_MISS';
export const POINT_SHIP = 'POINT_SHIP';
export const POINT_SINKED = 'POINT_SINKED';


const MATRIX_SIZE = 10;

export default class Map {
  constructor() {
    this.map = [];
    this.lastPoint = {};
    this.hitDirection = null;
    this._generateMap();
  }

  getRecommendedPoint() {
    let point = this._getRecommendedPoint();

    this.lastPoint = point;

    return this._stringifyPoint(point);
  }

  _getRecommendedPoint() {
    for (let i = 0; i < MATRIX_SIZE; i++) {
      for (let j = 0; j < MATRIX_SIZE; j++) {
        if (this.isPoint(i, j, POINT_SHIP)) {
          return this.getAttackFor(i, j);
        }
      }
    }

    return this.attackRandom();
  }

  attackRandom() {
    let unknownCells = [];

    for (let i = 0; i < MATRIX_SIZE; i++) {
      for (let j = 0; j < MATRIX_SIZE; j++) {
        if (this.isPoint(i, j, POINT_UNKNOWN)) {
          unknownCells.push({i: i, j: j});
        }
      }
    }

    let length = unknownCells.length;

    return unknownCells[parseInt(Math.random() * length)];
  }

  getAttackFor(i, j) {
    if (this.isPoint(i - 1, j, POINT_SHIP)) {
      return {
        i: this.searchUnknownUp(i, j),
        j: j,
      };
    }

    if (this.isPoint(i + 1, j, POINT_SHIP)) {
      return {
        i: this.searchUnknownDown(i, j),
        j: j,
      };
    }

    if (this.isPoint(i, j + 1, POINT_SHIP)) {
      return {
        i: i,
        j: this.searchUnknownRight(i, j),
      }
    }

    if (this.isPoint(i, j - 1, POINT_SHIP)) {
      return {
        i: i,
        j: this.searchUnknownLeft(i, j),
      }
    }

    // if not attack dir, attack random
    if (this.pointExists(i + 1, j)) {
      return {
        i: i + 1,
        j: j,
      };
    }

    if (this.pointExists(i - 1, j)) {
      return {
        i: i - 1,
        j: j,
      };
    }

    if (this.pointExists(i, j + 1)) {
      return {
        i: i,
        j: j + 1,
      };
    }

    if (this.pointExists(i, j - 1)) {
      return {
        i: i,
        j: j - 1,
      };
    }

    return this.attackRandom();
  }

  searchUnknownLeft(i, j) {
    let newJ = j;

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

  searchUnknownRight(i, j) {
    let newJ = j;

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

  searchUnknownUp(i, j) {
    let newI = i;

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

  searchUnknownDown(i, j) {
    let newI = i;

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

  _generateMap() {
    for (let i = 0; i < MATRIX_SIZE; i++) {
      this.map[i] = [];
      for (let j = 0; j < MATRIX_SIZE; j++) {
        this.map[i][j] = POINT_UNKNOWN;
      }
    }
  }

  getPoint(i, j) {
    return this.map[i][j];
  }

  getRandPoint() {
    this.lastPoint = {
      i: 1,
      j: 1,
    };

    return this._stringifyPoint(this.lastPoint);
  }

  _stringifyPoint(point) {
    const strI = String.fromCharCode(65 + point.i);
    const strJ = (point.j +  1).toString();
    return strI + strJ;
  }

  markPoint(i, j, status) {
    this.map[i][j] = status;
  }

  markLastPoint(status) {
    this.markPoint(
      this.lastPoint.i,
      this.lastPoint.j,
      status
    );
  }

  _sinkSurrounding(i, j) {
    this.map[i][j] = POINT_SINKED;

    for (let deltaI = -1; deltaI <= 1; deltaI++) {
      for (let deltaJ = -1; deltaJ <= 1; deltaJ++) {
        if (this.isPoint(i + deltaI, j + deltaJ, POINT_UNKNOWN)) {
          this.map[i + deltaI][j + deltaJ] = POINT_SINKED;
        }
      }
    }
  }

  pointExists(i, j) {
    return i >= 0 && j >= 0 && i < MATRIX_SIZE && j < MATRIX_SIZE;
  }

  isPoint(i, j, status) {
    if (this.pointExists(i, j)) {
      return this.map[i][j] === status;
    }

    return false;
  }

  sinkArea(i, j) {
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

  sinkLastPointArea() {
    this.sinkArea(this.lastPoint.i, this.lastPoint.j);
  }
}

export const map = new Map();