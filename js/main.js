function showHidden(query) {
	document.querySelectorAll(query).forEach(function(e) {
		e.classList.add("fadeIn", "animated");
		e.classList.remove("hidden");

		// Scroll to next section
		$([document.documentElement, document.body]).delay(300).animate({
			scrollTop: $(e).offset().top - $(window).height() / 20
		}, 1000);
	});
}

function addQListener(qName) {
	document.querySelectorAll("input[name='" + qName + "']")
		.forEach(function(input) {
			input.addEventListener("click",
				() => showHidden("#" + qName + "_feedback"));

			if (input.checked) showHidden("#" + qName + "_feedback");
		});
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


addQListener("three-class");
addQListener("commute-time");
addQListener("employment-type");
addQListener("books");



/* Scroll prevention */
$(function () {
    var scrollMin = function (selector) {
        var scrollY;
        scrollY = $(selector).offset().top;
        scrollY = Math.max(scrollY, 0);
        return scrollY;
    };
    var scrollMax = function (selector) {
        var scrollY;
        scrollY = $(selector).offset().top + $(selector).height() - $(window).height();
        scrollY = Math.min(scrollY, $(document).height() - $(window).height());
        scrollY = Math.max(scrollY, scrollMin(selector));
        return scrollY;
    };
    var selector = "#test";
    $(document).scrollTop(scrollMin(selector));
    $(document).on("scroll", function (e) {
        var windowScrollTop = $(window).scrollTop();
        if (windowScrollTop < scrollMin(selector)) {
            console.log("hit top");
            $(document).scrollTop(scrollMin(selector));
        } else if (windowScrollTop > scrollMax(selector)) {
            console.log("hit bottom");
            $(document).scrollTop(scrollMax(selector));
        }
    });
});
