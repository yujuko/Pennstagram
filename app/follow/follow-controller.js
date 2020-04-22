(function() {
    angular.module('Pennstagram')
        .controller('FollowController', ["$scope", "$state", "$http",
            function($scope, $state, $http) {
            
            $scope.user = JSON.parse(localStorage['User-Data']);
            console.log($scope.user);


            $http({
				method: 'get', 
				url: 'api/users/get',
			}).then(function (response) {
				console.log($scope.users);
                checkHttpStatus(response.status);
				$scope.users = response.data;
			},function (error){
				console.log(error, 'cannot post data.');
			});


            $scope.follow = function(userId, posterId){
            	var users = JSON.parse(localStorage["User-Data"]);
                console.log(users.data.following);
                users.data.following.push({userId : posterId});
                localStorage.setItem("User-Data", JSON.stringify(users)); 

            	request = { userId : userId,
            			 	posterId : posterId };
            	$http({
					method: 'post', 
					url: 'api/users/follow',
					data: request
				}).then(function (response) {
                    checkHttpStatus(response.status);
					console.log("following", posterId);
				},function (error){
					console.log(error, 'cannot post follow.');
				});

                
            }

            $scope.followActivity = function(userId, username, posterUsername){
                actData = { username : username,
                            userId : userId, 
                            posterUsername :  posterUsername,
                            caption : "started following",
                            }
                $http({
                    method: 'post', 
                    url: '/api/activity/addact',
                    data: actData
                }).then(function (response) {
                    checkHttpStatus(response.status);
                    console.log("adding activity");
                },function (error){
                    console.log(error, 'cannot post follow activity.');
                });
            }

            $scope.unfollow = function(userId, posterId){
            	var users = JSON.parse(localStorage["User-Data"]);
                for(var i = 0 , len = users.data.following.length ; i<len ; i++){
                        if (users.data.following[i].userId === posterId){
                            console.log("found local!");
                            users.data.following.splice(i,1);
                        }
                    }
                localStorage.setItem("User-Data", JSON.stringify(users)); 

            	request = { userId : userId,
            			 	posterId : posterId };
            	$http({
					method: 'post', 
					url: 'api/users/unfollow',
					data: request
				}).then(function (response) {

                    checkHttpStatus(response.status);
					console.log("unfollow", posterId);
				},function (error){
					console.log(error, 'cannot post unfollow.');
				});
            }

            $scope.checkIsFollowing = function(posterId){
            	for(var i = 0 , len = $scope.user.data.following.length ; i<len ; i++){
            		if ($scope.user.data.following[i].userId === posterId){
            			return true;
            		}
            	}
            	return false;

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