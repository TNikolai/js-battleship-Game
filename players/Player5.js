import {ROWS, COLS, GRIDSIZE, HIT, MISS, SUNK, DUPLICATED} from '../constants';
import {checkShipsForTile,
        tileToCoordinates,
			  detectAdjacentShips,
			  randomTile,
			  buildAdjacencyArray,
			  addRandomPosition} from '../battleship-helper';

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
function attackResult(result, coordinates) {

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
