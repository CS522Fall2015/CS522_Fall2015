var myApp = angular.module('myApp',['ui.bootstrap']);

myApp.directive('multiselectDropdown', [function() {
    return function(scope, jQueryElement, attributes) {
        
        jQueryElement = $(jQueryElement[0]); // Get the jQueryElement as a jQuery jQueryElement
        
        // Below setup the dropdown:
        
        jQueryElement.multiselect({
            buttonClass : 'btn btn-small',
            buttonWidth : '300px',
            buttonContainer : '<div class="btn-group" />',
            maxHeight : 400,
            enableFiltering : true,
            enableCaseInsensitiveFiltering: true,
            buttonText : function(options) {
                if (options.length == 0) {
                    return jQueryElement.data()['placeholder'] + ' <b class="caret"></b>';
                } else if (options.length > 1) {
                    return _.first(options).text 
                    + ' + ' + (options.length - 1)
                    + ' more selected <b class="caret"></b>';
                } else {
                    return _.first(options).text
                    + ' <b class="caret"></b>';
                }
            },
            // Replicate the native functionality on the jQueryElements so
            // that angular can handle the changes for us.
            onChange: function (optionjQueryElement, checked) {
                optionjQueryElement.removeAttr('selected');
                if (checked) {
                    optionjQueryElement.attr('selected', 'selected');
                }
                jQueryElement.change();
            }
            
        });
        // Watch for any changes to the length of our select jQueryElement
        scope.$watch(function () {

            return jQueryElement[0].length;
        }, function () {
            jQueryElement.multiselect('rebuild');
        });
        
        // Watch for any changes from outside the directive and refresh
        scope.$watch(attributes.ngModel, function () {
            jQueryElement.multiselect('refresh');
        });
    }
}]);

myApp.controller('MyCtrl', function($scope, $http) {

  $scope.countrySelected = [];
  $scope.paramSelected = null;
  $scope.countries = [];
  $scope.params = [];
  var checker = 0;
  $scope.seriesCategories= [];
  $scope.seriesData = [];

  //to make sure that the page loads after the file has been paesed.
  $http.get('js/finalFile.json')
    .success(function(response)
    {
    });


  //Read json file to extract country names and parameter names
  jQuery.get('js/finalFile.json', function(data) 
	{
		$scope.jsonData = data;

		data[0]["ParamData"].forEach(function(item)
		{
		  $scope.params.push(item["Indicator Name"]);
		  

		});
		
		data.forEach(function(item)
		{
		  $scope.countries.push(item["Country Name"]);

		});
				
	});


	$scope.showChart = function(number)
	{
		$scope.countryData = []
		$scope.paramData = []
		
		for(var i =0; i < $scope.countrySelected.length; i++)
		{
			$scope.jsonData.forEach(function(item) {

				if(item["Country Name"] == $scope.countrySelected[i])
				{
					$scope.countryData.push(item);
				}
			});
		}
		for(var i = 0; i < $scope.countryData.length; i++)
		{
			$scope.countryData[i]["ParamData"].forEach(function(item) {

			if(item["Indicator Name"] == $scope.paramSelected)
				{
					$scope.paramData.push(item["YearEncoding"][0]);
				}
			});
		}
		
	
		$scope.chartData = [];
		
		for(var key in $scope.paramData)
		{	
			var temporary = [];
			var temp = $scope.paramData[key]
			for(var kk in temp)
			{
				if(temp[kk] == null)
						temporary.push(0);
					else
						temporary.push(temp[kk]);
				
			}
			$scope.chartData.push(temporary);
		}
		
		$scope.series = Object.keys($scope.paramData[0]);
		$scope.seriesCategories = Object.keys($scope.paramData[0]);
		
		var trueData = "[\n" + "\t{\n" + "\t\t\"name\": \"Parameters\"," + "\n" + "\t\t\"data\": [" + $scope.series + "]\n\t},"

		//preparing data for the graph
		for(var i = 0; i < $scope.countrySelected.length; i++)
		{
			if($scope.countrySelected.length-i==1)
				trueData += "\n\t{\n" + "\t\t\"name\": \"" + $scope.countrySelected[i] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t}"
			else
				trueData += "\n\t{\n" + "\t\t\"name\": \"" + $scope.countrySelected[i] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t},"
		}
		
		trueData += "\n]"
		var testData = JSON.parse(trueData);
		
		$scope.seriesData = [];
		for(var i = 0; i < testData.length; i++)
			{

				if(i==0)
					$scope.seriesCategories = testData[0]['data'];
				else
				{
					$scope.seriesData[i-1]=testData[(i)];
					
					
				}
			}		 
		 if(number == 0)
		 {
			 $('#container').highcharts({
					chart: {
						type: 'column',
						zoomType: 'xy'
					},
					title: {
						text: 'Multi-Country Comparison',
						x: -20 //center
					},
					subtitle: {
						text: $scope.paramSelected,
						x: -20
					},
					   credits:{
				            	enabled:false
				            },
					xAxis: {
						categories: $scope.seriesCategories,
						title: {
									//text: null
								},
						min: 0
					},
					yAxis: {
						title: {
							text: $scope.paramSelected
						},
						plotLines: [{
							value: 0,
							width: 1,
							color: '#808080'
						}],
						min: 0
					},
					tooltip: {
						formatter: function() {
								return '<b>'+ this.series.name +'</b><br/>'+
								this.x +': '+ this.y;
						}
					},
					legend: {
						align: 'right',
						x: -30,
						verticalAlign: 'top',
						y: 25,
						//floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						shadow: true
					},
					 plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								enabled: false,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
								style: {
									textShadow: '0 0 3px black'
								}
							}
						}
					},
					series: $scope.seriesData
			});
		 }
		 else if(number == 1)
		 {
			 $('#container').highcharts({
					chart: {
						zoomType: 'xy'
					},
					title: {
						text: 'Test1 graph',
						x: -20 //center
					},
					subtitle: {
						text: $scope.paramSelected,
						x: -20
					},
					   credits:{
				            	enabled:false
				            },
					xAxis: {
						categories: $scope.seriesCategories,
						title: {
									//text: null
						},
						min: 0
					},
					yAxis: {
						title: {
							text: $scope.paramSelected
						},
						plotLines: [{
							value: 0,
							width: 1,
							color: '#808080'
						}],
						min: 0
					},
					tooltip: {
						formatter: function() {
								return '<b>'+ this.series.name +'</b><br/>'+
								this.x +': '+ this.y;
						}
					},
					legend: {
						align: 'right',
						x: -30,
						verticalAlign: 'top',
						y: 25,
						//floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						shadow: true
					},
					 plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								enabled: false,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
								style: {
									textShadow: '0 0 3px black'
								}
							}
						}
					},
					series: $scope.seriesData
			});
		 }
		 else if(number == 2)
		 {
			$('#container').highcharts({
					chart: {
						type: 'scatter',
						zoomType: 'xy'
					},
					title: {
						text: 'Test1 graph',
						x: -20 //center
					},
					subtitle: {
						text: $scope.paramSelected,
						x: -20
					},
					xAxis: {
						categories: $scope.seriesCategories
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
						formatter: function() {
								return '<b>'+ this.series.name +'</b><br/>'+
								this.x +': '+ this.y;
						}
					},
					legend: {
						align: 'right',
						x: -30,
						verticalAlign: 'top',
						y: 25,
						//floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						shadow: true
					},
					 plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								enabled: false,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
								style: {
									textShadow: '0 0 3px black'
								}
							}
						}
					},
					series: $scope.seriesData
			}); 
		 }
	}
	
	
	
 });

 
myApp.controller("jsonDataCtrl_single", function($scope, $http) {

	$scope.countrySelected_single = null;
	$scope.paramSelected_single = null;
	$scope.countries_single = [];
	$scope.params_single = [];
	var checker_single = 0
	
	  //to make sure that the page loads after the file has been paesed.
	  $http.get('js/finalFile.json')
		.success(function(response)
		{
		});
	
	
	jQuery.get('js/finalFile.json', function(data) {
		
			
	 	$scope.jsonData_single = data;

	 	data[0]["ParamData"].forEach(function(item)
	 	{
	 		$scope.params_single.push(item["Indicator Name"]);
			

	 	});

		
	 	data.forEach(function(item)
	 	{
	 		$scope.countries_single.push(item["Country Name"]);

	 	});
		
		
	 });
	
	
	$scope.showChart_single = function(number){

		$scope.chartData_single = [];

		$scope.jsonData_single.forEach(function(item) {

		if(item["Country Name"] == $scope.countrySelected_single)
			{
				$scope.countryData_single = item;
			}
		});

		$scope.countryData_single["ParamData"].forEach(function(item) {

			if(item["Indicator Name"] == $scope.paramSelected_single)
			{
				$scope.paramData_single = item["YearEncoding"][0];
			}
		});

		for(key in $scope.paramData_single) {
		    if($scope.paramData_single.hasOwnProperty(key)) {
				
				
				if($scope.paramData_single[key] == null)
						$scope.chartData_single.push(0);
					else
						$scope.chartData_single.push($scope.paramData_single[key]);
				
		    }
		 }


		$scope.series_single = Object.keys($scope.paramData_single);
		
		var firstNull = true
		$scope.newSeries_single = []
		$scope.newChartData_single = []

		for( var i =0; i<$scope.chartData_single.length; i++)
		{
			if($scope.chartData_single[i]==0 && firstNull)
			{

				continue;
				
			}
			else if($scope.chartData_single[i]!=0)
			{
				firstNull = false
				$scope.newSeries_single.push($scope.series_single[i])
				$scope.newChartData_single.push($scope.chartData_single[i])
				
			}
			else
			{
				$scope.newSeries_single.push($scope.series_single[i])
				$scope.newChartData_single.push($scope.chartData_single[i])
			}
				
		}
		
		var checker_single_country = document.getElementById('country');
		var checker_single_parameter = document.getElementById('parameter');
		
		
		if( $scope.newSeries_single.length == 0)
		{
			if(checker_single == 1)
			{
				$("#container_single").empty()
			}
			$("#container_single").append("<br><p id=\"inner\" style=\"font-size:200%\">No Information to Display!</p>")
			checker_single = 1

		}
		else
		{
			if(number == 0)
			{
				checker_single = 1
				$('#container_single').highcharts({
							chart: {
									zoomType: 'xy'
							},
							title: {
								text: $scope.paramSelected_single,
								x: -20 //center
							},
							subtitle: {
								text: 'For ' + $scope.countrySelected_single,
								x: -20
							},
							xAxis: {
								categories: $scope.newSeries_single,
								title: {
									//text: null
								},
								min: 0
							},
							yAxis: {
								title: {
									text: $scope.paramSelected_single
								},
								plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
								}],
								min: 0
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
								name: $scope.countrySelected_single,
								data: $scope.newChartData_single
							}]
				});
			}
			else
			{
				checker_single = 1
				$('#container_single').highcharts({
							chart: {
										type: 'column',
										zoomType: 'xy'
							},
							title: {
								text: $scope.paramSelected_single,
								x: -20 //center
							},
							subtitle: {
								text: 'For ' + $scope.countrySelected_single,
								x: -20
							},
							xAxis: {
								categories: $scope.newSeries_single,
								title: {
									//text: null
								},
								min: 0
							},
							yAxis: {
								title: {
									text: $scope.paramSelected_single
								},
								plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
								}],
								min: 0
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
								name: $scope.countrySelected_single,
								data: $scope.newChartData_single
							}]
				});
				
			}
		}
	};


});
