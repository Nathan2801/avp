const ID = (id) => document.getElementById(id);

ID("print-plates").addEventListener("click", (ev) => printPlates());
ID("export-table").addEventListener("click", (ev) => window.alert("Não implementado"));

ID("load-lines").addEventListener(
	"click",
	(ev) => loadFormFromTextArea(
		ID("product-form"),
		ID("text-area-for-load")
	)
);

document.addEventListener("keydown", (ev) => {
	switch (ev.key) {
		case "F1":
			printPlates();
			break;
		case "F2":
			productForm.requestSubmit();
			break;
		case "F4":
			loadFormFromTextArea(
				ID("product-form"),
				ID("text-area-for-load")
			);
			break;
	}
});

const productForm = document.getElementById("product-form");

productForm.addEventListener("submit", (ev) => {
	ev.preventDefault();

	const form = ev.target;

	const desc = form["description"];
	if (!validField(desc, validateRequired)) return;

	const code = form["code"];
	if (!validField(code, validateAllNumbers)) return;

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

	addProductToTable(ID("products-table"), product);

	form.reset();
	desc.focus();
});

const addProductToTable = (table, product) => {
	const row = table.tBodies[0].insertRow(-1);

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
		price:     product.price.toFixed(2).replace(".", ","),
		unit:      product.packed ? UN.toString() : product.unit.toString(),
		unitPrice: productUnitPrice(product).toFixed(2).replace(".", ","),
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
		<head>
		</head>
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

const printPlates = () => {
	let currPage = null;

	const products = [];
	for (const product of productTableIterator(ID("products-table"))) {
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
			currPage = createA4Page();
			printWindow.document.body.appendChild(currPage);
		}

		const plate = createPlateElement(product);
		currPage.appendChild(plate);

		i++;
	}
}

const loadFormFromTextArea = (form, textArea) => {
	const lines = textArea.value.split("\n");
	for (const line of lines) {
		const err = loadFormFromLine(form, line);
		if (err) {
			console.error(err);
			continue;
		}
		productForm.requestSubmit();
	}
}

const loadFormFromLine = (form, line) => {
	const values = line.split("-").map((x) => x.trim());
	if (values.length < 3) {
		return `line should have at least three sections:\n"${line}"`;
	}

	const [code, desc, price, ...rest] = values;

	form["code"].value = code;
	form["price"].value = price;
	form["description"].value = desc;

	form["repeat"].value = "1";
	if (rest[0]?.toUpperCase().startsWith("SOMENTE LOJA")) {
		form["repeat"].value = 2;
	}

	let unitFigured = false;
	for (const word of desc.split(" ")) {
		const [n, rest1] = Parser.parseNumber(word);
		if (n === null) {
			continue;
		}

		const [u, rest2] = Parser.parseWord(rest1);

		const unit = UnitFromString(u);
		if (unit === null) {
			return `unknown unit: ${unit}`;
		}

		unitFigured = true;
		form["unit"].value = unit.toString().toLowerCase();

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

		form["amount"].value = amount;
	}

	form["packed"].checked = true;

	if (unitFigured === false) {
		return `unit not figured out:\n"${line}"`;
	}

	return "";
}

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

		let desc = "";
		const descLen = Math.floor(Math.random() * 50) + 20;
		for (let i = 0; i < descLen; i++) {
			const space = Math.floor(Math.random() * 4);
			if (space === 0) {
				desc += " ";
			} else {
				desc += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
			}
		}

		addProductToTable(ID("products-table"), Product({
			description: desc,
			code: "1231231231231",
			price: Math.random() * 100,
			unit: [UN, KG, LT][Math.floor(Math.random() * 3)],
			amount: amount,
			repeat: 1,
			packed: Math.round(Math.random()) === 1,
		}));
	}
}
