const SHIPS = [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] },
		  				 { shipType: "Battleship", health: 4, tilesOccupied: [] },
			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] } ];
// const SHIPS = [{ shipType: "Battleship", health: 4, tilesOccupied: [] },
// 			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
// 			  			 { shipType: "Submarine", health: 3, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 				  		 { shipType: "Patrol Boat", health: 2, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] },
// 							 { shipType: "Cruiser", health: 1, tilesOccupied: [] }
// 						  ];

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var GRIDSIZE = 10;
var CELLSIZE = 40;
var DIRECTIONS = ["up", "right", "down", "left"];
var SHIPCOLOR = "green";
var HITCOLOR = "rgb(219, 57, 57)";
var BGCOLOR = "rgb(191, 234, 255)";
var MISSCOLOR = "white";

const MISS = 'MISS';
const HIT = 'HIT';
const SUNK = 'SUNK';
const DUPLICATED = 'DUPLICATED';

function shipsCopy() {
	return JSON.parse(JSON.stringify(SHIPS))
}



export {
    SHIPS,
		shipsCopy,
    ROWS,
    COLS,
    GRIDSIZE,
    CELLSIZE,
    DIRECTIONS,
    SHIPCOLOR,
    HITCOLOR,
    BGCOLOR,
    MISSCOLOR,
		MISS,
		HIT,
		SUNK,
		DUPLICATED,
}
