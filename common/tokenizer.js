// This code uses functional programming concepts
// which makes it unnecessary complicated, and it
// has no good reason to be implemented this way :)
//
export const TKind = {
	unknown: 0,
	space:   1,
	number:  2,
	alpha:   3,
}

const Tokenizer = (text, token = "", tkind = TKind.unknown) => ({
	text:  text,
	token: {
		text: token,
		kind: tkind,
	}
})

const skip = (t, tkind) => (
	t.text.length > 0
	? Tokenizer(
		t.text.slice(1),
		t.token.text,
		tkind
	)
	: t
)

const consume = (t, tkind) => (
	t.text.length > 0
	? Tokenizer(
		t.text.slice(1),
		t.token.text + t.text[0],
		tkind
	)
	: t
)

const ord = (char) => char ? char.charCodeAt(0) : -1

const isSpace = (t) => (
	t.text[0] == " "  ||
	t.text[0] == "\t"
)

const isDigit = (t) => (
	ord(t.text[0]) >= ord("0") &&
	ord(t.text[0]) <= ord("9")
)

const isNumber = (t) => (
	t.text[0] === "." ||
	t.text[0] === "," ||
	isDigit(t)
)

const isAlpha = (t) => (
	(
		ord(t.text[0]) >= ord("a") &&
		ord(t.text[0]) <= ord("z")
	) || (
		ord(t.text[0]) >= ord("A") &&
		ord(t.text[0]) <= ord("Z")
	)
)

const consumeAlpha = (t) => (
	isAlpha(t)
	? consumeAlpha(consume(t, TKind.alpha))
	: t
)

const consumeNumber = (t) => (
	isNumber(t)
	? consumeNumber(consume(t, TKind.number))
	: t
)

const eraseValue = (t) => Tokenizer(t.text)

const nextToken = (t) => (
	isSpace(t)
	? nextToken(skip(t))
	: (
		isAlpha(t)
		? consumeAlpha(consume(t, TKind.alpha))
		: (
			isNumber(t)
			? consumeNumber(consume(t, TKind.number))
			: consume(t)
		)
	)
)

Tokenizer.tokens = (t, ts = []) => (
	t.text.length > 0
	? Tokenizer.tokens(
		eraseValue(nextToken(t)),
		[...ts, nextToken(t).token]
	)
	: ts
)

export default Tokenizer;
