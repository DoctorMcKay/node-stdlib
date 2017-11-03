const StdLib = require('../index.js');
const IPv4 = StdLib.IPv4;

let localhostInt = 2130706433;
let localhostString = "127.0.0.1";

if (IPv4.intToString(localhostInt) !== localhostString) {
	throw new Error("intToString(localhostInt) should be " + localhostString + ", but got " + IPv4.intToString(localhostInt));
} else {
	console.log("intToString(localhostInt) passed");
}

if (IPv4.stringToInt(localhostString) !== localhostInt) {
	throw new Error("stringToInt(localhostString) should be " + localhostInt + ", but got " + IPv4.stringToInt(localhostString));
} else {
	console.log("stringToInt(localhostString) passed");
}
