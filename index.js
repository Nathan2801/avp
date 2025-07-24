import {
	useTemplate,
	createA4Page,
	allTemplates,
} from "./common/templates.js";

import Tokenizer, {TKind} from "./common/tokenizer.js";

import {
	Product,
	UN, KG, LT,
	UnitFromString,
	productUnitPrice,
} from "./common/product.js";

import {
	validField,
	validateRequired,
	validateNumber,
	validateFloat,
	validateInteger,
} from "./common/validations.js";

const ID = (id) => document.getElementById(id);

ID("print-plates").addEventListener("click", (ev) => printPlates());

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

	const desc = form["desc"];
	if (!validField(desc, validateRequired)) return;

	const code = form["code"];
	if (!validField(code, validateInteger)) return;

	const price = form["price"];
	price.value = price.value.replace(",", ".");
	if (!validField(price, validateRequired)) return;
	if (!validField(price, validateFloat)) return;

	const amount = form["amount"];
	amount.value = amount.value.replace(",", ".");
	if (!validField(amount, validateRequired)) return;
	if (!validField(amount, validateNumber)) return;

	const repeat = form["repeat"];
	if (!validField(repeat, validateRequired)) return;
	if (!validField(repeat, validateInteger)) return;

	const packed = form["packed"];

	const product = Product({
		desc:   desc.value,
		code: 	code.value,
		price: 	Number(price.value),
		unit: 	UnitFromString(form["unit"].value),
		amount: Number(amount.value),
		repeat: Number(repeat.value),
		packed: packed.checked,
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
		} else if (key === "packed") {
			v = value ? "UN" : product.unit.toString().toUpperCase();
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
					desc:   row.cells[0].firstChild.data,
					code: 	row.cells[1].firstChild.data,
					price: 	Number(row.cells[2].firstChild.data),
					unit: 	UnitFromString(row.cells[3].firstChild.data),
					amount: Number(row.cells[4].firstChild.data),
					repeat: Number(row.cells[5].firstChild.data),
					packed: row.cells[6].firstChild.data === "UN",
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

for (const template of Object.values(allTemplates)) {
	createTemplateOption(template);
}

const createPlateElement = (product, parent = null) => {
	return useTemplate(templateSelect.value, {
		desc:      product.desc,
		currency:  "R$",
		price:     product.price.toFixed(2).replace(".", ","),
		unit:      product.unit.toString(),
		unitPrice: productUnitPrice(product).toFixed(2).replace(".", ","),
		code: 	   product.code,
		packed:    product.packed,
		parent:    parent,
	});
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

		const plate = createPlateElement(product, currPage);
		if (plate === null) {
			console.error("invalid plate element");
		} else if (plate !== true) {
			currPage.appendChild(plate);
		}

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
	const t = Tokenizer(line);

	const tokens = Tokenizer.tokens(t);
	if (tokens.length === 0) {
		return "got no tokens";
	}

	const codeToken = tokens.shift(1); 
	if (codeToken.kind === TKind.number) {
		form["code"].value = Number(codeToken.text);

		const sepToken = tokens.shift(1);
		if (sepToken.text !== "-") {
			return `expected '-' but got '${sepToken.text}'`;
		}
	}

	let words = [];
	while (true) {
		const token = tokens.shift(1);
		if (token === undefined) {
			return "run out of token";
		}
		if (token.text === "-") {
			break;
		}
		words.push(token.text);
	}

	const priceToken = tokens.shift(1);
	if (priceToken.kind !== TKind.number) {
		return `expected price but got '${priceToken.text}'`;
	}

	let repeat = 2;
	if (tokens.length > 0) {
		token = tokens.shift(1);
		if (token.text === "SOMENTE") {
			repeat = 1;
		}
	}

	let unit = "";
	let amount = 0;
	let checked = true;
	if (words.map(x => x.toUpperCase()).includes("KG")) {
		amount  = 1;
		unit    = "KG";
		checked = false;
	}

	for (let i = 0; i < words.length - 1; i++) {
		const n = words[i].replace(",", ".");
		const u = words[i + 1];

		if (Number.isNaN(Number(n))) {
			continue;
		}

		switch (u.toUpperCase()) {
			case "UN":
			case "KG":
			case "LT":
			case  "L":
				amount = Number(n);
				unit   = UnitFromString(u).toString().toUpperCase();
				break;
			case  "G":
			case "ML":
				amount = Number(n) / 1000;
				unit   = UnitFromString(u).toString().toUpperCase();
				break;
		}
	}

	form["repeat"].value   = repeat;
	form[  "desc"].value   = words.join(" ");
	form[  "code"].value   = Number(codeToken.text);
	form[ "price"].value   = Number(priceToken.text.replace(",", "."));
	form["packed"].checked = checked;
	form[  "unit"].value   = unit;
	form["amount"].value   = amount;

	return "";
}

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("test") === "true") {
	ID("text-area-for-load").value += "123 - Foo 1kg - 1,99\n";
	ID("text-area-for-load").value += "321 - Bar 200g - 10.99\n";
	ID("text-area-for-load").value += "6969 - Baz 1,5KG - 11,99\n";
	ID("text-area-for-load").value += "Lambda 10l - 11,99\n";
	ID("text-area-for-load").value += "420 - Foster KG - 69,96\n";
	ID("text-area-for-load").value += "1 - A really long description for no porpuse other than checking how it will looks in templates 0,100kg - 420,124\n";
	loadFormFromTextArea(
		ID("product-form"),
		ID("text-area-for-load")
	);
}
