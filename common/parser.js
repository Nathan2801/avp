// This code uses functional programming concepts
// which makes it unnecessary complicated, and it
// has no good reason to be implemented this way :)
//
const Parser = (text, parsed) => ({
	text: text,
	parsed: parsed,
})

Parser.ord = (char) => char ? char.charCodeAt(0) : -1

Parser.isDigit = (parser) => (
	Parser.ord(parser.text[0]) >= Parser.ord("0")
	&& Parser.ord(parser.text[0]) <= Parser.ord("9")
)

Parser.isNumber = (parser) => (
	parser.text[0] == "."
	|| Parser.isDigit(parser)
)

Parser.isAlpha = (parser) => (
	(
		Parser.ord(parser.text[0]) >= Parser.ord("a")
		&& Parser.ord(parser.text[0]) <= Parser.ord("z")
	) ||
	(
		Parser.ord(parser.text[0]) >= Parser.ord("A")
		&& Parser.ord(parser.text[0]) <= Parser.ord("Z")
	)
)

Parser.create = (f) => (m) => (parser) => f(parser) ? m(parser) : parser

Parser.consume = (parser) => Parser(
	parser.text.slice(1),
	parser.parsed === undefined
		? parser.text[0]
		: parser.parsed + parser.text[0]
)

const chain = (f) => (g) => (x) => g(f(x))

Parser.parseWord = Parser.create
	(Parser.isAlpha)
	(chain (Parser.consume) (Parser.parseWord))

Parser.parseNumber = Parser.create
	(Parser.isNumber)
	(chain (Parser.consume) (Parser.parseNumber))

Parser.done = (parser) => Parser(parser.text)

export default Parser;
