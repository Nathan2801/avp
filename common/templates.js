const Template = (props) => ({
	name:  		  props?.name ?? "",
	code: 		  props?.code ?? "",
	platePerPage: props?.platePerPage ?? 10,
})

export const createA4Page = () => {
	const div = document.createElement("div");

	div.style.width = "210mm";
	div.style.height = "297mm";

	div.style.display = "flex";
	div.style.flexWrap = "wrap";

	div.style.alignContent = "start";
	div.style.padding = "1mm";

	return div;
}

export const defaultTemplate = Template({
	name: "Placa branca",
	code: `<div
		style="
		width: 50%;
		height: 20%;
		display: flex;

		text-align: center;
		text-transform: uppercase;
		font-weight: bolder;

		align-items: center;
		flex-direction: column;
		justify-content: space-around;

		border: 1px solid black;
		padding: 1mm;
		">
		<div style="max-width: 95%; height: 4em;">
			<span>%desc%</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 1.5em;">%currency%</span>
			<span style="font-size: 5em; margin: 0 12px;">%price%</span>
			<span style="font-size: 1.5em;">%unit%</span>
		</div>
		<div>
			<span>%unitDesc% R$%unitPrice%</span>
			<br>
			<span>cod. %code%</span>
		</div>
	</div>`,
})

export const yellowTemplate = Template({
	name: "Placa amarela",
	code: `<div style="
		width: 50%;
		height: 25%;
		display: flex;

		text-align: center;
		text-transform: uppercase;
		font-weight: bolder;

		align-items: center;
		flex-direction: column;
		justify-content: space-around;

		border: 1px solid black;
		background: yellow;
		padding: 1mm;
	">
		<span style="
		 	font-size: 2em;
			text-decoration: underline;
			margin-bottom: 0.5em;
		">OFERTA</span>
		<div style="max-width: 95%; height: 3rem;">
			<span>%desc%</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 1.5em;">%currency%</span>
			<span style="font-size: 5em; margin: 0 12px;">%price%</span>
			<span style="font-size: 1.5em;">%unit%</span>
		</div>
		<div>
			<span>%unitDesc% R$%unitPrice%</span>
			<br>
			<span>cod. %code%</span>
		</div>
	</div>`,
	platePerPage: 8,
})

export const grandYellowTemplate = Template({
	name: "Placa amarela grande",
	code: (props) => {
		const plate = document.createElement("div");

		plate.style.width = "210mm";
		plate.style.height = "297mm";
		plate.style.fontWeight = "bolder";

		if (props.debug === true) {
			plate.style.background = "#00000022";
		}

		const container = document.createElement("div");
		plate.appendChild(container);

		if (props.debug === true) {
			container.style.background = "#ff000022";
		} else {
			container.style.transform = "rotate(180deg)";
		}

		container.style.width = `${169 - 40}mm`;
		container.style.height = `${153 - 25}mm`;

		container.style.marginTop = "25mm";
		container.style.marginLeft = "40mm";

		container.style.display = "flex";

		container.style.flexDirection = "column";
		container.style.alignItems = "center";

		const desc = document.createElement("p");
		container.appendChild(desc);

		if (props.debug === true) {
			desc.style.background = "#0000ff22";
		}

		desc.innerText = props.desc;
		desc.style.flex = "1";

		desc.style.fontSize = "2rem";
		desc.style.textAlign = "center";

		const price = document.createElement("p");
		container.appendChild(price);

		if (props.debug) {
			price.style.background = "#00ff0022";
		}

		price.style.width = "100%";
		price.style.display = "flex";

		price.style.alignItems = "end";
		price.style.justifyContent = "space-between";

		price.innerHTML =
			`<span>${props.currency}</span>`
			+ `<span>${props.price}</span>`
			+ `<span>${props.unit}</span>`;

		price.children[0].style.fontSize = "2rem";
		price.children[1].style.fontSize = "8rem";
		price.children[1].style.marginBottom = "-2rem";
		price.children[2].style.fontSize = "2rem";

		const unitPrice = document.createElement("p");
		container.appendChild(unitPrice);

		if (props.debug === true) {
			unitPrice.style.background = "#00ffff22";
		}

		unitPrice.innerText = `${props.unitDesc} ${props.currency}${props.unitPrice}`;
		unitPrice.style.fontSize = "1.25rem";
		unitPrice.style.margin = "2rem 0rem 1rem 0rem";

		return plate;
	},
	platePerPage: 1,
})

export const allTemplates = {
	[    defaultTemplate.name]: defaultTemplate,
	[     yellowTemplate.name]: yellowTemplate,
	[grandYellowTemplate.name]: grandYellowTemplate,
}

export const useTemplate = (name, props) => {
	const template = allTemplates[name];
	if (template === null) {
		console.error("unknown template");
		return;
	}
	if (typeof(template.code) === "string") {
		let templateString = template.code;
		for (const [prop, value] of Object.entries(props)) {
			templateString = templateString.replaceAll(`%${prop}%`, value);
		}
		const tmp = document.createElement("div");
		tmp.innerHTML = templateString;
		return tmp.firstChild;
	} else if (typeof(template.code) === "function") {
		return template.code(props);
	} else {
		console.error("Unable to use template");
		return null;
	}
}

export default {};
