const Product = (args) => {
	return {
		description: args?.description || "",
		code: Number(args?.code) || "",
		price: Number(args?.price) || 0,
		amountType: args?.amountType || "un",
		amount: Number(args?.amount) || 1,
		repeat: Number(args?.repeat) || 1,
	};
}

Product.fromForm = (form) => {
	return Product({
		description: form["description"].value,
		code: form["code"].value || "",
		price: form["price"].value || 0.0,
		amountType: form["amount-type"].value,
		amount: form["amount"].value,
		repeat: form["repeat"].value,
	});
}

const productGrams = (product) => {
	if (product.amountType != "kg") {
		console.error("product is not by kg");
		return 0;
	}
	return product.amount * 1000;
}

const productMillilitre = (product) => {
	if (product.amountType != "lt") {
		console.error("product is not by lt");
		return 0;
	}
	return product.amount * 1000;
}

// TODO: should round up when third decimal is >=5.
const productPricePerAmount = (product) => {
	switch (product.amountType) {
		case "un":
			return product.price / product.amount;
		case "kg":
			return product.price / productGrams(product) * 1000;
		case "lt":
			return product.price / productMillilitre(product) * 1000;
		default:
			console.error("invalid enum value");
			break;
	}
}

const productForm = document.getElementById("product-form");
const productsTable = document.getElementById("products-table");

productForm.addEventListener("submit", (ev) => {
	ev.preventDefault();

	const product = Product.fromForm(productForm);
	addProductToTable(productsTable, product);

	productForm.reset();
	productForm["description"].focus();
});

const addProductToTable = (table, product) => {
	const row = table.tBodies[0].insertRow(-1);

	for (const value of Object.values(product)) {
		const cell = row.insertCell(-1);
		const text = document.createTextNode(value);
		cell.appendChild(text)
	}

	const text = document.createTextNode(productPricePerAmount(product));
	const cell = row.insertCell(-1);
	cell.appendChild(text);

	const remove = document.createElement("button");
	remove.innerText = "X";
	remove.addEventListener("click", (ev) => {
		table.deleteRow(row.rowIndex);
	});

	const actionCell = row.insertCell(-1);
	actionCell.appendChild(remove);
}

const productTableIterator = (t) => {
	return {
		*[Symbol.iterator]() {
			let first = true;
			for (const row of t.rows) {
				if (first) {
					first = false;
					continue;
				}

				// FIXME: this code sensible to product property changes
				yield Product({
					description: row.cells[0].firstChild.data,
					code: row.cells[1].firstChild.data,
					price: row.cells[2].firstChild.data,
					amountType: row.cells[3].firstChild.data,
					amount: row.cells[4].firstChild.data,
					repeat: row.cells[5].firstChild.data,
				});
			}
		}
	};
}

const printContainer = () => {
	const div = document.createElement("div");
	div.classList.add("print-container");
	return div;
}

const whitePlateTemplate = (product) => {
	const currency = "R$";
	const amountType = product.amountType.toUpperCase();
	const pricePerAmount = productPricePerAmount(product).toFixed(2);
	const template = `<div class="white-plate-template">
		<h2><b>${product.description}</b></h2>
		<span>
			<b>${currency}</b>
			<h1>${product.price.toFixed(2)}</h1>
			<b>${amountType}</b>
		</span>
		<h5><b>NESSA EMBALAGEM A ${amountType} SAI ${pricePerAmount}</b></h5>
	</div>`;

	const parent = document.createElement("div");
	parent.innerHTML = template;
	return parent.firstChild;
}

const createPrintWindow = () => {
	const w = window.open()
	w.document.open();
	w.document.write(`
	<html>
		<head>
			<link href="./wb-style.css" rel="stylesheet">
		</head>
		<body>
		</body>
	</html>
	`);
	w.document.close();
	return w;
}

const printPlates = document.getElementById("print-plates");

printPlates.addEventListener("click", (ev) => {
	let currContainer = null;

	const products = [];
	for (const product of productTableIterator(productsTable)) {
		for (let i = 0; i < product.repeat; i++) {
			products.push(product);
		}
	}

	if (products.length === 0) {
		window.alert("Não há produtos");
		return;
	}

	const printWindow = createPrintWindow();

	let i = 0;
	for (const product of products) {
		if (i == 0 || i % 10 === 0) {
			currContainer = printContainer();
			printWindow.document.body.appendChild(currContainer);
		}

		const template = whitePlateTemplate(product);
		currContainer.appendChild(template);

		i++;
	}

	printWindow.print();
	printWindow.close();
});

const exportTable = document.getElementById("export-table");

exportTable.addEventListener("click", () => {
	window.alert("Não implementado ainda");
});
