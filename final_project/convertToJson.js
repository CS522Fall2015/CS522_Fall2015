var module = angular.module("dataCtrl", ['ui.bootstrap']);


module.controller("jsonDataCtrl", function($scope, $http) {

	$scope.countrySelected = undefined;
	$scope.paramSelected = undefined;
	$scope.countries = [];
	$scope.params = [];

	jQuery.get('finalFile.json', function(data) {

	 	$scope.jsonData = data;

	 	//var arr = JSON.parse(data);
	 	data[0]["ParamData"].forEach(function(item)
	 	{
	 		$scope.params.push(item["Indicator Name"]);

	 	});


	 	data.forEach(function(item)
	 	{
	 		$scope.countries.push(item["Country Name"]);

	 	});
	 });


	$scope.showChart = function(){

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
		    	if($scope.paramData[key] == null)
		        	$scope.chartData.push(0);
		        else
		        	$scope.chartData.push($scope.paramData[key]);
		    }
		 }


		$scope.series = Object.keys($scope.paramData);
		console.log($scope.chartData);
		console.log($scope.series);


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
		            categories: $scope.series
		        },
		        yAxis: {
		            title: {
		                text: 'Percentage (%)'
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
		            data: $scope.chartData
		        }]
    });

	};


});
