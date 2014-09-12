angular.module("ng-charts").controller("PieController", ["$scope", function ($scope) {
	$scope.width = 640;
	$scope.height = 480;

	$scope.radius = 200;

	$scope.pieData = [
		{title: "Test 1", value: 8},
		{title: "Test 2", value: 2},
		{title: "Test 3", value: 6},
		{title: "Test 4", value: 2},
		{title: "Test 5", value: 8}
	];

	var total;
	var position = [];

	function init() {
		total = 0;
		position = [];

		for (var i = 0; i < $scope.pieData.length; i++) {
			total += $scope.pieData[i].value;
			position.push(total);
		}
	}

	init();

	$scope.pieClass = function (index) {
		return "series" + index;
	};

	$scope.path = function (index) {
		var x = 200;
		var y = 200;
		var rx = $scope.radius;
		var ry = $scope.radius;

		var start;
		if (index == 0) {
			start = 0;
		}
		else {
			start = 2 * Math.PI * position[index - 1] / total;
		}
		var stop = 2 * Math.PI * position[index] / total;

		var e1x = rx * Math.cos(start);
		var e1y = rx * Math.sin(start);
		var e2x;
		var e2y;
		var e3x;
		var e3y;

		if (stop - start < Math.PI) {
			e2x = ry * Math.cos(stop);
			e2y = ry * Math.sin(stop);
			e3x = e2x;
			e3y = e2y;
		} else {
			e2x = ry * Math.cos(Math.PI);
			e2y = ry * Math.sin(Math.PI);
			e3x = ry * Math.cos(stop);
			e3y = ry * Math.sin(stop);
		}

		var path = "M" + x + "," + y + " " + (x + e1x) + "," + (y + e1y) +
			"A" + rx + "," + ry + " 1 0,1 " + (x + e2x) + "," + (y + e2y) +
			"A" + rx + "," + ry + " 1 0,1 " + (x + e3x) + "," + (y + e3y) + "z";
		return path;
	};
}]);