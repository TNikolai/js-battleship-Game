import { expect, assert } from 'chai';
import { SHIPS } from '../constants';
import {buildAdjacencyArray, addRandomPosition} from '../battleship-helper';

describe(' addRandomPossition ForShips helper func', () => {

	it('After calling funtion addRandomPosition arguent ship need have valid ocuppiedTiles(coordinates)', () => {
			var ships = SHIPS.slice();
			ships.forEach((ship, index, shipArray) => {
				expect(ship.tilesOccupied).to.be.an('array').that.is.empty;
			});
			ships.forEach(addRandomPosition);
			ships.forEach((ship, index, shipArray) => {
				expect(ship.tilesOccupied).to.be.an('array').that.is.not.empty;
				expect(ship.tilesOccupied.length).to.be.equal(ship.health);
			});
		});

		it('Placed ship cannot intersects with other ships', () => {
			for (var i = 0; i < 500; i++) {
				var ships = SHIPS.slice();
				ships.forEach(addRandomPosition);
				ships.forEach((ship, index, shipArray) => {
					let intersectedShip = isShipPossitionIntersectsWith(shipArray, ship);
					expect(intersectedShip).to.be.equal(null);
				});
			}
		});

			it('Cant place ship adjacent to other ships', () => {
			for (var i = 0; i < 500; i++) {
				var ships = SHIPS.slice();
				ships.forEach(addRandomPosition);
				ships.forEach((ship, index, shipArray) => {
					let adjacentShip = isShipPossitionAdjacentTo(shipArray, ship);
					if (adjacentShip != null) {
					console.log("Adjacent Ship ========================");
					console.log(ships);
					console.log("Adjacent Ship ========================");
					console.log(adjacentShip);
					}
					expect(adjacentShip).to.be.equal(null);
				});
			}
		});
});


describe(' isShipPossitionAdjacentTo helper func', () => {

  	it(' should return adjacent ship equals shipArr[1]', () => {
		var shipArray = [{ shipType: "Adjactor", health: 3, tilesOccupied: ['A1','A2', 'A3'] },
                     { shipType: "Battleship", health: 2, tilesOccupied: ['B3','B4'] },
                     { shipType: "Marina", health: 2, tilesOccupied: ['F7','F8'] },
                    ];
		let adjacentShip = isShipPossitionAdjacentTo(shipArray, shipArray[0]);
		expect(adjacentShip).to.be.equal(shipArray[1]);
	});

		it('should return adjacent ship = null', () => {
		var shipArray = [{ shipType: "Adjactor", health: 3, tilesOccupied: ['A1','A2', 'A3'] },
                     { shipType: "Battleship", health: 2, tilesOccupied: ['B5','B6'] },
                    ];
		let adjacentShip = isShipPossitionAdjacentTo(shipArray, shipArray[0]);
		expect(adjacentShip).to.be.equal(null);
	});

  });

describe(' isShipPossitionIntersectsWith helper ', () => {

		it(' should returns intersected ship', () => {
		var shipArray = [{ shipType: "Intersector", health: 3, tilesOccupied: ['A1','A2', 'A3'] },
                     { shipType: "Battleship", health: 2, tilesOccupied: ['A3','A4'] },
                    ];
		let intersectedShip = isShipPossitionIntersectsWith(shipArray, shipArray[0]);
		expect(intersectedShip).to.be.equal(shipArray[1]);
	});

		it(' should return  null', () => {
		var shipArray = [{ shipType: "Intersector", health: 3, tilesOccupied: ['A1','A2', 'A3'] },
                     { shipType: "Battleship", health: 2, tilesOccupied: ['B6','B7'] },
                    ];
		let intersectedShip = isShipPossitionIntersectsWith(shipArray, shipArray[0]);
		expect(intersectedShip).to.be.equal(null);
	});

});

function isShipPossitionAdjacentTo(placedShips, ship) {
	let otherShips = placedShips.filter( el => el != ship);
	var adjacentShip = null;
	ship.tilesOccupied.forEach(function (tile) {
		let tileAdjacencyArr = buildAdjacencyArray(tile);
		tileAdjacencyArr.forEach( (adjacentTileObj) => {
			adjacentShip = checkForShip(otherShips, adjacentTileObj.tile);
		})
	});

	return adjacentShip;
}

function isShipPossitionIntersectsWith(placedShips, ship) {
	let otherShips = placedShips.filter( el => el != ship);
	var intersectedShip = null;
	ship.tilesOccupied.forEach(function (tile) {
		intersectedShip = checkForShip(otherShips, tile);
	});

	return intersectedShip; //if not intersects with other ships
}

function checkForShip(placedShips, tile) {
	var foundShip = null;
	placedShips.forEach(function (ship, index, array) {
		if (ship.tilesOccupied.indexOf(tile) != -1 && ship.health > 0) {
			foundShip = ship;
		}
	});
	return foundShip;
};
