angular.module("ng-charts").controller("BarController", ["$scope", function ($scope) {
    $scope.axis = {
        x: [],
        y: []
    };

    $scope.$watch("data", function() {
        $scope.axis = {
            x: [],
            y: []
        };

        for (var i = 0; i <$scope.data.length; i++) {
            $scope.axis.x.push(i);
        }

        for (var i = 0; i < 10; i++) {
            $scope.axis.y.push(i);
        }
    }, true);

    $scope.chartTransform = function() {
        return "scale(1, -1) translate("
            + ($scope.offsetX)
            + ", "
            + (-$scope.offsetY - 350) + ")";
    };

    $scope.legendTransform = function() {
        return "translate(" + ($scope.gridX * $scope.data.length + 10) + ", 50)";
    };

    $scope.barClass = function (index) {
        return "series-areas-general series" + index;
    };

    $scope.x = function (index) {
        return $scope.gridX * index;
    };

    $scope.y = function (index) {
        return 0;
    };

    $scope.width = function (index) {
        return $scope.columnWidth;
    };

    $scope.height = function (index) {
        return $scope.gridY * $scope.data[index].value;
    };
}]);