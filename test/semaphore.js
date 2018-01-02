const StdLib = require('../index.js');
const Semaphore = StdLib.Concurrency.Semaphore;

let g_Counter = 0;

let sem = new Semaphore();
let now = Date.now();
sem.wait((release) => {
	checkTimeElapsed(now, 0, 100);
	checkCounter(0);
	g_Counter++;

	now = Date.now();
	sem.wait((release2) => {
		checkTimeElapsed(now, 1000, 1100);
		checkCounter(1);
		g_Counter++;

		release2();
		now = Date.now();
		sem.wait((release3) => {
			checkTimeElapsed(now, 0, 100);
			checkCounter(2);
			release3();

			console.log("All tests passed");
		});
	});

	setTimeout(release, 1000);
});

function checkCounter(expectedValue) {
	if (g_Counter != expectedValue) {
		throw new Error(`Counter value ${g_Counter} does not match expected value ${expectedValue}`);
	} else {
		console.log(`Counter value matched: ${g_Counter} == ${expectedValue}`);
	}
}

function checkTimeElapsed(started, lowerBound, upperBound) {
	let elapsedMs = Date.now() - started;
	lowerBound = lowerBound || 0;
	upperBound = upperBound || 60000;
	if (elapsedMs < lowerBound || elapsedMs > upperBound) {
		throw new Error(`Time elapsed failure: ${lowerBound} < ${elapsedMs} < ${upperBound}`);
	} else {
		console.log(`Time elapsed passed: ${lowerBound} < ${elapsedMs} < ${upperBound}`);
	}
}
