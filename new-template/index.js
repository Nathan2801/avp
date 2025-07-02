document
	.getElementById("new-template-form")
	.addEventListener("submit", (ev) => {
		ev.preventDefault();
		addTemplate(ev.target);
		const t = getTemplate("asdf");
		console.log(t);
	});
