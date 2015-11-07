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
  $http.get('finalFile.json')
    .success(function(response)
    {
    });


  //Read json file to extract country names and parameter names
  jQuery.get('finalFile.json', function(data) 
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
						type: 'column'
					},
					title: {
						text: 'Multi-Country Comparison',
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
		 else if(number == 1)
		 {
			 $('#container').highcharts({
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