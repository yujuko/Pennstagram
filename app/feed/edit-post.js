(function() {
    angular.module('Pennstagram')
        .controller('EditPostController', ["Upload", "$scope", "$state", "$http",
            function(Upload, $scope, $state, $http) {
                $scope.user = JSON.parse(localStorage["User-Data"]) || undefined;

                $scope.$watch(function() {
                    return $scope.file
                }, function() {
                    $scope.upload($scope.file);
                });

                $scope.upload = function(file) {

                    if (file) {
                        Upload.upload({
                            url: "api/profile/editPost",
                            method: "POST",
                            data: { userId: $scope.user.data._id },
                            file: file
                        }).progress(function(evt) {
                            console.log("firing");
                        }).success(function(data) {
                            console.log(data.url);
                            var users = JSON.parse(localStorage["User-Data"]);
                            users.data.image = data.url;
                            localStorage.setItem("User-Data", JSON.stringify(users)); 

                        }).error(function(error) {
                            console.log(error);
                        })
                    }
                };
                $scope.updateUsername = function() {
                    var users = JSON.parse(localStorage["User-Data"]);
                    console.log(users.data.username);
                    users.data.username = $scope.user.username;
                    localStorage.setItem("User-Data", JSON.stringify(users)); 

                    var request = {
                        userId: $scope.user.data._id,
                        username: $scope.user.username
                    }

                    $http({
                        method: 'post',
                        url: 'api/profile/updateUsername',
                        data: request
                    }).then(function(response) {
                        checkHttpStatus(response.status); 
                        console.log("update username success");
                    }, function(error) {
                        console.log(error, 'cannot post username.');
                    });
                };

                $scope.updateBio = function() {
                    var users = JSON.parse(localStorage["User-Data"]);
                    console.log(users.data.username);
                    users.data.bio = $scope.user.bio;
                    localStorage.setItem("User-Data", JSON.stringify(users)); 

                    var request = {
                        userId: $scope.user.data._id,
                        bio: $scope.user.bio
                    }

                    $http({
                        method: 'post',
                        url: 'api/profile/updateBio',
                        data: request
                    }).then(function(response) {
                        checkHttpStatus(response.status); 
                        console.log("update bio success");
                    }, function(error) {
                        console.log(error, 'cannot post bio.');
                    });

                }
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