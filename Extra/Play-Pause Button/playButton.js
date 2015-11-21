var myApp = angular.module('myApp',['ui.bootstrap']);

myApp.controller('MyCtrl', function($scope, $timeout, $interval) {

  $scope.yearSelected = 1960;
  $scope.counter=2014-1960;
  $scope.inte=undefined;
  $scope.play = function () {
				
					
				$scope.inte = $interval(function(){
					if($scope.yearSelected == 2014)
						$scope.pause();
					else
					{
					  $timeout(function(){
						  $scope.yearSelected ++;
						  }, 100);  
					console.log($scope.yearSelected)				  
					}
				}, 600,$scope.counter);
			}
		
	$scope.pause = function () {
					$interval.cancel($scope.inte);
					console.log("$scope.yearSelected: " + $scope.yearSelected)
	}
});