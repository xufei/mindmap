angular.module("ng-charts", []).controller("AnimateController", ["$scope", "$timeout", function ($scope, $timeout) {
    $scope.items1 = [];
    $scope.items2 = [];

    var counter = 0;

    var start1 = 160;
    var start2 = 180;

    function addItem() {
        var newItem1 = start1 + 10 * Math.random() - 5;
        var newItem2 = start2 + 12 * Math.random() - 6;

        start1 = newItem1;
        start2 = newItem2;

        if ($scope.items1.length > 500) {
            $scope.items1.splice(0, 1);
            $scope.items2.splice(0, 1);
        }

        $scope.items1.push(newItem1);
        $scope.items2.push(newItem2);

        $timeout(function () {
            addItem();
        }, 5);
    }

    addItem();

    $scope.path1 = function() {
        var path = "";

        for (var i=0; i<$scope.items1.length; i++) {
            path += i + "," + $scope.items1[i] + " ";
        }

        return path;
    };

    $scope.path2 = function() {
        var path = "";

        for (var i=0; i<$scope.items2.length; i++) {
            path += i + "," + $scope.items2[i] + " ";
        }

        return path;
    };
}]);