var module = angular.module("dataCtrl", ['ui.bootstrap']);


module.controller("jsonDataCtrl", function($scope, $http) {

	$scope.countrySelected = null;
	$scope.paramSelected = null;
	$scope.countries = [];
	$scope.params = [];
	var checker = 0
	
	  //to make sure that the page loads after the file has been paesed.
	  $http.get('finalFile.json')
		.success(function(response)
		{
		});
	
	
	jQuery.get('finalFile.json', function(data) {
		
			
	 	$scope.jsonData = data;
		//console.log("$scope.jsonData: "+ $scope.jsonData)
	 	//var arr = JSON.parse(data);
	 	data[0]["ParamData"].forEach(function(item)
	 	{
	 		$scope.params.push(item["Indicator Name"]);
			

	 	});

		//console.log("$scope.params: " + $scope.params)
		
	 	data.forEach(function(item)
	 	{
	 		$scope.countries.push(item["Country Name"]);

	 	});
		
		//console.log("$scope.countries: " + $scope.countries)
		
	 });
	
	
	$scope.showChart = function(number){

		$scope.chartData = [];

		$scope.jsonData.forEach(function(item) {

			if(item["Country Name"] == $scope.countrySelected)
			{
				$scope.countryData = item;
			}
		});

		$scope.countryData["ParamData"].forEach(function(item) {

			if(item["Indicator Name"] == $scope.paramSelected)
			{
				$scope.paramData = item["YearEncoding"][0];
			}
		});

		
		for(key in $scope.paramData) {
		    if($scope.paramData.hasOwnProperty(key)) {
				
				//console.log("$scope.paramData[key]: " + $scope.paramData)
				
				if($scope.paramData[key] == null)
						$scope.chartData.push(0);
					else
						$scope.chartData.push($scope.paramData[key]);
				
		    }
		 }


		$scope.series = Object.keys($scope.paramData);
		
		var firstNull = true
		$scope.newSeries = []
		$scope.newChartData = []

		for( var i =0; i<$scope.chartData.length; i++)
		{
			if($scope.chartData[i]==0 && firstNull)
			{

				continue;
				
			}
			else if($scope.chartData[i]!=0)
			{
				firstNull = false
				$scope.newSeries.push($scope.series[i])
				$scope.newChartData.push($scope.chartData[i])
				
			}
			else
			{
				$scope.newSeries.push($scope.series[i])
				$scope.newChartData.push($scope.chartData[i])
			}
				
		}
		
		var checker_country = document.getElementById('country');
		var checker_parameter = document.getElementById('parameter');
		
		console.log("checker_country: " + checker_country)
		console.log("checker_parameter: " + checker_parameter)
		
		
		
		if( $scope.newSeries.length == 0)
		{
			console.log("checker: " + checker)
			if(checker == 1)
			{
				$("#container").empty()
			}
			$("#container").append("<br><p id=\"inner\" style=\"font-size:200%\">No Information to Display!</p>")
			checker = 1

		}
		else
		{
			if(number == 0)
			{
				checker = 1
				$('#container').highcharts({

							title: {
								text: $scope.paramSelected,
								x: -20 //center
							},
							subtitle: {
								text: 'For ' + $scope.countrySelected,
								x: -20
							},
							xAxis: {
								categories: $scope.newSeries
							},
							yAxis: {
								title: {
									text: $scope.paramSelected
								},
								plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
								}]
							},
							tooltip: {
								valueSuffix: ' %'
							},
							legend: {
								layout: 'vertical',
								align: 'right',
								verticalAlign: 'middle',
								borderWidth: 0
							},
							series: [{
								name: $scope.countrySelected,
								data: $scope.newChartData
							}]
				});
			}
			else
			{
				checker = 1
				$('#container').highcharts({
							chart: {
										type: 'column'
							},
							title: {
								text: $scope.paramSelected,
								x: -20 //center
							},
							subtitle: {
								text: 'For ' + $scope.countrySelected,
								x: -20
							},
							xAxis: {
								categories: $scope.newSeries
							},
							yAxis: {
								title: {
									text: $scope.paramSelected
								},
								plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
								}]
							},
							tooltip: {
								valueSuffix: ' %'
							},
							legend: {
								layout: 'vertical',
								align: 'right',
								verticalAlign: 'middle',
								borderWidth: 0
							},
							series: [{
								name: $scope.countrySelected,
								data: $scope.newChartData
							}]
				});
				
			}
		}
	};


});
