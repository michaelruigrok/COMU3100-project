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
		legend: {
			position: 'none'
		}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('unemployment_chart'));
	chart.draw(data, options);
}

/* Suburb general wealth */
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
		return "In lowest 10% of wealth";
	} else if (decile === "10") {
		return "In highest 10% of wealth";
	} else {
		return "Between " + (pc - 10) + "% and " + pc + "% of wealth";
	}
}

d3.csv("/data/seifa-qld-2016.csv").then(function(data) {
	
	document.querySelector("#suburb-wealth")
	document.querySelector("#suburb-wealth").addEventListener(
		"submit", function(e) {
			e.preventDefault(); // ensure page does not send data
			e.target.disabled = false;

			var input = document.querySelector("#suburb-wealth input");
			if (input.value.length < 3) return false;

			clearTable("#suburb-wealth-results");
			var suburbs = data.filter(x => x["Name"].toUpperCase().includes(input.value.toUpperCase()));
			if (suburbs.length === 0) {
				addTableRow("#suburb-wealth-results", ["No data found"]);
			} else {
				suburbs.forEach(x => 
					addTableRow("#suburb-wealth-results",
						[x.Name, decileString(x["Overall decile position"])]));
			}

			return false; // ensure page does not send data
		});
});

