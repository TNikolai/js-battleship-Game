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
function attackResult(isHit) {

};

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
	return randomTile();
};


export {
  getName,
  attack,
  attackResult,
};
