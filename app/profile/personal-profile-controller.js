
(function() {
    angular.module('Pennstagram')
        .controller('ProfileController', ["$scope", "$state", "$http",
            function($scope, $state) {
                $scope.user = JSON.parse(localStorage["User-Data"]) || undefined;
                console.log($scope.user.data);
                $scope.username = $scope.user.data.username;
                $scope.email = $scope.user.data.email;
                $scope.bio = $scope.user.data.bio;
                $scope.img = $scope.user.data.image;

            }
        ]);
}());