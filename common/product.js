const Unit = (repr) => {
    return {
        iota: Unit.iota++,
        toString() {
            return repr;
        }
    };
}

Unit.iota = 0;

export const UN = Unit("UN");
export const KG = Unit("KG");
export const LT = Unit("LT");

const UnitStringMap = {
	["UN"]: UN, ["un"]: UN,
	["KG"]: KG, ["kg"]: KG,
	[ "G"]: KG, [ "g"]: KG,
	["LT"]: LT, ["lt"]: LT,
	["ML"]: LT, ["ml"]: LT,
}

export const UnitFromString = (s) => {
	return UnitStringMap[s];
}

export const Product = (args) => {
	return {
		desc:  	args?.desc   ?? "",
		code:  	args?.code   ?? "",
		price: 	args?.price  ?? 0,
		unit:   args?.unit   ?? UN,
		amount: args?.amount ?? 1,
		repeat: args?.repeat ?? 1,
        packed: args?.packed ?? true,
	};
}

const productGrams = (product) => product.amount * 1000

const productMillilitre = (product) => product.amount * 1000

export const productUnitPrice = (product) => {
    let unitPrice = 0;
	switch (product.unit.iota) {
		case UN.iota:
			unitPrice = product.price / product.amount;
            break;
		case KG.iota:
			unitPrice = product.price / productGrams(product) * 1000;
            break;
		case LT.iota:
			unitPrice = product.price / productMillilitre(product) * 1000;
            break;
		default:
			console.error(`invalid unit value: ${product.unit}`);
			return;
	}

    const priceMult = unitPrice * 100;
    const thirdDecimal = Math.floor((priceMult - Math.floor(priceMult)) * 10);

    if (thirdDecimal >= 5) {
        unitPrice = Math.ceil(priceMult) / 100;
    } else {
        unitPrice = Math.floor(priceMult) / 100;
    }

    return unitPrice;
}

export default {};
