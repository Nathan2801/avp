const validateAllNumbers = (s) => (
    !s.split("").map(Number).includes(NaN)
) ? "" : "Todos os caractéres devem ser números"

const validateRequired = (s) => (
    s.length !== 0
) ? "" : "Esse valor é obrigatório"

const validateNumber = (s) => (
	!Number.isNaN(Number(s))
) ? "" : "Caractére não é um número"

const validField = (f, v) => {
    for (const err = v(f.value); err !== "";) {
        f.setCustomValidity(err);
        f.reportValidity();
        return false;
    }
    return true;
}
