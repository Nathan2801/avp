const Parser = {}

Parser.ord = (char) => char.charCodeAt(0)

Parser.digit = (char) => (
	char.charCodeAt(0) - "0".charCodeAt(0)
)

Parser.isDigit = (char) => (
	char.charCodeAt(0) >= "0".charCodeAt(0) &&
	char.charCodeAt(0) <= "9".charCodeAt(0)
)

Parser.isAlpha = (char) => (
	(Parser.ord(char) >= Parser.ord("a") && Parser.ord(char) <= Parser.ord("z")) ||
	(Parser.ord(char) >= Parser.ord("A") && Parser.ord(char) <= Parser.ord("Z"))
)

Parser.parseNumber = (string) => {
	let r = null;
	let s = string;

	while (s.length > 0) {
		if (!Parser.isDigit(s[0])) {
			break;
		}
		if (r === null) {
			r = 0;
		}
		r = r * 10 + Parser.digit(s[0]);
		s = s.slice(1);
	}
	return [r, s];
}


Parser.parseWord = (string) => {
	let r = null;
	let s = string;

	while (s.length > 0) {
		if (!Parser.isAlpha(s[0])) {
			break;
		}
		if (r === null) {
			r = "";
		}
		r = r + s[0];
		s = s.slice(1);
	}
	return [r, s];
}
