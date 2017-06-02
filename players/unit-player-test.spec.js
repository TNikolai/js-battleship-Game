import { expect, assert } from 'chai';
import { SHIPS } from '../constants';
import {buildAdjacencyArray} from '../battleship-helper';
import * as TeamPlayer1 from './Player1';
import * as TeamPlayer2 from './Player2';
import * as TeamPlayer3 from './Player3';
import * as TeamPlayer4 from './Player4';

for (let teamPlayer of [TeamPlayer1, TeamPlayer2, TeamPlayer3, TeamPlayer4]) {

	describe('Testing players required functions', () => {
		let getName = teamPlayer.getName;
		let attackResult = teamPlayer.attackResult;
		let attack = teamPlayer.attack;

		it('player should have method getName', () => {
			expect(getName).not.equal(undefined);
		});

		it('player should return non-empty getName', () => {
			expect(getName).not.equal('');
		});

		it('player should have method attackResult for saving previos hit-mises', () => {
			expect(attackResult).not.equal(undefined);
		});

		it('player should have method attack', () => {
			expect(attack).not.equal(undefined);
		});

		it('attack() function should return coordinates as String e.g: A10, B7, I7', () => {
			for (let i = 0; i < 1000; i++) {
				let attackCoordinates = attack();
				expect(attackCoordinates).to.be.an('string').that.is.not.empty;
				assert.isAbove(attackCoordinates.length, 1, "Coordinates length need be greather than one char");
				assert.isBelow(attackCoordinates.length, 4, "Coordinates length need be below than 4 chars exmp:  2 > A10 < 4");
			}
		});

	});
}

