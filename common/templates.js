const Template = (props) => ({
	name:  props.name  ?? "",
	code:  props.code  ?? "",
	style: props.style ?? "",
})

const loadCustomTemplates = () => {
	const templatesValue = localStorage.getItem("custom-templates") ?? "[]";
	const templates = JSON.parse(templatesValue);
	return templates;
}

const mapCustomTemplates = (fn) => {
	const templates = loadCustomTemplates();
	const newTemplatesValue = JSON.stringify(fn(templates));
	localStorage.setItem("custom-templates", newTemplatesValue);
}

const addTemplate = (form) => {
	mapCustomTemplates((templates) => {
		templates.push(Template({
			name:  form["name"].value,
			code:  form["code"].value,
			style: form["style"].value,
		}));
		return templates;
	});
}

const getTemplate = (name) => {
	for (const template of loadCustomTemplates()) {
		if (template.name == name) {
			return template;
		}
	}
	return null;
}

const defaultTemplate = Template({
	name: "Placa branca",
	code: `<div
		style="
		width: 100%;
		height: 100%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
		border: 1px solid black;
		display;
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
	style: "",
})

const createTemplatesInterface = ({ select }) => {
	const interface = {};
	const templates = loadCustomTemplates();
	templates.unshift(defaultTemplate);
	for (const template of templates) {
		interface[template.name] = (props) => {
			let templateString = template.code;
			for (const [prop, value] of Object.entries(props)) {
				templateString = templateString.replaceAll(`%${prop}%`, value);
			}
			return templateString;
		}
		if (select) {
			const option = document.createElement("option");
			option.value = template.name;
			option.innerText = template.name;
			select.appendChild(option);
		}
	}
	return interface;
}
