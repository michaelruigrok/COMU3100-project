function showHidden(query) {
	document.querySelectorAll(query).forEach(function(e) {
		e.classList.add("fadeInRight", "animated");
	});
}

function addQListener(qName) {
	document.querySelectorAll("input[name='" + qName + "']")
		.forEach(e => e.addEventListener("click",
			e => showHidden("#" + qName + "_feedback")));
}

addQListener("commute-time");
addQListener("books");
