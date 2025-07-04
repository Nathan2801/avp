const productsTable = document.getElementById("products-table");

const productForm = document.getElementById("product-form");

productForm.addEventListener("submit", (ev) => {
	ev.preventDefault();

	const form = ev.target;

	const desc = form["description"];
	if (!validField(desc, validateRequired)) return;

	const code = form["code"];
	if (!validField(code, validateEANOptional)) return;

	const price = form["price"];
	price.value = price.value.replace(",", ".");

	const priceSplit = price.value.split(".");
	if (
		!priceSplit[0] || priceSplit[0].length   < 1 ||
		!priceSplit[1] || priceSplit[1].length !== 2
	) {
		price.setCustomValidity("Preço inválido! ex: 1,50");
		price.reportValidity();
		return;
	}

	const amount = form["amount"];
	amount.value = amount.value.replace(",", ".");

	if (!Number(amount.value)) {
		amount.setCustomValidity("Quantidate inválida!");
		amount.reportValidity();
		return;
	}

	const repeat = form["repeat"];
	if (!Number(repeat.value)) {
		repeat.setCustomValidity("Repetição inválida!");
		repeat.reportValidity();
		return;
	}

	const packed = form["packed"];
	console.log(packed.checked);

	const product = Product({
		description: desc.value,
		code: 		 code.value,
		price: 		 Number(price.value),
		unit: 		 UnitFromString(form["unit"].value),
		amount: 	 Number(amount.value),
		repeat: 	 Number(repeat.value),
		packed: 	 packed.checked,
	});

	addProductToTable(product);

	form.reset();
	desc.focus();
});

const addProductToTable = (product) => {
	const row = productsTable.tBodies[0].insertRow(-1);

	for (const [key, value] of Object.entries(product)) {
		let v = value;
		if (key === "price") {
			v = value.toFixed(2);
		} else if (key === "amount") {
			v = value.toFixed(3);
		}
		const text = document.createTextNode(v);
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
				yield Product({
					description: row.cells[0].firstChild.data,
					code: 		 row.cells[1].firstChild.data,
					price: 		 Number(row.cells[2].firstChild.data),
					unit: 	 	 UnitFromString(row.cells[3].firstChild.data),
					amount: 	 Number(row.cells[4].firstChild.data),
					repeat: 	 Number(row.cells[5].firstChild.data),
					packed:      row.cells[6].firstChild.data === "true",
				});
			}
		}
	};
}

const templateSelect = document.getElementById("template"); 

const createTemplateOption = (template) => {
	const option = document.createElement("option");

	option.value = template.name;
	option.innerText = template.name;

	templateSelect.appendChild(option);
}

createTemplateOption(defaultTemplate);
createTemplateOption( yellowTemplate);

const createPlateElement = (product) => {
	const element = useTemplate(templateSelect.value, {
		desc:      product.description,
		currency:  "R$",
		price:     product.price.toFixed(2),
		unit:      product.unit.toString(),
		unitPrice: productUnitPrice(product).toFixed(2),
		code: 	   product.code,
		unitDesc:  productUnitPriceDescription(product),
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
		<head></head>
		<style>
			* {
				margin: 0px;
				padding: 0px;
				box-sizing: border-box;
				font-family: sans-serif;
			}
		</style>
		<body></body>
	</html>
	`);
	w.document.close();
	return w;
}

const createPage = () => {
	const div = document.createElement("div");
	div.style.width = "210mm";
	div.style.height = "297mm";
	div.style.display = "flex";
	div.style.flexWrap = "wrap";
	div.style.border = "1px dashed red";
	div.style.alignContent = "start";
	div.style.padding = "1mm";
	return div;
}

const printPlatesButton = document.getElementById("print-plates");

printPlatesButton.addEventListener("click", (ev) => {
	let currPage = null;

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
		if (i == 0 || i % allTemplates[templateSelect.value].platePerPage === 0) {
			currPage = createPage();
			printWindow.document.body.appendChild(currPage);
		}

		const plate = createPlateElement(product);
		currPage.appendChild(plate);

		i++;
	}

	printWindow.print();
});

const exportTableButton = document.getElementById("export-table");

exportTableButton.addEventListener("click", (ev) => {
	window.alert("Não implementado");
});

const newTemplateButton = document.getElementById("new-template");

newTemplateButton.addEventListener("click", (ev) => {
	window.location.href = "./new-template";
});

const lineLoader = document.getElementById("line-loader");
const loadLineButton = document.getElementById("load-line");

loadLineButton.addEventListener("click", (ev) => {
	const line = lineLoader.value;
	const values = line.split("-").map((x) => x.trim());

	if (values.length !== 3) {
		console.error("invalid line");
		return;
	}

	const [code, desc, price] = values;
	productForm["description"].value = desc;
	productForm["code"].value = code;
	productForm["price"].value = price;
	productForm["repeat"].value = "1";

	for (const word of desc.split(" ")) {
		const [n, rest1] = Parser.parseNumber(word);
		if (n === null) {
			continue;
		}

		const [u, rest2] = Parser.parseWord(rest1);

		const unit = UnitFromString(u);
		if (unit === null) {
			console.error("couldn't find unit");
			break;
		}

		productForm["unit"].value = unit.toString().toLowerCase();

		let amount = 0;
		switch (u) {
			case "UN": case "un":
			case "KG": case "kg":
			case "LT": case "lt":
				amount = n;
				break;
			case "G": case "g":
			case "ML": case "ml":
				amount = n / 1000;
				break;
		}

		productForm["amount"].value = amount;
	}
});

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("debug") === "true") {
	let n = Number(urlParams.get("amount")) || 12;
	for (let i = 0; i < n; i++) {
		let amount = 1;

		const unit = [UN, KG, LT][Math.floor(Math.random() * 3)];
		if (unit.iota === UN.iota) {
			amount = Math.ceil(Math.random() * 5);
		} else {
			amount = Math.random() * 2;
		}

		addProductToTable(Product({
			description: "A random 200g KAEL product",
			code: "1231231231231",
			price: Math.random() * 100,
			unit: [UN, KG, LT][Math.floor(Math.random() * 3)],
			amount: amount,
			repeat: 1,
			packed: Math.round(Math.random()) === 1,
		}));
	}
}
