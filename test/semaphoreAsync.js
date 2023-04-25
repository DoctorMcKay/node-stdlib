// noinspection ES6MissingAwait

const StdLib = require('../_main.js');
const Semaphore = StdLib.Concurrency.Semaphore;

let g_Counter = 0;
let sem = new Semaphore();

main1();
main2();

async function main1() {
	checkSemFree(sem, true);
	let now = Date.now();
	let release = await sem.waitAsync();

	checkTimeElapsed(now, 0, 100);
	checkCounter(0);
	g_Counter++;
	checkSemFree(sem, false);

	now = Date.now();
	// When this timeout elapses, we will release to main2()
	setTimeout(release, 1000);

	let release2 = await sem.waitAsync();
	checkTimeElapsed(now, 1000, 1100);
	checkCounter(2);
	g_Counter++;
	checkSemFree(sem, false);

	release2();
	checkSemFree(sem, true);
	now = Date.now();

	let release3 = await sem.waitAsync();
	checkTimeElapsed(now, 0, 100);
	checkCounter(3);
	checkSemFree(sem, false);
	release3();
	checkSemFree(sem, true);
}

async function main2() {
	let release = await sem.waitAsync();
	checkCounter(1);
	g_Counter++;
	checkSemFree(sem, false);
	release();
}

function checkSemFree(sem, shouldBeFree) {
	let isFree = sem.free;
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

process.on('unhandledRejection', (ex) => {
	throw ex;
});
