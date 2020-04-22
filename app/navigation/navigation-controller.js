(function() {
    angular.module('Pennstagram')
        .controller('NavigationController', ['$scope', '$state', '$http', function($scope, $state, $http) {

            if (localStorage['User-Data']) {
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            }
            $scope.loginUser = function() {
                    $http({
                        method: 'post',
                        url: 'api/user/login',
                        data: $scope.login
                    }).then(function(res) {
                        checkHttpStatus(res.status);
                        var response = res.data
                        if(response.login == false){
                            if(response.email == "Not exist"){
                                alert("User not exist, please sign up.");
                            }
                            else if(response.tried >= 5){
                                alert("You are locked out!")
                            }
                            else{
                                var num = 5-response.tried;
                                alert("Password incorrect, you will be locked out after "+ num + " incorrect password.")
                            }
                        }
                        else{
                            localStorage.setItem('User-Data', JSON.stringify(res));
                            localStorage.setItem('User-Token',randomStr());
                            $scope.loggedIn = true;
                            updateToken(response._id, localStorage.getItem('User-Token'));


                        }

                    }, function(error) {
                        console.log(error, 'cannot post data.');
                    });
            }

            $scope.logOut = function() {
                localStorage.clear();
                $scope.loggedIn = false;
            }
            
            var arr = '1234567890abcdefghijklmnopqrstuwzyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            function randomStr() { 
                var ans = ''; 
                for (var i = 20; i > 0; i--) { 
                    ans +=  
                      arr[Math.floor(Math.random() * arr.length)]; 
                } 
                return ans; 
            }

            function updateToken(id, token){
                 $http({
                        method: 'post',
                        url: 'api/user/token',
                        data: {userId: id, token : token}
                    }).then(function(res) {
                        console.log('token posted');
                    }, function(error) {
                        console.log(error, 'cannot post token.');
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

        }]);

}());
