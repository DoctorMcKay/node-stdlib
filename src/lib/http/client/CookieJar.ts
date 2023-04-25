import Cookie from './Cookie';

export default class CookieJar {
	#cookies: Cookie[];

	constructor() {
		this.#cookies = [];
	}

	get cookies() {
		return this.#cookies.slice(0);
	}

	add(cookie: Cookie|string, domain: string): void {
		if (typeof cookie == 'string') {
			cookie = Cookie.parse(cookie, domain);
		}

		let cookieObj:Cookie = cookie;

		// If this matches an existing cookie by name and domain, delete that old one
		let matchingCookie = this.#cookies.findIndex(c => c.name == cookieObj.name && c.domain == cookieObj.domain);
		if (matchingCookie != -1) {
			this.#cookies.splice(matchingCookie, 1);
		}

		this.#cookies.push(cookie);
	}

	remove(cookieName: string, domain: string): boolean {
		let matchingCookie = this.#cookies.findIndex(c => c.name == cookieName && c.domain == domain);
		if (matchingCookie != -1) {
			this.#cookies.splice(matchingCookie, 1);
			return true;
		}

		return false;
	}

	getCookieHeaderForUrl(url: string): string {
		let parsedUrl = new URL(url);
		return this.#cookies.filter(
			cookie => cookie.shouldSendForRequest(parsedUrl.hostname, parsedUrl.pathname, parsedUrl.protocol == 'https:')
		).map(c => [c.name, c.content].join('=')).join('; ');
	}

	stringify(): string {
		return JSON.stringify(this.#cookies.map(c => c.stringify()));
	}

	static parse(stringifiedJar: string): CookieJar {
		let jar = new CookieJar();
		JSON.parse(stringifiedJar)
			.map(cookieString => Cookie.parse(cookieString, '__jarimport__'))
			.filter(v => v)
			.forEach(cookie => jar.add(cookie, cookie.domain));

		return jar;
	}
}

Object.defineProperty(CookieJar.prototype, 'cookies', {enumerable: true});
