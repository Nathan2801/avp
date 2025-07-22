import { UN } from "./product.js";

const Template = (props) => ({
	name:  		  props?.name ?? "",
	code: 		  props?.code ?? "",
	platePerPage: props?.platePerPage ?? 10,
})

const br = () => {
	return document.createElement("br");
}

// Grand yellow plates propose to differs they font size
// for the product, brand and it's description, this list
// contains all known brands.
const brandList = [
	"avz",
	"description",
]

const A4_WIDTH  = 210
const A4_HEIGHT = 297

const mm = (n) => `${n}mm`

const debugColors = {
	index: 0,
	colors: [
		"#00000022",
		"#ff000022",
		"#00ff0022",
		"#0000ff22",
		"#ffff0022",
		"#00ffff22",
	],
	next() {
		const color = this.colors[this.index % this.colors.length];
		this.index += 1;
		return color;
	}
}

export const createA4Page = () => {
	const div = document.createElement("div");

	div.style.width  = mm(A4_WIDTH);
	div.style.height = mm(A4_HEIGHT);

	div.style.display  = "flex";
	div.style.flexWrap = "wrap";

	div.style.alignContent = "start";
	div.style.padding      = "1mm";

	return div;
}

const description = (props) => {
	const ss = [];

	if (props.packed) {
		ss.push("NESTA EMBALAGEM");
	}

	ss.push(props.unit === "UN" ? "A" : "O");
	ss.push(props.unit.toString());

	ss.push("SAI");
	ss.push(props.currency);

	ss.push(props.unitPrice);
	return ss.join(" ");
}

export const defaultTemplate = Template({
	name: "Placa branca",
	code: (props) => `<div style="
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
		<div style="max-width: 95%; height: 4em; font-size: 1.1em">
			<span>${props.desc}</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 1.5em;">${props.currency}</span>
			<span style="font-size: 5em; margin: 0 12px;">${props.price}</span>
			<span style="font-size: 1.5em;">${props.packed ? "UN" : props.unit}</span>
		</div>
		<div>
			<span>${description(props)}</span>
			<br>
			<span>cod. ${props.code}</span>
		</div>
	</div>`,
})
				

export const yellowTemplate = Template({
	name: "Placa amarela",
	code: (props) => `<div style="
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
		padding: 1mm;

		background: yellow;
	">
		<span style="
		 	font-size: 2em;
			text-decoration: underline;
			margin-bottom: 0.5em;
		">OFERTA</span>
		<div style="max-width: 95%; height: 4rem; font-size: 1.1em">
			<span>${props.desc}</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 1.5em;">${props.currency}</span>
			<span style="font-size: 5em; margin: 0 12px;">${props.price}</span>
			<span style="font-size: 1.5em;">${props.packed ? "UN" : props.unit}</span>
		</div>
		<div>
			<span>${description(props)}</span>
			<br>
			<span>cod. ${props.code}</span>
		</div>
	</div>`,
	platePerPage: 8,
})

// This code is complex but the behaviour of these
// plates are too specific so it's ok.
export const grandYellowTemplate = Template({
	name: "Placa amarela grande",
	// FIXME: Last printed paper is empty.
	code: (props) => {
		const plateE = document.createElement("div");

		plateE.style.width  = mm(A4_WIDTH);
		plateE.style.height = mm(A4_HEIGHT);

		plateE.style.fontWeight = "bolder";

		if (props.debug === true) {
			plateE.style.background = debugColors.next();
		}

		const containerE = document.createElement("div");
		plateE.appendChild(containerE);

		if (props.debug === true) {
			containerE.style.background = debugColors.next();
		} else {
			containerE.style.transform = "rotate(180deg)";
		}

		const contWidth  = 169 - 40;
		const contHeight = 153 - 25;

		containerE.style.width  = `${contWidth}mm`;
		containerE.style.height = `${contHeight}mm`;

		containerE.style.marginTop  = "25mm";
		containerE.style.marginLeft = "40mm";

		containerE.style.display = "flex";

		containerE.style.alignItems    = "center";
		containerE.style.flexDirection = "column";

		const descE = document.createElement("p");
		containerE.appendChild(descE);

		const descEHeight  = contHeight * 0.6;
		descE.style.height = `${descEHeight}mm`;

		if (props.debug === true) {
			descE.style.background = debugColors.next();
		}

		descE.style.fontSize  = "2rem";
		descE.style.textAlign = "center";

		const desc = props.desc.toUpperCase();

		let foundBrand = "";
		for (const brand of brandList) {
			const upperBrand = brand.toUpperCase();
			if (desc.includes(upperBrand)) {
				foundBrand = upperBrand;
			}
		}

		if (foundBrand === "") {
			descE.innerText = desc;
		} else {
			const [product, prodDesc] = desc.split(foundBrand);

			descE.innerHTML = `<div>
				<span>${product}</span><br>
				<span>${foundBrand}</span><br>
				<span>${prodDesc}</span>
			</div>`;
		}

		const priceE = document.createElement("p");
		containerE.appendChild(priceE);

		if (props.debug) {
			priceE.style.background = debugColors.next();
		}

		priceE.style.width  = "100%";
		priceE.style.height =  "30%";

		priceE.style.display = "flex";

		priceE.style.alignItems     = "end";
		priceE.style.justifyContent = "space-between";

		priceE.innerHTML =
			`<span>${props.currency}</span>` +
			`<span>${props.price}</span>`    +
			`<span>${props.unit}</span>`     ;

		priceE.children[0].style.fontSize     =  "2rem";
		priceE.children[1].style.fontSize     =  "8rem";
		priceE.children[1].style.marginBottom = "-2rem";
		priceE.children[2].style.fontSize     =  "2rem";

		const unitPrice = document.createElement("p");
		containerE.appendChild(unitPrice);

		if (props.debug === true) {
			unitPrice.style.background = debugColors.next();
		}

		unitPrice.innerText = description(props);

		unitPrice.style.fontSize = "1.25rem";
		unitPrice.style.margin   = "2rem 0rem 1rem 0rem";

		if (props.parent) {
			props.parent.appendChild(plateE);
		}

		if (props.parent && foundBrand !== "") {
			const contStyle = getComputedStyle(containerE);
			const descStyle = getComputedStyle(descE);

			const brandE = descE.children[0].children[2];

			let brandFontSize = 2;
			while (descStyle.getPropertyValue("width") <= contStyle.getPropertyValue("width")) {
				brandE.style.fontSize = `${brandFontSize}rem`;
				brandFontSize += 1;
			}

			brandE.style.fontSize = `max(2rem, ${brandFontSize - 2}rem)`;
			brandE.style.lineHeight = `max(2rem, ${brandFontSize - 2}rem)`;

			const prodE = descE.children[0].children[0];
			const descInnerE = getComputedStyle(descE.children[0]);

			let prodFontSize = 2;
			while (descInnerE.getPropertyValue("height") < descStyle.getPropertyValue("height")) {
				prodE.style.fontSize = `${prodFontSize}rem`;
				prodFontSize += 1;
			}

			prodE.style.fontSize = `max(2rem, ${prodFontSize - 2}rem)`;

			if (descInnerE.getPropertyValue("height") > descStyle.getPropertyValue("height")) {
				const prodDescE = descE.children[0].children[4];

				let prodDescFontSize = 2;
				while (descInnerE.getPropertyValue("height") > descStyle.getPropertyValue("height")) {
					prodDescE.style.fontSize = `${prodDescFontSize}rem`;
					prodDescFontSize -= 0.5;
				}

				prodDescE.style.fontSize = `${prodDescFontSize + 0.5}rem`;
			}

			return true;
		}

		return plateE;
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

	const result = template.code(props);

	switch (typeof(result)) {
		case "string":
			const tmp = document.createElement("div");
			tmp.innerHTML = result;
			return tmp.firstChild;
		case "boolean":
			return true;
		default:
			return result;
	}
}

export default {};
