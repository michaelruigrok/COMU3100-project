// DEBUG, to REMOVE! All sections will be shown.
function showAll() {
	document.querySelectorAll("body > *")
		.forEach(e => e.classList.remove("hidden"));
}

function showHidden(query, options) {
	document.querySelectorAll(query).forEach(function(e) {
		e.classList.add("fadeIn", "animated");
		e.classList.remove("hidden");
	});
}

function scrollToNext(jquery, options) {
	console.log(options);
	var options = options || {};
	var delay = options.delay !== undefined ?
		options.delay : 300;
	var offset = options.offset !== undefined ?
		options.offset : -($(window).height() / 22);
	$([document.documentElement, document.body]).delay(delay).animate({
		scrollTop: $(jquery).offset().top + offset
	}, 1000);
}

function addQListener(qName, options) {
	document.querySelectorAll("input[name='" + qName + "']")
		.forEach(function(input) {
			input.addEventListener("click", function(e) {
				var feedback = "#" + qName + "_feedback";
				showHidden(feedback);
				scrollToNext(feedback, options || {});
			});

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
addQListener("employment-type");
addQListener("commute-time", { offset: 0 });
addQListener("shopping-centres");
addQListener("close-friends-class");
addQListener("social-groups");
addQListener("galleries");
addQListener("books");
addQListener("shakespeare");

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
