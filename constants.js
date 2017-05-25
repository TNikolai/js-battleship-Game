
var SHIPS = [{ shipType: "Aircraft Carrier", health: 5, tilesOccupied: [] }, { shipType: "Battleship", health: 4, tilesOccupied: [] },
{ shipType: "Submarine", health: 3, tilesOccupied: [] }, { shipType: "Patrol Boat", health: 2, tilesOccupied: [] }];

var ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var COLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var GRIDSIZE = 10;
var P1CELLSIZE = 40;
var P2CELLSIZE = 40;
var CELLSIZE = 40;
var CIRCLESIZE = 15;
var DIRECTIONS = ["up", "right", "down", "left"];
var SHIPCOLOR = "green";
var HITCOLOR = "rgb(219, 57, 57)";
var BGCOLOR = "rgb(191, 234, 255)";
var MISSCOLOR = "white";

export {
    SHIPS,
    ROWS,
    COLS,
    GRIDSIZE,
    P1CELLSIZE,
    P2CELLSIZE,
    CELLSIZE,
    CIRCLESIZE,
    DIRECTIONS,
    SHIPCOLOR,
    HITCOLOR,
    BGCOLOR,
    MISSCOLOR,
}
