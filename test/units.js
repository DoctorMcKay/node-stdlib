const StdLib = require('../index.js');
const Units = StdLib.Units;

checkStringEqual("humanReadableBytes(7894561)", "7.9 MB", Units.humanReadableBytes(7894561));
checkStringEqual("humanReadableBytes(7894561, true)", "7.5 MiB", Units.humanReadableBytes(7894561, true));
checkStringEqual("humanReadableBytes(1000000000)", "1 GB", Units.humanReadableBytes(1000000000));
checkStringEqual("humanReadableBytes(1000000000, false, true)", "1.0 GB", Units.humanReadableBytes(1000000000, false, true));

function checkStringEqual(testName, expected, actual) {
	if (expected !== actual) {
		throw new Error(testName + " should be \"" + expected + "\" but got \"" + actual + "\"");
	} else {
		console.log(testName + " passed with expected value \"" + actual + "\"");
	}
}
