var myApp = angular.module('myApp',['ui.bootstrap']);

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
			 $(".zoomable").show();	 
		 if(number == 0)
		 {
		
		 	$("#stackedBarChart").addClass('activeGraph');
		 	$("#lineChart").removeClass('activeGraph');
		 	$("#scatterPlot").removeClass('activeGraph');
			 $('#container').highcharts({
					colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
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
						//align: 'right',
						x: 0,
						//verticalAlign: 'top',
						y: 0,
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
		 

		 	$("#stackedBarChart").removeClass('activeGraph');
		 	$("#lineChart").addClass('activeGraph');
		 	$("#scatterPlot").removeClass('activeGraph');
			 $('#container').highcharts({
					colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
					chart: {
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
						//align: 'right',
						x: 0,
						//verticalAlign: 'top',
						y: 0,
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
		 

		 	$("#stackedBarChart").removeClass('activeGraph');
		 	$("#lineChart").removeClass('activeGraph');
		 	$("#scatterPlot").addClass('activeGraph');
			$('#container').highcharts({
					colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
					chart: {
						type: 'scatter',
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
						//align: 'right',
						x: 0,
						//verticalAlign: 'top',
						y: 0,
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
 		$(".zoomable").show();
		$scope.jsonData_single.forEach(function(item) {
		
		var checker = 0;
		
		if(item["Country Name"] == $scope.countrySelected_single)
			{
				checker = 1;
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
		
		if($scope.countrySelected_single === '')
		{
				$("#container_single").empty()
				$("#container_single").append("<br><p id=\"inner\" style=\"font-size:200%\">Please select a country!</p>")
		}
		else
		{			
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
					
					$("#lineChart_single").addClass('activeGraph');
	 				$("#barChart_single").removeClass('activeGraph');
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
									//align: 'right',
									//verticalAlign: 'middle',
									borderWidth: 0,
									x: 0,
									y: 0
								},
								series: [{
									name: $scope.countrySelected_single,
									data: $scope.newChartData_single
								}]
					});
				}
				else
				{
				
					$("#lineChart_single").removeClass('activeGraph');
	 				$("#barChart_single").addClass('activeGraph');
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
									//align: 'right',
									//verticalAlign: 'middle',
									borderWidth: 0,
									x: 0,
									y: 0
								},
								series: [{
									name: $scope.countrySelected_single,
									data: $scope.newChartData_single
								}]
					});
					
				}
			}
		}
	};


});


myApp.controller("jsonMapCtrl", function($scope, $http) {

	$scope.yearSelected = null;
	$scope.paramSelected = null;
	$scope.countries = [];
	$scope.params = [];
	$scope.years = [];
	$scope.seriesData = undefined;
	
	  //to make sure that the page loads after the file has been paesed.
	  $http.get('js/finalFile.json')
		.success(function(response)
		{
		});
	
	
	jQuery.get('js/finalFile.json', function(data) {
		
			
	 	$scope.jsonData = data;
		
	 	data[0]["ParamData"].forEach(function(item)
	 	{
	 		$scope.params.push(item["Indicator Name"]);
			

	 	});

		
	 	data.forEach(function(item)
	 	{
	 		$scope.countries.push(item["Country Name"]);

	 	});
		
		//get years
		data[0]["ParamData"].forEach(function(item)
	 	{
			if(item["Indicator Code"] == "EN.POP.DNST"){
				item["YearEncoding"].forEach(function(year){
					for(key in Object.keys(year))
					{
						$scope.years.push(Object.keys(year)[key]);
					}
					
				});
			}

	 	});
		
	 });
	 
	 $scope.createData = function(){
		 
		$('#info #flag').attr('class', '');
		$('#info h2').html('');
		$('#country-chart').empty();
		 
		 $scope.points = null;
		 var populateData = "[\n"
		 $scope.jsonData.forEach(function(data){
			 populateData += "\t{\n\t\t" ;
			 if(data["Country Code"] != 'AFG')
			 {
				 populateData += "\"code3\": \"" + data["Country Code"]+ "\",\n\t\t";
				 populateData += "\"name\": \"" + data["Country Name"] + "\",\n\t\t";
				 data["ParamData"].forEach(function(item){
					 if(item["Indicator Name"] == $scope.paramSelected)
					 {
						populateData += "\"param\": \"" + item["Indicator Name"] + "\",\n\t\t";
						item["YearEncoding"].forEach(function(year){
							for(key in Object.keys(year))
							{	
								if(Object.keys(year)[key] == $scope.yearSelected)
								{
									
									if(year[Object.keys(year)[key]] == null || year[Object.keys(year)[key]] <1)
									{
										populateData += "\"value\": " + 1 + ",\n\t\t";
									}
									else
									{
										populateData += "\"value\": " + year[Object.keys(year)[key]] + ",\n\t\t";
									}
									populateData += "\"year\": \"" + Object.keys(year)[key] + "\"\n\t},\n";
								}
							}
								
						})
						
					 } 
				 });
			 }
			 else
			 {
				 populateData += "\"code3\": \"" + data["Country Code"]+ "\",\n\t\t";
				 populateData += "\"name\": \"" + data["Country Name"] + "\",\n\t\t";
				 data["ParamData"].forEach(function(item){
					 if(item["Indicator Name"] == $scope.paramSelected)
					 {
						populateData += "\"param\": \"" + item["Indicator Name"] + "\",\n\t\t";
						item["YearEncoding"].forEach(function(year){
							for(key in Object.keys(year))
							{	
								if(Object.keys(year)[key] == $scope.yearSelected)
								{
									
									if(year[Object.keys(year)[key]] == null || year[Object.keys(year)[key]] <1)
									{
										populateData += "\"value\": " + 1 + ",\n\t\t";
									}
									else
									{
										populateData += "\"value\": " + year[Object.keys(year)[key]] + ",\n\t\t";
									}
									populateData += "\"year\": \"" + Object.keys(year)[key] + "\"\n\t}\n";
								}
							}
								
						})
						
					 } 
				 });

			 }
			 
		 });
		 populateData += '\n]';
		 
		 $scope.trueData = JSON.parse(populateData);
		 
		 var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
		$.each(mapData, function () {
            this.id = this.properties['hc-key']; // for Chart.get()
            this.flag = this.id.replace('UK', 'GB').toLowerCase();
        });

        // Wrap point.select to get to the total selected $scope.points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
			
            $scope.points = mapChart.getSelectedPoints();
			$scope.countryData = []
			$scope.paramData = []
            if ($scope.points.length) {
                if ($scope.points.length === 1) {
                    $('#info #flag').attr('class', 'flag ' + $scope.points[0].flag);
                    $('#info h2').html($scope.points[0].name);
                } else {
                    $('#info #flag').attr('class', 'flag');
                    $('#info h2').html('Multi-Country Comparison');

                }
                $('#info .subheader').html('<span class="subheading"><small><em>Shift + Click on map to compare countries</em></small></span>');

				for(var i =0; i < $scope.points.length; i++)
				{
					$scope.jsonData.forEach(function(item) {

						if(item["Country Code"] == $scope.points[i]["code3"])
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
				for(var i = 0; i < $scope.points.length; i++)
				{
					if($scope.points.length-i==1)
						trueData += "\n\t{\n" + "\t\t\"name\": \"" + $scope.points[i]["name"] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t}"
					else
						trueData += "\n\t{\n" + "\t\t\"name\": \"" + $scope.points[i]["name"] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t},"
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
				
				$('#country-chart').highcharts({
						colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
						chart:{
							height: 250,
                            spacingLeft: 0,
							zoomType: 'xy'
						},
						title: {
							//text: $scope.paramSelected,
							text:"",
							//x: -20 
						},
						xAxis: {
                            tickPixelInterval: 50,
                            crosshair: true
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
							x: 0,
							y: 0,
							backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
							borderColor: '#CCC',
							borderWidth: 1,
							shadow: true
						},
						 plotOptions: {
							line: {
								stacking: 'normal',
								dataLabels: {
									enabled: false,
									color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
									style: {
										textShadow: '0 0 3px black'
									}
									
								},
								marker: {
										enabled: false
									}
							
							}
						},
						series: $scope.seriesData
				});
				
            } else {
                $('#info #flag').attr('class', '');
                $('#info h2').html('');
                $('#info .subheader').html('Click countries to view history');
                $('#country-chart').empty();
            }



        });

        // Initiate the map chart
        mapChart = $('#container_map').highcharts('Map', {
			color: ['#e0f3db', '#a8ddb5', '#43a2ca'],
            title : {
                text : $scope.yearSelected +": " + $scope.paramSelected
            },

            // subtitle: {
            //     text: 'Year: ' + $scope.yearSelected
            // },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                //type: 'logarithmic',
                endOnTick: true,
                startOnTick: true,
                min: 0
            },
            chart: {
		        // Edit chart spacing
		        spacingBottom: 0,
		        spacingTop: 5,
		        spacingLeft: 1,
		        spacingRight: 0,

		        // Explicitly tell the width and height of a chart
		        width: null,
		        height: null
		},

            // tooltip: {
            //     footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            // },

            series : [{
                data : $scope.trueData,
                mapData: mapData,
                joinBy: ['iso-a3', 'code3'],
                name: 'Click for more details',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    select: {
                        color: '#a4edba',
                        borderColor: 'black',
                        dashStyle: 'shortdot'
                    }
                }
            }]
        }).highcharts();

		// $("#container_map").addClass('mapBorder');

		if($scope.paramSelected != null && $scope.yearSelected != null) 
			$('#info .subheader').html('Click countries to view history');
	 }


});