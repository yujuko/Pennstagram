 (function() {
    angular.module('Pennstagram')
        .controller('ActivityController', ["$scope", "$state", "$http",
            function($scope, $state, $http) {
                $scope.user = JSON.parse(localStorage['User-Data']) || undefined;

                function getActs(init) {
                        var data = {};
                        if($scope.user){
                            data.following = angular.copy($scope.user.data.following);
                            data.following.push({userId : $scope.user.data._id});
                        }    

                        $http({
                            method: 'post',
                            url: '/api/activity/getacts',
                            data : data
                        }).then(function(response) {
                            checkHttpStatus(response.status);
                            if (init || !init) {
                                $scope.act = response.data;
                                // localStorage.setItem("Post", JSON.stringify(response.data)); 
                            }
                        }, function(error) {
                            console.log(error, 'bad.');
                        });

                    }

                    //init
                    getActs(true);
                var checkHttpStatus = function(status){
                    if(status == 304){
                      alert("Not Modified");
                    }
                    if(status == 400){
                      alert("Bad request");
                    }
                    if(status == 404){
                      alert("Not Found");
                    }
                    if(status == 500){
                      alert("Internal Server Error, please try later");
                    }
                }




        }
        ]);
}());