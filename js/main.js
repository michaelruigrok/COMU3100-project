function showHidden(query) {
	document.querySelectorAll(query).forEach(function(e) {
		e.classList.add("fadeIn", "animated");
		e.classList.remove("hidden");
	});
}

function addQListener(qName) {
	document.querySelectorAll("input[name='" + qName + "']")
		.forEach(e => e.addEventListener("click",
			() => showHidden("#" + qName + "_feedback")));
}

document.querySelectorAll("form.three-class p")
	.forEach(e => e.addEventListener("click", function(e) {
		var input = e.target.querySelector("input");
		if (input) {
			input.checked = true;
			input.focus();
		}

		showHidden("#three-class_feedback");
	}));

addQListener("commute-time");
addQListener("books");
