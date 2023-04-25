import {isValid} from 'psl';

interface CookieOptions {
	name: string;
	content: string;
	domain: string;
	expires: Date|null;
	path: string;
	secure: boolean;
}

export default class Cookie {
	name: string;
	content: string;
	domain: string;
	expires: Date|null;
	path: string;
	secure: boolean;

	constructor(options: CookieOptions) {
		this.name = options.name;
		this.content = options.content;
		this.domain = options.domain;
		this.expires = options.expires;
		this.path = options.path;
		this.secure = options.secure;
	}

	static parse(setCookie: string, domain: string): Cookie|null {
		let parts = setCookie.split(';').map(p => p.trim());
		let nameAndValue = parseEqSeparated(parts.splice(0, 1)[0]);
		if (!nameAndValue) {
			return null;
		}

		let [name, content] = nameAndValue;
		let expires = null;
		let path = '/';
		let secure = false;

		if (content.startsWith('"') && content.endsWith('"')) {
			content = content.replace(/(^"|"$)/g, '');
		}

		domain = domain.toLowerCase();

		parts.forEach((attr) => {
			let splitAttr = parseEqSeparated(attr);
			if (!splitAttr) {
				if (attr.trim().toLowerCase() == 'secure') {
					secure = true;
				}

				return;
			}

			let [attrName, attrValue] = splitAttr;

			switch (attrName.toLowerCase()) {
				case 'domain':
					if (domain == '__jarimport__') {
						// we're importing a saved jar, always trust this domain
						domain = attrValue;
						break;
					}

					attrValue = trimDots(attrValue).toLowerCase();

					// Cookies can only be set to a specific domain if they aren't a public suffix (checked by isValid),
					// and if the domain attribute is a subdomain of the request domain.
					if (isValid(attrValue) && domain.includes(attrValue)) {
						// Leading dot indicates internally that we send this to subdomains. If no Domain attribute is
						// provided, then the cookie is not sent to subdomains
						domain = `.${attrValue}`;
					}
					break;

				case 'expires':
					let date = new Date(attrValue);
					if (date.toString() != 'Invalid Date') {
						expires = date;
					}
					break;

				case 'path':
					path = attrValue;
					break;
			}
		});

		return new Cookie({
			name,
			content,
			domain,
			expires,
			path,
			secure
		});
	}

	stringify(): string {
		let output = `${this.name}=${this.content}`;
		let attributes:any = {
			Domain: this.domain,
			Path: this.path
		};

		if (this.expires) {
			attributes.Expires = this.expires.toUTCString();
		}

		attributes = Object.keys(attributes).map(attrName => `${attrName}=${attributes[attrName]}`).join('; ');
		if (this.secure) {
			attributes += '; Secure';
		}

		return `${output}; ${attributes}`;
	}

	shouldSendForRequest(domain: string, path: string, secure: boolean): boolean {
		if (this.expires && this.expires.getTime() < Date.now()) {
			return false;
		}

		if (this.secure && !secure) {
			return false;
		}

		if (!path.startsWith(this.path)) {
			return false;
		}

		if (this.domain[0] != '.' && domain.toLowerCase() != this.domain) {
			// must be exact domain match
			return false;
		}

		// subdomain match
		if (!domain.toLowerCase().endsWith(this.domain.substring(1))) {
			return false;
		}

		return true;
	}
}

function parseEqSeparated(value: string): string[]|null {
	let eqIdx = value.trim().indexOf('=');
	if (eqIdx == -1) {
		return null;
	}

	let name = value.slice(0, eqIdx).trim();
	let content = value.slice(eqIdx + 1).trim();
	return [name, content];
}

function trimDots(value: string): string {
	return value.replace(/(^\.|\.$)/g, '');
}
