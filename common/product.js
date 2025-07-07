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

export const UnitFromString = (x) => {
    switch (x) {
        case "UN":
        case "un":
            return UN;
        case "KG":
        case "kg":
		case  "G":
		case  "g":
            return KG;
        case "LT":
        case "lt":
        case "ML":
        case "ml":
            return LT;
		default:
			return null;
    }
}

export const Product = (args) => {
	return {
		description: args?.description ?? "",
		code:        args?.code        ?? "",
		price:       args?.price       ?? 0,
		unit:        args?.unit        ?? UN,
		amount:      args?.amount      ?? 1,
		repeat:      args?.repeat      ?? 1,
        packed:      args?.packed      ?? true,
	};
}

const normalizePrice = (price) => {
    return price.replace(",", ".");
}

const productGrams = (product) => {
	if (product.unit.iota != KG.iota) {
		console.error("product unit is not KG");
		return 0;
	}
	return product.amount * 1000;
}

const productMillilitre = (product) => {
	if (product.unit.iota !== LT.iota) {
		console.error("product unit is not LT");
		return 0;
	}
	return product.amount * 1000;
}

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

export const productUnitPriceDescription = (product) => {
    let desc = "";
    if (product.packed) {
        desc = "NESSA EMBALAGEM ";
    }
    switch (product.unit.iota) {
        case UN.iota:
            return `${desc}A UN SAI`;
        case KG.iota:
            return `${desc}O KG SAI`;
        case LT.iota:
            return `${desc}O LT SAI`;
        default:
            console.error(`invalid unit value: ${product.unit}`);
            return;
    }
}

export default {};
