angular.module("ng-charts").controller("RadarController", ["$scope", "Chart", function ($scope, Chart) {
    var chart = new Chart();

    $scope.chart = chart;

    $scope.$watch("data", function(data) {
        chart.data = data;
        chart.numbers = [];

        for (var i=0; i<data.length; i++) {
            chart.numbers[i] = data[i].value;
        }

        chart.radar();
    }, true);
}]);