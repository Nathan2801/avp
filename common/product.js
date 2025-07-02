const Unit = {
	UN: 0,
	KG: 1,
	LT: 2,
}

const UnitToString = (u) => {
	switch (u) {
		case Unit.UN: return "UN";
		case Unit.KG: return "KG";
		case Unit.LT: return "LT";
		default: return null;
	}
}

const UnitFromString = (x) => {
	return Unit[x.toUpperCase()];
}

const Product = (args) => {
	return {
		description: args?.description || "",
		code: Number(args?.code) ?? "",
		price: Number(args?.price) ?? 0,
		unit: args?.unit ?? Unit.UN,
		amount: Number(args?.amount) ?? 1,
		repeat: Number(args?.repeat) ?? 1,
	};
}

const productFromForm = (form) => {
	return Product({
		description: form["description"].value,
		code: form["code"].value,
		price: form["price"].value,
		unit: UnitFromString(form["unit"].value),
		amount: form["amount"].value,
		repeat: form["repeat"].value,
	});
}

const productGrams = (product) => {
	if (product.unit != Unit.KG) {
		console.error("product unit is not KG");
		return 0;
	}
	return product.amount * 1000;
}

const productMillilitre = (product) => {
	if (product.unit != Unit.LT) {
		console.error("product unit is not LT");
		return 0;
	}
	return product.amount * 1000;
}

// TODO: should round up when third decimal is >=5.
const productUnitPrice = (product) => {
	switch (product.unit) {
		case Unit.UN:
			return product.price / product.amount;
		case Unit.KG:
			return product.price / productGrams(product) * 1000;
		case Unit.LT:
			return product.price / productMillilitre(product) * 1000;
		default:
			console.error(`invalid unit value: ${product.unit}`);
			break;
	}
}
