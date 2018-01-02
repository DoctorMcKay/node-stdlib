const StdLib = require('../index.js');
const Semaphore = StdLib.Concurrency.Semaphore;

let g_Counter = 0;

let sem = new Semaphore();
checkSemFree(sem, true);
let now = Date.now();
sem.wait((release) => {
	checkTimeElapsed(now, 0, 100);
	checkCounter(0);
	g_Counter++;
	checkSemFree(sem, false);

	now = Date.now();
	sem.wait((release2) => {
		checkTimeElapsed(now, 1000, 1100);
		checkCounter(2);
		g_Counter++;
		checkSemFree(sem, false);

		release2();
		checkSemFree(sem, true);
		now = Date.now();
		sem.wait((release3) => {
			checkTimeElapsed(now, 0, 100);
			checkCounter(3);
			checkSemFree(sem, false);
			release3();
			checkSemFree(sem, true);
			// this will return to line 42
		});
	});

	setTimeout(release, 1000);
});

sem.wait((release) => {
	checkCounter(1);
	g_Counter++;
	checkSemFree(sem, false);
	release();
	checkSemFree(sem, true); // it should be free at this point because the remaining work is synchronous
	console.log("All tests passed");
});

function checkSemFree(sem, shouldBeFree) {
	let isFree = sem.isFree();
	if (isFree != shouldBeFree) {
		throw new Error(`Semaphore was expected to be ${shouldBeFree ? 'free' : 'not free'}, but it's ${isFree ? 'free' : 'not free'}`);
	} else {
		console.log("Semaphore is expectedly " + (isFree ? 'free' : 'not free'));
	}
}

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
		throw new Error(`Time elapsed failure: ${lowerBound} <= ${elapsedMs} <= ${upperBound}`);
	} else {
		console.log(`Time elapsed passed: ${lowerBound} <= ${elapsedMs} <= ${upperBound}`);
	}
}
