// This code uses functional programming concepts
// which makes it unnecessary complicated, and it
// has no good reason to be implemented this way :)
//
const Tokenizer = (text, token) => ({
	text: text,
	token: token,
})

const ord = (char) => char ? char.charCodeAt(0) : -1

const isDigit = (t) => (
	ord(t.text[0]) >= ord("0")
	&& ord(t.text[0]) <= ord("9")
)

const isNumber = (t) => (
	t.text[0] === "."
	|| t.text[0] === ","
	|| isDigit(t)
)

const isAlpha = (t) => (
	(
		ord(t.text[0]) >= ord("a")
		&& ord(t.text[0]) <= ord("z")
	) ||
	(
		ord(t.text[0]) >= ord("A")
		&& ord(t.text[0]) <= ord("Z")
	)
)

const consume = (t) => Tokenizer(
	t.text.slice(1),
	t.token === undefined
		? t.text[0]
		: t.token + t.text[0]
)

Tokenizer.word = (t) => isAlpha(t)
	? Tokenizer.word (consume(t))
	: t

Tokenizer.number = (t) => isNumber(t)
	? Tokenizer.number (consume(t))
	: t

Tokenizer.ok = (t) => t.token !== undefined

Tokenizer.done = (t) => Tokenizer(t.text)

export default Tokenizer;
