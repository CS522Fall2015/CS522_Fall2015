var module = angular.module("mapCtrl", ['ui.bootstrap']);

module.controller("jsonMapCtrl", function($scope, $http) {

	$scope.yearSelected = null;
	$scope.paramSelected = null;
	$scope.countries = [];
	$scope.params = [];
	$scope.years = [];
	$scope.seriesData = undefined;
	
	  //to make sure that the page loads after the file has been paesed.
	  $http.get('finalFile.json')
		.success(function(response)
		{
		});
	
	
	jQuery.get('finalFile.json', function(data) {
		
			
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
                    $('#info h2').html('Comparing countries');

                }
                $('#info .subheader').html('<h4>Historical population</h4><small><em>Shift + Click on map to compare countries</em></small>');

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
						chart:{
							zoomType: 'xy'
						},
						title: {
							text: 'History',
							x: -20 //center
						},
						subtitle: {
							text: $scope.paramSelected,
							x: -20
						},
						xAxis: {
							categories: $scope.seriesCategories,
							title: {
										text: null
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
				
            } else {
                $('#info #flag').attr('class', '');
                $('#info h2').html('');
                $('#info .subheader').html('Click countries to view history');
                
                $('#country-chart').empty();
				
            }



        });

        // Initiate the map chart
        mapChart = $('#container').highcharts('Map', {
			color: ['#e0f3db', '#a8ddb5', '#43a2ca'],
            title : {
                text : $scope.paramSelected
            },

            subtitle: {
                text: 'Year: ' + $scope.yearSelected
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

            tooltip: {
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            },

            series : [{
                data : $scope.trueData,
                mapData: mapData,
                joinBy: ['iso-a3', 'code3'],
                name: 'Current population',
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

        // Pre-select a country
        mapChart.get('us').select();
		 
	 }


});




