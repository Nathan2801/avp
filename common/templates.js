const Template = (props) => ({
	name: props?.name ?? "",
	code: props?.code ?? "",
	platePerPage: props?.platePerPage ?? 10,
})

const defaultTemplate = Template({
	name: "Placa branca",
	code: `<div
		style="
		width: 50%;
		height: 20%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
		border: 1px solid black;
		"
		>
		<h2 style="max-width: 80%">
			<b>%desc%</b>
		</h2>
		<div>
			<b>%currency%</b>
			<h1 style="font-size: 64pt; display: inline">%price%</h1>
			<b>%unit%</b>
		</div>
		<div>
			<b>%unitDesc% R$%unitPrice%</b>
			<br>
			<b>cod. %code%</b>
		</div>
	</div>`,
})

const yellowTemplate = Template({
	name: "Placa Amarela",
	code: `<div
		style="
		width: 50%;
		height: 25%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
		border: 1px solid black;
		background: yellow;
		display;
		"
		>
		<h1 style="text-decoration: underline">OFERTA</h1>
		<h2 style="max-width: 80%">
			<b>%desc%</b>
		</h2>
		<div>
			<b>%currency%</b>
			<h1 style="font-size: 64pt; display: inline">%price%</h1>
			<b>%unit%</b>
		</div>
		<div>
			<b>%unitDesc% R$%unitPrice%</b>
			<br>
			<b>cod. %code%</b>
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
