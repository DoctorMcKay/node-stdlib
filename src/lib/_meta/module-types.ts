import {Agent} from 'http';

export interface Arrays {
	unique: (array: any[], strict: boolean) => any[]
}

export interface Hashing {
	md5: (input: string|Buffer, outputForm: string) => string|Buffer;
	sha1: (input: string|Buffer, outputForm: string) => string|Buffer;
	sha256: (input: string|Buffer, outputForm: string) => string|Buffer;
	crc32: (input: string|Buffer, outputForm: string) => string|number|Buffer;
}

export interface Http {
	getProxyAgent: (secure: boolean, proxyUrl: string, proxyTimeout: number) => boolean|Agent;
}

export interface IPv4 {
	intToString: (ipInt: number) => string;
	stringToInt: (ipString: string) => number;
}

export interface Objects {
	clone: (obj: any) => any;
	deepEqual: (obj1: any, obj2: any, strict: boolean) => boolean;
}

export interface Parsing {
	orderedArgs: (input: string) => string[];
}

export interface Promises {
	timeoutPromise: (timeout: number, executor: (resolve: (value: any) => void, reject: (err: any) => void) => any) => Promise<any>;

	callbackPromise: (
		callbackArgs: string[]|null,
		callback: null|((...args) => void),
		isOptional: boolean,
		executor: (
			resolve: (value: any) => void,
			reject: (err: any) => void
		) => void
	) => Promise<any>;

	timeoutCallbackPromise: (
		timeout: number,
		callbackArgs: string[]|null,
		callback: null|((...args) => void),
		isOptional: boolean,
		executor: (
			resolve: (value: any) => void,
			reject: (err: any) => void
		) => void
	) => Promise<any>;

	retryPromise: (
		attempts: number,
		delayBetweenAttempts: number,
		executor: (
			resolve: (value: any) => void,
			reject: (err: any) => void
		) => void
	) => Promise<any>;

	sleepAsync: (sleepMilliseconds: number) => Promise<void>;
}

export interface Rendering {
	progressBar: (value: number, maxValue: number, barWidth: number, showPercentage: boolean) => string;
}

export interface Time {
	timestampString: () => string;
}

export interface Units {
	humanReadableBytes: (bytes: number, binary: boolean, forceDecimal: boolean) => string;
}
