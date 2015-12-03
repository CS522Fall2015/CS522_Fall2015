function motionChart()
{
	
	google.load("visualization", "1", {packages:["motionchart"], "callback":drawChart});
	google.setOnLoadCallback(drawChart);
	function drawChart(number) {
	var data = new google.visualization.DataTable();

	var arr = (function () {
		var json = null;
		$.ajax({
			'async': false,
			'global': false,
			'url': "/js/motionChart.json",
			'dataType': "json",
			'success': function (data) {
				json = data;
			}
		});
		return json;
	})(); 

	//console.log(arr)
	data.addColumn('string', 'Country Name');
	data.addColumn('number', 'Year');
	data.addColumn('number','Population density (people per sq. km of land area)')
	data.addColumn('number','Population in largest city')
	data.addColumn('number','Population in the largest city (% of urban population)')
	data.addColumn('number','Population in urban agglomerations of more than 1 million')
	data.addColumn('number','Population in urban agglomerations of more than 1 million (% of total population)')
	data.addColumn('number','Pump price for diesel fuel (US$ per liter)')
	data.addColumn('number','Pump price for gasoline (US$ per liter)')
	data.addColumn('number','Improved water source, urban (% of urban population with access)')
	data.addColumn('number','Improved sanitation facilities, urban (% of urban population with access)')
	data.addColumn('number','Urban poverty gap at national poverty lines (%)')
	data.addColumn('number','Urban poverty headcount ratio at national poverty lines (% of urban population)')
	data.addColumn('number','Urban population growth (annual %)')
	data.addColumn('number','Urban population')
	data.addColumn('number','Urban population (% of total)')
	data.addRows(arr);

	var chart = new google.visualization.MotionChart(document.getElementById('chart_div'));

	chart.draw(data, {width: 1000, height:520});
	}
}