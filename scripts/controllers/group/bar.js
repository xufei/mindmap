angular.module("ng-charts").controller("BarController", ["$scope", function ($scope) {
	$scope.width = 640;
	$scope.height = 480;

	$scope.gridX = 100;
	$scope.gridY = 40;
	$scope.columnWidth = 30;

	$scope.groups = [
		[
			1,
			2,
			3,
			4,
			5],
		[
			5,
			3,
			8,
			2,
			7]
	];

	$scope.axis = {
		x: [],
		y: []
	};

	function init() {
		for (var i=0; i<5; i++) {
			$scope.axis.x.push(i);
		}

		for (var i=0; i<10; i++) {
			$scope.axis.y.push(i);
		}
	}

	init();

	$scope.columnClass = function(groupIndex, columnIndex) {
		return "series-areas-general series" + (groupIndex + 1);
	};

	$scope.x = function(groupIndex, columnIndex) {
		return $scope.gridX * columnIndex + $scope.columnWidth * groupIndex;
	};

	$scope.y = function(groupIndex, columnIndex) {
		return 0;
	};

	$scope.width = function(groupIndex, columnIndex) {
		return $scope.columnWidth;
	};

	$scope.height = function(groupIndex, columnIndex) {
		return $scope.gridY * $scope.groups[groupIndex][columnIndex];
	};
}]);