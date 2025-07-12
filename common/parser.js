// This code uses functional programming concepts
// which makes it unnecessary complicated, and it
// has no good reason to be implemented this way :)
//
const Parser = (text, parsed) => ({
	text: text,
	parsed: parsed,
})

const ord = (char) => char ? char.charCodeAt(0) : -1

const isDigit = (parser) => (
	ord(parser.text[0]) >= ord("0")
	&& ord(parser.text[0]) <= ord("9")
)

const isNumber = (parser) => (
	parser.text[0] === "."
	|| parser.text[0] === ","
	|| isDigit(parser)
)

const isAlpha = (parser) => (
	(
		ord(parser.text[0]) >= ord("a")
		&& ord(parser.text[0]) <= ord("z")
	) ||
	(
		ord(parser.text[0]) >= ord("A")
		&& ord(parser.text[0]) <= ord("Z")
	)
)

const consume = (parser) => Parser(
	parser.text.slice(1),
	parser.parsed === undefined
		? parser.text[0]
		: parser.parsed + parser.text[0]
)

Parser.parseWord = (parser) => isAlpha(parser)
	? Parser.parseWord (consume(parser))
	: parser

Parser.parseNumber = (parser) => isNumber(parser)
	? Parser.parseNumber (consume(parser))
	: parser

Parser.done = (parser) => Parser(parser.text)

export default Parser;
