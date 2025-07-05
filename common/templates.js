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
		flex-direction: column;
		justify-content: space-around;
		border: 1px solid black;
		font-weight: bolder;
		padding: 1mm;
		">
		<div style="max-width: 95%; height: 4rem;">
			<span style="
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 16pt;
			">%desc%</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 14pt;">%currency%</span>
			<span style="font-size: 5em;">%price%</span>
			<span style="font-size: 14pt;">%unit%</span>
		</div>
		<div style="">
			<span style="font-size: 14pt;">%unitDesc% R$%unitPrice%</span>
			<br>
			<span style="font-size: 14pt;">cod. %code%</span>
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
		flex-direction: column;
		justify-content: space-around;
		border: 1px solid black;
		font-weight: bolder;
		background: yellow;
		padding: 1mm;
		">
		<span style="
		 	font-size: 24pt;
			text-decoration: underline;
			margin-bottom: 0.5em;
		">OFERTA</span>
		<div style="max-width: 95%; height: 4rem;">
			<span style="
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 16pt;
			">%desc%</span>
		</div>
		<div style="flex: 1;">
			<span style="font-size: 14pt;">%currency%</span>
			<span style="font-size: 5em;">%price%</span>
			<span style="font-size: 14pt;">%unit%</span>
		</div>
		<div style="">
			<span style="font-size: 14pt;">%unitDesc% R$%unitPrice%</span>
			<br>
			<span style="font-size: 14pt;">cod. %code%</span>
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
