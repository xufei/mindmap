angular.module("ng-charts").controller("BarController", ["$scope", "Chart", function ($scope, Chart) {
    var chart = new Chart();

    $scope.chart = chart;

    $scope.$watch("data", function(data) {
        chart.data = data;
        chart.numbers = [];

        for (var i=0; i<data.length; i++) {
            chart.numbers[i] = data[i].value;
        }

        chart.cartesian();
    }, true);

    /*
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
            + ($scope.offsetX + $scope.axisX)
            + ", "
            + (-$scope.offsetY - $scope.axisY) + ")";
    };

    $scope.legendTransform = function() {
        return "translate(" + ($scope.offsetX + $scope.axisX + $scope.gridX * $scope.data.length + 10) + ", 50)";
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
    */
}]);