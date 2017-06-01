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

function attackResult(isHit) {
  //handle here attackResult if isHit == true then your attack was successfull.
  //coordinates is previos attacked coordinates.
};

function attack() {
  return randomTile();
};

export {
  getName,
  attack,
  attackResult,
};
