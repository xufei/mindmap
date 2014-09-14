angular.module("ng-charts").controller("PieController", ["$scope", function ($scope) {
	var total;
	var position = [];

	$scope.$watch("data", function() {
		total = 0;
		position = [];

		for (var i = 0; i < $scope.data.length; i++) {
			total += $scope.data[i].value;
			position.push(total);
		}
	}, true);

    $scope.width = function() {
    };

    $scope.height = function() {

    };

	$scope.pieClass = function (index) {
		return "series" + index;
	};

	$scope.chartTransform = function() {
		return "scale(1, -1) translate("
			+ ($scope.offsetX + $scope.radius)
			+ ", "
			+ (-$scope.offsetY - $scope.radius) + ")";
	};

	$scope.legendTransform = function() {
		return "translate(" + ($scope.offsetX + 2 * $scope.radius + 10) + ", 50)";
	};

	$scope.path = function (index) {
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

		var path = "M 0, 0 " + e1x + "," + e1y +
			"A" + rx + "," + ry + " 1 0,1 " + e2x + "," + e2y +
			"A" + rx + "," + ry + " 1 0,1 " + e3x + "," + e3y + "z";
		return path;
	};
}]);