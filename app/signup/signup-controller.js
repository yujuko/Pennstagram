(function() {
	angular.module('Pennstagram')
	.controller('SignupController',['$scope', '$state', '$http', function($scope, $state, $http){
  
		$scope.createUser = function(){
      if($scope.newUser == undefined){
        alert("Please fill up the information to sign up");
      }
      else if(checkUsername($scope.newUser.username) != "Pass"){
        alert(checkUsername($scope.newUser.username));
      }
      else if(checkEmail($scope.newUser.email) != "Pass" ){
        alert(checkEmail($scope.newUser.email));
      }
      else if(checkPassword($scope.newUser.password) != "Pass"){
        alert(checkPassword($scope.newUser.password));
      }
    	else{
      		$http({
    				method: 'post', 
    				url: 'api/user/signup',
    				data: $scope.newUser
    			}).then(function (response) {
            console.log(response.data._id);
            if(response.data._id == "User exists"){
              alert("User exists, please log in.")
            }
    				data = response.data;
            checkHttpStatus(response.status);
    				if(response.email == "Exist"){
    					alert("Email exists, log in or use a different one.");
    				}
            if(response.username == "Exist"){
              alert("Username exists, please use a new one.");
            }
            else{
              window.location.href = "/"
            }

    			},function (error){
    				alert(error);
    			});
        }

		}

    var checkUsername = function(username){
       var testUsername = /^\w+$/;
       if(username == undefined){
        return "Please enter your username "
       }
       if(!testUsername.test(username)){
        return "Username must contain only letters, numbers and underscores!"
       }
       else return "Pass";
    }

    var checkEmail = function(email){
      var testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(email.length == undefined){
        return "Please enter your email"
      }
      if(!testEmail.test(email)){
        return "Please enter a valid email"
      }
      else return "Pass";
    }

    var checkPassword = function(password){
      var testPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      if(password.length == undefined){
        return "Please enter your password "
       }
      if(!testPassword.test(password)){
        return "password must contain at least eight characters, one uppercase letter, one lowercase letter and one number!"
       }
      else return "Pass";
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
