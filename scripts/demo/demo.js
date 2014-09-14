angular.module("ng-charts").controller("DemoController", ["$scope", function ($scope) {
    $scope.width = 640;
    $scope.height = 480;

    $scope.offsetX = 0;
    $scope.offsetY = 0;

    $scope.gridX = 100;
    $scope.gridY = 40;
    $scope.columnWidth = 30;

    $scope.radius = 200;

    $scope.newValue = 1;

    $scope.data = [
        {title: "Test 1", value: 8},
        {title: "Test 2", value: 2},
        {title: "Test 3", value: 6},
        {title: "Test 4", value: 2},
        {title: "Test 5", value: 8}
    ];

    $scope.addItem = function() {
        $scope.data.push({
            title: "New " + $scope.data.length,
            value: $scope.newValue
        });
        $scope.newValue = 1;
    };
}]);