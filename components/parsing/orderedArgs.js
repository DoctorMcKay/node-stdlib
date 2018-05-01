module.exports = orderedArgs;

/**
 * Parse an ordered args string. For example, this string:
 * one two "three three" four\ four five
 * is parsed into: ["one", "two", "three three", "four four", "five"]
 * Double spaces between args are removed. But empty args in quotes are preserved.
 * @param {string} input
 * @return {string[]}
 */
function orderedArgs(input) {
	let buf = '',
		args = [],
		quoted = false,
		argWasQuoted = false,
		escaped = false,
		c;

	for (let i = 0; i < input.length; i++) {
		c = input.charAt(i);

		if (c == ' ' && !quoted && !escaped) {
			// end of current arg
			if (buf.length > 0 || argWasQuoted) {
				// ignore empty ones e.g. "one  two" should be ["one", "two"] and not ["one", "", "two"]
				args.push(buf);
			}
			buf = '';
			argWasQuoted = false;
		} else if (c == '"' && !escaped) {
			// beginning or end of a quoted arg
			quoted = !quoted;
			argWasQuoted = quoted ? true : argWasQuoted;
		} else if (c == '\\' && !escaped) {
			// next character is escaped
			escaped = true;
		} else {
			// middle of an arg, push its character onto the buffer
			escaped = false;
			buf += c;
		}
	}

	// if there's anything left over, push it as an arg
	if (buf.length > 0) {
		args.push(buf);
	}

	return args;
}
