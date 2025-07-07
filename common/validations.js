const ChainValiation = (x) => ({
	ok() {
		return x !== null;
	},
	map(f) {
		return !this.ok() ? ChainValiation(null) : ChainValiation(f(x));
	},
	validate(f) {
		return !this.ok() || !f(x) ? ChainValiation(null) : this;
	},
	validateAll(f) {
		return !this.ok() || !x.every(f) ? ChainValiation(null) : this;
	},
})

const _split = (c) => (s) => s.split(c)

const _length = (l) => (s) => s.length === l

const _isNumber = (s) => !Number.isNaN(Number(s))

const _notEmpty = (s) => s.length !== 0

const _includes = (c) => (s) => s.includes(c)

const _isInteger = (s) => Number(s) % 1 === 0

export const validateRequired = (s) => (
    _notEmpty(s)
) ? "" : "Esse valor é obrigatório"

export const validateNumber = (s) => (
	_isNumber(s)
) ? "" : "Este valor deve ser um número"

export const validateFloat = (s) => (
	!_notEmpty(s) ||
	ChainValiation(s)
	.validate(_includes("."))
	.map(_split("."))
	.validate(_length(2))
	.validateAll(_isNumber)
	.ok()
) ? "" : "Número deve ser decimal"

export const validateInteger = (s) => (
	_isInteger(s)
) ? "" : "Número deve ser inteiro"

export const validField = (f, v) => {
	for (const err = v(f.value); err !== "";) {
		f.setCustomValidity(err);
		f.reportValidity();
		return false;
	}
	return true;
}

export default {};
