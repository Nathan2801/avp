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
