angular.module("ng-charts").controller("AnimateController", ["$scope", "$timeout", function ($scope, $timeout) {
    $scope.items = [];

    var counter = 0;

    function addItem() {
        var newItem = Math.ceil(100 * (1 + Math.sin((counter++) * Math.PI / 180)));

        if ($scope.items.length > 500) {
            $scope.items.splice(0, 1);
        }

        $scope.items.push(newItem);

        $timeout(function () {
            addItem();
        }, 10);
    }

    addItem();

    $scope.path = function() {
        var path = "";

        for (var i=0; i<$scope.items.length; i++) {
            path += 2*i + "," + $scope.items[i] + " ";
        }

        return path;
    };
}]);