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
			title: 'Rating (scale of 1-10)',
			maxValue: 30,
			minValue: 0,
		}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('unemployment_chart'));
	chart.draw(data, options);
}
