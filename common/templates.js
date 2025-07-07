const Template = (props) => ({
	name: props?.name ?? "",
	code: props?.code ?? "",
	platePerPage: props?.platePerPage ?? 10,
})

const createA4Page = () => {
	const div = document.createElement("div");
	div.style.width = "210mm";
	div.style.height = "297mm";
	div.style.display = "flex";
	div.style.flexWrap = "wrap";
	div.style.alignContent = "start";
	div.style.padding = "1mm";
	return div;
}

const defaultTemplate = Template({
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

const yellowTemplate = Template({
	name: "Placa amarela",
	code: `<div
		style="
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

const allTemplates = {
	[defaultTemplate.name]: defaultTemplate,
	[ yellowTemplate.name]:  yellowTemplate,
}

const useTemplate = (name, props) => {
	const template = allTemplates[name];
	if (template === null) {
		console.error("unknown template");
		return;
	}
	let templateString = template.code;
	for (const [prop, value] of Object.entries(props)) {
		templateString = templateString.replaceAll(`%${prop}%`, value);
	}
	return templateString;
}
