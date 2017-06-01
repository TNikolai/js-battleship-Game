# Hackathon "JS-Battleship"

## Quick start
 - `npm i`
 - `npm start`
 - `npm test`

To test 

To improve map editing process there is introduced visual map editor.
Main functionality: - set size of board - check cell as one of accessible blocks: - border - empty - jewel - put registered players on the board - set movement speed - save / load map configuration

 
## Description
This project is an implementation of simple game which is designed to perform a hackathon in JS department teamplayers.
The game consists in competition of **"TeamPlayers"** implemented by participants of hackathon.

The goal of every **"TeamPlayer"** is to find and sunk ships of the opponent before the others.

## How to test?
Register your **"TeamPlayer"** class inside `src/players/unit-player-test.spec.js` and simply run `npm test`.

## **"TeamPlayer"** class implementation
To implement your **"TeamPlayer"** create a new file with name `TeamPlayer[your-team-number].js` in `src/players/` and write your **magic** code following next interface:


```js

/**
 * Returns string name for team.
 * @return {string} for example: 'Navi'
 */
function getName() {
  return "Navi";
};

/**
  MISS -> missed attack
  HIT ->  hited ship but ship is not sunk yet
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
  return 'B10';
};

export {
  getName,
  attack,
  attackResult,
};

```
