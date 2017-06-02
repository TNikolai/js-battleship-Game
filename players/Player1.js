import {map, POINT_MISS, POINT_SHIP } from './Map';

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
      map.markLastPoint(POINT_MISS);
      break;
    case 'HIT':
      map.markLastPoint(POINT_SHIP);
      break;
    case 'SUNK':
      map.markLastPoint(POINT_SHIP);
      map.sinkLastPointArea();
  }
};

/**
 * Returns coordinates in which player want attack
 * First char is Letter=(A...J) rest chars represents a number=(0...10)
 * @return {string} for example: 'B10'
 */
function attack() {
	return map.getRecommendedPoint();
};

export {
  getName,
  attack,
  attackResult,
};