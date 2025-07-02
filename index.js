const productsTable = document.getElementById("products-table");

document.getElementById("product-form").addEventListener("submit", (ev) => {
	ev.preventDefault();

	const form = ev.target;

	const product = productFromForm(form);
	addProductToTable(product);

	form.reset();
	form["description"].focus();
});

const addProductToTable = (product) => {
	const row = productsTable.tBodies[0].insertRow(-1);

	for (const value of Object.values(product)) {
		// FIXME: turn unit into string at table
		const text = document.createTextNode(value);
		const cell = row.insertCell(-1);
		cell.appendChild(text)
	}

	const text = document.createTextNode(productUnitPrice(product));
	const cell = row.insertCell(-1);
	cell.appendChild(text);

	const remove = document.createElement("button");
	remove.innerText = "X";
	remove.addEventListener("click", (ev) => {
		productsTable.deleteRow(row.rowIndex);
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
					unit: Number(row.cells[3].firstChild.data),
					amount: row.cells[4].firstChild.data,
					repeat: row.cells[5].firstChild.data,
				});
			}
		}
	};
}

const templateSelect = document.getElementById("template"); 

const defaultTemplate = Template({
	name: "Placa branca",
	code: `<div class="plate">
		<h2 class="description">
			<b>%desc%</b>
		</h2>
		<span>
			<b class="currency">%currency%</b>
			<h1 class="price">%price%</h1>
			<b class="amount-type">%unit%</b>
		</span>
		<h5 class="price-per-amount"><b>NESSA EMBALAGEM A/O %unit% SAI %unitPrice%</b></h5>
	</div>`,
	style: "",
})

const templatesInterface = createTemplatesInterface({
	select: templateSelect,
});

const createPlateElement = (product) => {
	const element = templatesInterface[templateSelect.value]?.({
		desc: product.description,
		currency: "R$",
		price: product.price.toFixed(2),
		unit: UnitToString(product.unit).toUpperCase(),
		unitPrice: productUnitPrice(product).toFixed(2),
	});
	if (element === null) {
		console.log("invalid template value");
		return;
	}
	const parent = document.createElement("div");
	parent.innerHTML = element;
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

const printContainer = () => {
	const div = document.createElement("div");
	div.classList.add("print-container");
	return div;
}

const printPlatesButton = document.getElementById("print-plates");

printPlatesButton.addEventListener("click", (ev) => {
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

		const plate = createPlateElement(product);
		currContainer.appendChild(plate);

		i++;
	}

	printWindow.print();
	printWindow.close();
});

const exportTableButton = document.getElementById("export-table");

exportTableButton.addEventListener("click", () => {
	window.alert("Não implementado");
});

const newTemplateButton = document.getElementById("new-template");

newTemplateButton.addEventListener("click", () => {
	window.location.href = "./new-template";
});

for (let i = 0; i < 20; i++) {
	addProductToTable(Product({
		description: "A random product",
		code: "1234567890",
		price: 0,
		unit: Unit.KG,
		amount: 0.300,
		repeat: 1,
	}));
}
