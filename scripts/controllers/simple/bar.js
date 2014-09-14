angular.module("ng-charts").controller("BarController", ["$scope", function ($scope) {
    $scope.width = 640;
    $scope.height = 480;

    $scope.offsetX = 0;
    $scope.offsetY = 0;

    $scope.gridX = 100;
    $scope.gridY = 40;
    $scope.columnWidth = 30;

    $scope.barData = [
        {title: "Test 1", value: 8},
        {title: "Test 2", value: 2},
        {title: "Test 3", value: 6},
        {title: "Test 4", value: 2},
        {title: "Test 5", value: 8}
    ];

    var total;
    var position = [];

    $scope.$watch("barData", function() {
        total = 0;
        position = [];
    }, true);

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

    $scope.barClass = function(index) {
        return "series-areas-general series" + index;
    };

    $scope.x = function(index) {
        return $scope.gridX * index;
    };

    $scope.y = function(index) {
        return 0;
    };

    $scope.width = function(index) {
        return $scope.columnWidth;
    };

    $scope.height = function(index) {
        return $scope.gridY * $scope.barData[index].value;
    };
}]);