var myApp = angular.module('myApp',['ui.bootstrap']);

myApp.controller("jsonMapCtrl", function($scope, $http, $timeout, $interval) {

	$scope.yearSelected = null;
	$scope.paramSelected = null;
	$scope.countries = [];
	$scope.params = [];
	$scope.years = [];
	$scope.indicator = null;
	$scope.seriesData = undefined;
	var charts = [];
	var options = undefined;
	
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
		$('#info h3').html('');
		$('#country-chart').empty();
		if($scope.yearSelected != null && $scope.paramSelected != null)
		{
			$(".mapInfo").html('Shift + Click on countries to compare').show();	
			$(".mapInfo").css('background-color','lavender');		
		}
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
		 
		switch($scope.paramSelected)
		{
			case "Population density (people per sq. km of land area)":
				$scope.indicator = 'people per sq. km of land area';
				$scope.paramSelectedTrim = 'Population density'
				break;
			case "Population in largest city":
				$scope.indicator = 'Population in largest city';
				$scope.paramSelectedTrim = 'Population in largest city';
				break;
			case "Population in the largest city (% of urban population)":
				$scope.indicator = '(%) of urban population';
				$scope.paramSelectedTrim = 'Population in the largest city';
				break;
			case "Population in urban agglomerations of more than 1 million":
				$scope.indicator = 'Population in urban agglomerations';
				$scope.paramSelectedTrim = 'Population in urban agglomerations';
				break;
			case "Population in urban agglomerations of more than 1 million (% of total population)":
				$scope.indicator = '(%) of total population';
				$scope.paramSelectedTrim = 'Population in urban agglomerations';
				break;
			case "Pump price for diesel fuel (US$ per liter)":
				$scope.indicator = 'US$ per liter';
				$scope.paramSelectedTrim = 'Pump price for diesel fuel';
				break;
			case "Pump price for gasoline (US$ per liter)":
				$scope.indicator = 'US$ per liter';
				$scope.paramSelectedTrim = 'Pump price for gasoline';
				break;
			case "Improved water source, urban (% of urban population with access)":
				$scope.indicator = '(%) of urban population with access';
				$scope.paramSelectedTrim = 'Improved water source, urban';
				break;
			case "Improved sanitation facilities, urban (% of urban population with access)":
				$scope.indicator = '(%) of urban population with access';
				$scope.paramSelectedTrim = 'Improved sanitation facilities, urban';
				break;
			case "Urban poverty gap at national poverty lines (%)":
				$scope.indicator = 'total (%)';
				$scope.paramSelectedTrim = 'Urban poverty gap at national poverty lines';
				break;
			case "Urban poverty headcount ratio at national poverty lines (% of urban population)":
				$scope.indicator = '% of urban population';
				$scope.paramSelectedTrim = 'Urban poverty headcount ratio at national poverty lines';
				break;
			case "Urban population growth (annual %)":
				$scope.indicator = 'annual (%)';
				$scope.paramSelectedTrim = 'Urban population growth';
				break;
			case "Urban population":
				$scope.indicator = 'Urban population';
				$scope.paramSelectedTrim = 'Urban population';
				break;
			case "Urban population (% of total)":
				$scope.indicator = '(%) of total';
				$scope.paramSelectedTrim = 'Urban population';
				break;
			default:
				$scope.indicator = 'Value';
		}
	 
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
			$scope.countryData = [];
			$scope.paramData = [];
			$scope.testSeriesName = [];
			$scope.testSeriesData = [];

            if ($scope.points.length) 
			{
                $(".zoomleg").html('The graphs are zoomable. Select the area to be zoomed in by click and drag of the mouse.').show();
                $(".zoomleg").css('background-color','lavender');	
                $('#info0 .subheader0').html('<span class="subheading"><small><em>Shift + Click on map to compare countries</em></small></span>');

				for(var i =0; i < $scope.points.length; i++)
				{
					$scope.jsonData.forEach(function(item) {

						if(item["Country Code"] == $scope.points[i]["code3"])
						{
							$scope.countryData.push(item);
						}
					});
				}
				
				var impParameter = ["Population density (people per sq. km of land area)","Population in largest city", "Population in the largest city (% of urban population)", "Population in urban agglomerations of more than 1 million", "Improved water source, urban (% of urban population with access)", "Urban population growth (annual %)", "Urban population", "Urban population (% of total)"];
				//make unselected parameter list 
				impParameter.forEach(function(item) {

					if(item != $scope.paramSelected)
						{
															
							$scope.testSeriesName.push(item);
						}
						
				});
				
				var extractData = function(countryData, paramSelected)
									{
										paramData = [];
										for(var i = 0; i < countryData.length; i++)
										{
											countryData[i]["ParamData"].forEach(function(item) {

											if(item["Indicator Name"] == paramSelected)
												{
													paramData.push(item["YearEncoding"][0]);
												}
											});
										}
										return paramData;
										
									}
				
				var prepareData = function(paramData, points)
				{
					$scope.chartData = [];
					
					
					for(var key in paramData)
						{	
							var temporary = [];
							var temp = paramData[key]
							for(var kk in temp)
							{
								if(temp[kk] == null)
										temporary.push(0);
									else
										temporary.push(temp[kk]);
								
							}
							$scope.chartData.push(temporary);
						}
						$scope.series = Object.keys(paramData[0]);
						$scope.seriesCategories = Object.keys(paramData[0]);
						
						var trueData = "[\n" + "\t{\n" + "\t\t\"name\": \"Parameters\"," + "\n" + "\t\t\"data\": [" + $scope.series + "]\n\t},"

						//preparing data for the graph
						for(var i = 0; i < points.length; i++)
						{
							if(points.length-i==1)
								trueData += "\n\t{\n" + "\t\t\"name\": \"" + points[i]["name"] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t}"
							else
								trueData += "\n\t{\n" + "\t\t\"name\": \"" + points[i]["name"] + "\",\n\t\t\"data\": [" + $scope.chartData[i] + "]\n\t},"
						}
						
						trueData += "\n]"
						var testData = JSON.parse(trueData);
										
						seriesData = [];
						for(var i = 0; i < testData.length; i++)
							{

								if(i==0)
									seriesCategories = testData[0]['data'];
								else
								{
									seriesData[i-1]=testData[(i)];
									
									
								}
							}
							return seriesData
				}
				
				$scope.paramData = extractData($scope.countryData, $scope.paramSelected)
				$scope.seriesData = prepareData($scope.paramData, $scope.points)
				
				 function syncExtremes(e) {
						var thisChart = this.chart;

						if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
							Highcharts.each(Highcharts.charts, function (chart) {
								if (chart !== thisChart) {
									if (chart.xAxis[0].setExtremes) { // It is null while updating
										chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
									}
								}
							});
						}
					}
				
				
				function syncTooltip(container, p) {
					var i = 0;
					
					for (; i < charts.length; i++) {
						var tooltipData = [];
						if (container.id != charts[i].container.id) {
							if(charts[i].tooltip.shared) {
									for(var j = 0; j < charts[i].series.length; j++)
									{
										tooltipData.push(charts[i].series[j].data[p])
									}
									
									charts[i].tooltip.refresh(tooltipData);
									
							}
							else {
									charts[i].tooltip.refresh(tooltipData);
								
							}
						}
					}
				}
				
				function syncTooltipHide(container, p) {
					var i = 0;
					
					for (; i < charts.length; i++) {

						if (container.id != charts[i].container.id) {
							if(charts[i].tooltip.shared) {								
									charts[i].pointer.reset();
							}
							else {
									charts[i].pointer.reset();
							}
						}
					}
				}
				
				
				if ($scope.points.length === 1) {
					$('#info0').attr('class', '');	
					$('#header0').html('');
				} else {
					$('#info0').attr('class', '');
					$('#header0').html('');

				}
				
				options = {
					plotOptions: {
						series: {
							point: {
								events: {
									mouseOver: function () {
										//for(var i = 0; i < this.series.length; i++)
										syncTooltip(this.series.chart.container, this.x - 1);
									},
									mouseOut: function() {
										syncTooltipHide(this.series.chart.container, this.x - 1);
									}
								}
							}
						}
					}
				};
				
				charts[0] = new Highcharts.Chart($.extend(true, {}, options, {
					colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
					chart:{
						renderTo: 'country-chart0',
						height: 250,
						spacingLeft: 0,
						zoomType: 'xy'
					},
					rangeSelector : {
						selected : 1
					},
					title: {
						text:"",
					},
					subtitle: {
						text: $scope.paramSelectedTrim,
						x: -15
					},
					xAxis: {
						crosshair: true,
						categories: $scope.years,
						reversed:false
					},
					yAxis: {
						
						title: {
							text:$scope.indicator
						},
						plotLines: [{
							value: 0,
							width: 1,
							color: '#808080'
						}]
					},
					tooltip: {
						shared:true
					},
					legend: {
						enabled:false
					},
					 // plotOptions: {
						// line: {
							// //stacking: 'normal',
							// dataLabels: {
								// enabled: false,
								// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
								// style: {
									// textShadow: '0 0 3px black'
								// }
								
							// },
							// marker: {
									// enabled: false
								// }
												
						// }
					// },
					series: $scope.seriesData
				}));
					
				//console.log($scope.seriesData);
				//making data for all other parameters
				for(var i =0; i < 6; i++)
				{
					switch($scope.testSeriesName[i])
					{
						case "Population density (people per sq. km of land area)":
							$scope.paramData = extractData($scope.countryData, "Population density (people per sq. km of land area)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'people per sq. km of land';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Population density',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true

									},
									legend: {
										enabled:false

									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
											
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Population in largest city":
							$scope.paramData = extractData($scope.countryData, "Population in largest city");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'Population in largest city';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Population in largest city',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true

									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Population in the largest city (% of urban population)":
							$scope.paramData = extractData($scope.countryData, "Population in the largest city (% of urban population)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '(%) of urban population';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Population in the largest city',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Population in urban agglomerations of more than 1 million":
							$scope.paramData = extractData($scope.countryData, "Population in urban agglomerations of more than 1 million");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'Population in urban agglomerations';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Population in urban agglomerations',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false

									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Population in urban agglomerations of more than 1 million (% of total population)":
							$scope.paramData = extractData($scope.countryData, "Population in urban agglomerations of more than 1 million (% of total population)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '(%) of total population';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Population in urban agglomerations',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Pump price for diesel fuel (US$ per liter)":
							$scope.paramData = extractData($scope.countryData, "Pump price for diesel fuel (US$ per liter)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'US$ per liter';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Pump price for diesel fuel',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Pump price for gasoline (US$ per liter)":
							$scope.paramData = extractData($scope.countryData, "Pump price for gasoline (US$ per liter)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'US$ per liter';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Pump price for gasoline',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Improved water source, urban (% of urban population with access)":
							$scope.paramData = extractData($scope.countryData, "Improved water source, urban (% of urban population with access)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '(%) of urban population with access';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Improved water source',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Improved sanitation facilities, urban (% of urban population with access)":
							$scope.paramData = extractData($scope.countryData, "Improved sanitation facilities, urban (% of urban population with access)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '(%) of urban population with access';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Improved sanitation facilities',
										x: -15
									},
									xAxis: {
										//tickPixelInterval: 50,
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							break;
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
						case "Urban poverty gap at national poverty lines (%)":
							$scope.paramData = extractData($scope.countryData, "Urban poverty gap at national poverty lines (%)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'total (%)';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Urban poverty gap',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Urban poverty headcount ratio at national poverty lines (% of urban population)":
							$scope.paramData = extractData($scope.countryData, "Urban poverty headcount ratio at national poverty lines (% of urban population)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '% of urban population';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Urban poverty headcount ratio at national poverty lines',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Urban population growth (annual %)":
							$scope.paramData = extractData($scope.countryData, "Urban population growth (annual %)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'annual (%)';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Urban population growth',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Urban population":
							$scope.paramData = extractData($scope.countryData, "Urban population");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = 'Urban population';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
									colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
									chart:{
										renderTo: 'country-chart' + (i+1),
										height: 250,
										spacingLeft: 0,
										zoomType: 'xy'
									},
									rangeSelector : {
										selected : 1
									},
									title: {
										text:"",
									},
									subtitle: {
										text: 'Urban population',
										x: -15
									},
									xAxis: {
										crosshair: true,
										categories: $scope.years,
										reversed:false
									},
									yAxis: {
										
										title: {
											text:$scope.indicator
										},
										plotLines: [{
											value: 0,
											width: 1,
											color: '#808080'
										}]
									},
									tooltip: {
										shared:true
									},
									legend: {
										enabled:false
									},
									 // plotOptions: {
										// line: {
											// //stacking: 'normal',
											// dataLabels: {
												// enabled: false,
												// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
												// style: {
													// textShadow: '0 0 3px black'
												// }
												
											// },
											// marker: {
													// enabled: false
												// }
										
										// }
									// },
									series: $scope.seriesData
							}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						case "Urban population (% of total)":
							$scope.paramData = extractData($scope.countryData, "Urban population (% of total)");
							$scope.seriesData = prepareData($scope.paramData, $scope.points);
							$scope.indicator = '(%) of total';
							if($scope.points)
							{
								if ($scope.points.length === 1) {
									$('#info' + (i+1)).attr('class', '');	
									$('#header' + (i+1)).html('');
								} else {
									$('#info' + (i+1)).attr('class', '');
									$('#header' + (i+1)).html('');

								}
								charts[i+1] = new Highcharts.Chart($.extend(true, {}, options, {
										colors: ['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
										chart:{
											renderTo: 'country-chart' + (i+1),
											height: 250,
											spacingLeft: 0,
											zoomType: 'xy'
										},
										rangeSelector : {
											selected : 1
										},
										title: {
											text:"",
										},
										subtitle: {
											text: 'Urban population',
											x: -15
										},
										xAxis: {
											crosshair: true,
											categories: $scope.years,
											reversed:false
										},
										yAxis: {
											
											title: {
												text:$scope.indicator
											},
											plotLines: [{
												value: 0,
												width: 1,
												color: '#808080'
											}]
										},
										tooltip: {
											shared:true
										},
										legend: {
											enabled:false
										},
										 // plotOptions: {
											// line: {
												// //stacking: 'normal',
												// dataLabels: {
													// enabled: false,
													// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
													// style: {
														// textShadow: '0 0 3px black'
													// }
													
												// },
												// marker: {
														// enabled: false
													// }
											
											// }
										// },
										series: $scope.seriesData
								}));
							}
							else {
								$('#info' + (i+1)).attr('class', '');
								$('#info'+ (i+1)).html('');
								$('#header' + (i+1)).html('');
								$('#info'+ (i+1)).html('Click countries to view history');
								$('.subheader' + (i+1)).html('Click countries to view history');
								$('#country-chart' + (i+1)).empty();
							}
							break;
						default:
							$scope.indicator = 'Value';
						
					}
				}
					
			} 
			else {
				$('#info0').attr('class', '');
				$('#info1').attr('class', '');
				$('#info2').attr('class', '');
				$('#info').attr('class', '');
				$('#header0').html('');
				$('#header1').html('');
				$('#header2').html('');
				$('#header3').html('');
				$('#header4').html('');
				$('#header5').html('');
				$('#header6').html('');
				$('#header7').html('');
				$('#header8').html('');
				$('#header9').html('');
				$('#header10').html('');
				$('#header11').html('');
				$('#header12').html('');
				$('#header13').html('');				
				$('#subheader0').html('');
				$('#subheader1').html('');
				$('#subheader2').html('');
				$('#subheader3').html('');
				$('#subheader4').html('');
				$('#subheader5').html('');
				$('#subheader6').html('');
				$('#subheader7').html('');
				$('#subheader8').html('');
				$('#subheader9').html('');
				$('#subheader10').html('');
				$('#subheader11').html('');
				$('#subheader12').html('');
				$('#subheader13').html('');
				$('#country-chart0').empty()
				$('#country-chart1').empty()
				$('#country-chart2').empty()
				$('#country-chart3').empty()
				$('#country-chart4').empty()
				$('#country-chart5').empty()
				$('#country-chart6').empty()
				$('#country-chart7').empty()
				$('#country-chart8').empty()
				$('#country-chart9').empty()
				$('#country-chart10').empty()
				$('#country-chart11').empty()
				$('#country-chart12').empty()
				$('#country-chart13').empty()
				$(".mapInfo").html('Shift + Click on countries to compare').show();
				$(".mapInfo").css('background-color','lavender');	
			}



        });

        // Initiate the map chart
        mapChart = $('#container_map').highcharts('Map', {
			color: ['#e0f3db', '#a8ddb5', '#43a2ca'],
			title:{text:''},
            subtitle : {
                text : $scope.yearSelected +": " + $scope.paramSelected
            },
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
		        width: 650,
		        height: 320
		},

            // tooltip: {
            //     footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            // },

            series : [{
                data : $scope.trueData,
                mapData: mapData,
                joinBy: ['iso-a3', 'code3'],
                name: 'Click for more details',
				dataLabels: {
					enabled: true,
					formatter: function() {
						if(this.point.options["hide-name"])
							return;
						return this.point.name;
						}
				},
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

	 }
});