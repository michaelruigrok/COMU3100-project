google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(underemployment);

function underemployment() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Employment Status');
	data.addColumn('number', 'Percentage');

	data.addRows([
		['Unemployment', 10.9],
		['Including Underemployment', 20.6],
	]);

	var options = {
		title: 'Unemployment vs Underemployment',
		vAxis: {
			title: 'Percent of Australians',
			maxValue: 30,
			minValue: 0,
		},
		/*
		chartArea: {
			backgroundColor: {
				fill: "#FFF",
				opacity: 50
			}
		},
		*/
		legend: {
			position: 'none'
		}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('unemployment_chart'));
	chart.draw(data, options);
}

/* Suburb general wealth */


var SuburbWealth = (function() {
	var ignoreWords = [
		"creek",
		"west",
		"north",
		"east",
		"south",
		"mount",
		"mt",
		"island",
		"upper",
		"point",
		"lake",
		"creek",
	];

	var missingSuburbs = {
		//Moreton Bay islands and localities:
		"Bulwer": ["Moreton"],
		"Buccan": ["Logan"],
		"Cowan Cowan": ["Moreton"],
		"Green Island": ["Moreton"],
		"Kooringal": ["Moreton"],
		"Mud Island": ["Moreton"],
		"St Helena Island": ["Moreton"],
		//Brisbane suburbs:
		"Anstead": ["Pullenvale", "Bellbowrie", "Barellan", "Karana"],
		"Archerfield": ["Rocklea", "Acacia", "Coopers"],
		"Banks Creek": ["Lowood", "Aguilar", "Nebo"],
		"Chandler": ["Belmont","Capalaba", "Burbank"],
		"Chuwar": ["Karana", "Karalee"],
		"Craigslea": ["Chermside"],
		"Ellen Grove": ["Carole"],
		"England Creek": ["Lowood", "Aguilar", "Nebo"],
		"Enoggera Reservoir": ["Nebo","Gap", "Brookfield", "Upper Kedron"],
		"Gaythorne": ["Mitchelton","Ennogera","Everton", "Alderly"],
		"Heathwood": ["Forest Lake","Pallara","Greenbank"],
		"Kalinga": ["Nundah","Clayfield","Wavell"],
		"Karawatha": ["Woodridge","Stretton","Drewvale","Kuraby"],
		"Kholo": ["Pullenvale","Karana","Karalee"],
		"Lake Manchester": ["Lowood", "Aguilar", "Nebo"],
		"Larapinta": ["Forest Lake","Pallara","Greenbank"],
		"Lytton": ["Wynnum","Pinkenba","Hemmant"],
		"Mackenzie": ["Wishart", "Mansfield", "Rochedale", "Burbank", "Carindale"],
		"Mt Coottha": ["Brookfield","Gap","Toowong","Kenmore","Bardon"],
		"Mt Coot tha": ["Brookfield","Gap","Toowong","Kenmore","Bardon"],
		"Mt Crosby": ["Karana","Karalee","Brookfield","Moggil"],
		"Mt Gravatt": ["Gravatt"],
		"Mt Gravatt East": ["Gravatt","Mansfield"],
		"Mt Ommaney": ["Ommaney"],
		"Nudgee Beach": ["Nudgee","Airport"],
		"Petrie Terrace": ["Milton","Kelvin","Paddington"],
		"Ransome": ["Thorneside","Wakerly","Lota"],
		"Stones Corner": ["Woolloongabba","Greenslopes","Cooparoo"],
		"Teneriffe": ["Fortitude Valley","Newstead","New Farm"],
		"Tennyson": ["Graceville","Rocklea","Moorooka"],
		"Upper Brookfield": ["Brookfield","Pullenvale","Moggil"],
		"Upper Mt Gravatt": ["Gravatt"],
		"Yeerongpilly": ["Graceville","Rocklea","Moorooka"],
		"Ferny Hills": ["Hills District"],
		"Arana Hills": ["Hills District"],
		"Everton Hills": ["Hills District"],
		"Bunya": ["Hills District"],
		"Maclean": ["Greenbank"],
		"Lyons": ["Greenbank"],
		// Ipswich
		"Carole Park": ["Camira"],
		"New Chum": ["Redbank", "Camira", "Bundamba"],
		"Booval": ["Ipswich"],
		"White Rock": ["Ripley"],
		"Spring Mountain": ["Ripley"],
		"Deebing Heights": ["Ripley"],
	}


	function clearTable(tableQuery) {
		var tbody = document.querySelector(tableQuery + " tbody");
		tbody.innerHTML = "";
	}

	function addTableRow(tableQuery, columns) {
		var tbody = document.querySelector(tableQuery + " tbody");
		var row = document.createElement("TR");
		columns.forEach(c => row.innerHTML += "<td>" + c + "</td>");
		tbody.appendChild(row);
	}

	function decileString(decile) {
		var pc = decile * 10;// per cent
		if (decile === "1") {
			return "In lowest 10%";
		} else if (decile === "10") {
			return "In highest 10%";
		} else {
			return "Between " + (pc - 10) + "% and " + pc + "%";
		}
	}

	function getMatchingSuburbs(suburbs, match) {
		var results = [];
		var regex = new RegExp("\\b(?:" + ignoreWords.join('|') + "|\\s)+\\b", "i");
		var terms = match
			.toLowerCase()
			.split(regex)
			.filter(s => s != "");

		// Check if suburb in missing list
		for (key in missingSuburbs) {
			if (match.toLowerCase() === key.toLowerCase()) {
				missingSuburbs[key].forEach(x =>
					results = results.concat(getMatchingSuburbs(suburbs, x))
				);
				return results;
			}
		}
		//results = suburbs.filter(s => s.Name in missingSuburbs);

		//if (results.length) {
			//results.forEach(r => 
		//}

		return suburbs.filter(x => x["Name"].toLowerCase().includes(match.toLowerCase()));
	}

	d3.csv("data/seifa-qld-2016.csv").then(function(data) {

		document.querySelector("#suburb-wealth input")
			.addEventListener("input", function (e) {
				if (this.validity.patternMismatch) {
					this.setCustomValidity("Please enter a suburb name");
				} else {
					this.setCustomValidity("");
				}
			});

		document.querySelector("#suburb-wealth fieldset").disabled = false;
		document.querySelector("#suburb-wealth").onsubmit = function(e) {
			e.preventDefault(); // ensure page does not send data

			var input = document.querySelector("#suburb-wealth input");
			var search = input.value;

			var punctuation = /[.,\/#@!$%\^&\*;:{}=\-_`~()]/g;
			search = search.replace(punctuation, "");
			console.log(search);

			clearTable("#suburb-wealth-results");
			var suburbs = getMatchingSuburbs(data, search);
			if (suburbs && suburbs.length === 0) {
				addTableRow("#suburb-wealth-results", ["No data found"]);
			} else {
				suburbs.forEach(x => 
					addTableRow("#suburb-wealth-results",
						[x.Name, decileString(x["Overall decile position"])]));
			}

			return false; // ensure page does not send data
		}
	});
})();
