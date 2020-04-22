(function() {
    angular.module('Pennstagram')
        .controller('FeedController', ['$scope', '$http', 'Upload',
            function($scope, $http, Upload) {


                if (localStorage['User-Data'] !== undefined) {

                    $scope.user = JSON.parse(localStorage['User-Data']) || undefined;

                    $scope.tagging = false;

                    $scope.tag = function(){
                        $scope.tagging = true;
                        $http({
                        method: 'get', 
                        url: 'api/users/get',
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            $scope.users = response.data;
                        },function (error){
                            console.log(error, 'cannot post data.');
                        });
                    }

                    $scope.postTag = function(){

                         
                            
                    }



                    $scope.$watch(function() {
                        return $scope.file
                    }, function() {
                        $scope.upload($scope.file);
                    });

                    $scope.upload = function(file) {
                        if (file) {
                            Upload.upload({
                                url: 'api/upload/post',
                                method: 'POST',
                                data: { userId: $scope.user.data._id },
                                file: file
                            }).success(function(data) {

                            }).error(function(error) {
                                console.log(error);
                            })
                        }

                    };

                $scope.editingPicture = false;
                $scope.editingCaption = false;
                $scope.editPic = function (postId){
                    $scope.editingPicture = true;
                    localStorage.setItem('User-editing',postId)
                }
                $scope.editCap = function (postId){
                    $scope.editingCaption = true;
                    localStorage.setItem('User-editing',postId)
                }

                $scope.updateUpload = function(file) {
                    var postId = localStorage.getItem('User-editing')|| undefined;;
                    console.log("EDITING: " + postId)
                    if (file) {
                        Upload.upload({
                            url: "api/post/updatePic",
                            method: "POST",
                            data: { userId: $scope.user.data._id ,
                                    postId: postId },
                            file: file
                        }).progress(function(evt) {
                            console.log("firing");
                        }).success(function(data) {
                            // console.log(data.url);
                            window.location.reload();
                             $scope.editingPicture = false;


                        }).error(function(error) {
                            console.log(error);
                        })
                    }
                };

                    if (localStorage['User-Data'] !== undefined) {
                        $scope.user = JSON.parse(localStorage['User-Data']);
                        console.log($scope.user.data);
                    }

                    $scope.postPic = function() {
                            var tagArr = [];
                            $scope.selectedList = {};
                            if($scope.users != undefined){
                                for(var i = 0; i < $scope.users.length ; i++){
                                    if($scope.users[i].selected == true){
                                        var selected = $scope.users[i];
                                        tagArr.push({userId:selected.id, username:selected.username} );
                                    }
                                }
                            }
                            var request = {
                                user: $scope.user.data.username || $scope.user.data.email,
                                userId: $scope.user.data._id,
                                profilePic: $scope.user.data.image,
                                postUpload: "/uploads/" + $scope.user.data._id + $scope.file.name,
                                caption: $scope.newPostUpload,
                                tagged: tagArr
                            }
                            console.log(request)

                            $http({
                                method: 'post',
                                url: 'api/post/post',
                                data: request
                            }).then(function(response) {
                                checkHttpStatus(response.status);
                                window.location.reload();
                                $scope.uploads = response.data;

                            }, function(error) {
                                console.log(error, 'bad.');
                            });
                        

                    };

                    $scope.postActivity = function(userId, username, posterUsername){
                    
                    actData = { 
                        username : username,
                        userId : userId, 
                        posterUsername :  $scope.newPostUpload,
                        caption : "posted",
                        }

                    $http({
                        method: 'post', 
                        url: '/api/activity/addact',
                        data: actData
                        }).then(function (response) {
                        checkHttpStatus(response.status);
                        console.log("adding post activity");
                    },function (error){
                        console.log(error, 'cannot post post activity.');
                    });
                }

                    function getPics(init) {
                        var data = {};
                        if($scope.user){
                            data.following = angular.copy($scope.user.data.following);
                            data.following.push({userId : $scope.user.data._id});
                        }    

                        $http({
                            method: 'post',
                            url: 'api/post/get',
                            data : data
                        }).then(function(response) {
                            checkHttpStatus(response.status);
                            if (init || !init) {
                                $scope.uploads = response.data;
                                // localStorage.setItem("Post", JSON.stringify(response.data)); 
                            }
                        }, function(error) {
                            console.log(error, 'bad.');
                        });

                    }

                    //init
                    getPics(true);

                $scope.commentPost = function (newComment, userId, username, postId){
                    
                        // var users = JSON.parse(localStorage["User-Data"]);
                        // console.log("before:"+ users.data.likes);
                        // users.data.likes.push({postId : postId});
                        // localStorage.setItem("User-Data", JSON.stringify(users)); 
                        // console.log("after:"+ users.data.likes);

                        console.log("commenting: "+ newComment);
                        $http({
                            method: 'POST', 
                            url: 'api/post/comment',
                            data: { userId : userId, 
                                username : username , 
                                postId : postId, 
                                comment : newComment }
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            console.log(userId+ "comments", postId);
                            window.location.reload();
                        },function (error){
                            console.log(error, 'cannot post comment.');
                        });
                    
               }
               $scope.commentActivity = function(comment, userId, username, posterUsername){
                    
                    actData = { 
                        username : username,
                        userId : userId, 
                        posterUsername : posterUsername,
                        description : comment,
                        caption : "commented",
                        }

                    $http({
                        method: 'post', 
                        url: '/api/activity/addact',
                        data: actData
                        }).then(function (response) {
                        checkHttpStatus(response.status);
                        console.log("adding like activity");
                    },function (error){
                        console.log(error, 'cannot post like activity.');
                    });
                }
                $scope.deleteComment = function (postId,commentId){
                    console.log($scope.user.data._id+ "is deleting comment",commentId, " on ", postId);
                        
                        $http({
                            method: 'post', 
                            url: 'api/post/comment/delete',
                            data: { postId : postId ,
                                    commentId : commentId}
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            window.location.reload();
                            console.log($scope.user.data._id+ "is deleting comment",commentId, " on ", postId);
                        },function (error){
                            console.log(error, 'cannot post delete comment.');
                        });
               }

               $scope.updatePost = function (editCaption, postId){
               // var caption = $scope.editCaption;
                        $http({
                            method: 'post', 
                            url: 'api/post/update',
                            data: { postId : postId,
                            caption : editCaption }
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            window.location.reload();
                            console.log($scope.user.data._id+ "is updating ", postId);
                        },function (error){
                            console.log(error, 'cannot post update.');
                        });
               }

                $scope.deletePost = function (postId){
                        alert('Are you sure you want to delete?');
                        $http({
                            method: 'post', 
                            url: 'api/post/delete',
                            data: { postId : postId }
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            window.location.reload();
                            console.log($scope.user.data._id+ "is deleting ", postId);
                        },function (error){
                            console.log(error, 'cannot post delete.');
                        });
               }

                $scope.likePost = function (userId, postId){
                        var users = JSON.parse(localStorage["User-Data"]);
                        console.log("before:"+ users.data.likes);
                        users.data.likes.push({postId : postId});
                        localStorage.setItem("User-Data", JSON.stringify(users)); 
                        console.log("after:"+ users.data.likes);

                        $http({
                            method: 'POST', 
                            url: 'api/post/likes',
                            data: { userId : userId, postId : postId }
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            console.log(userId+ "is liking 2", postId);
                        },function (error){
                            console.log(error, 'cannot post like.');
                        });
               }

               $scope.likeActivity = function(userId, username, posterUsername){
                    
                    actData = { 
                        username : username,
                        userId : userId, 
                        posterUsername :  posterUsername,
                        caption : "liked",
                        }

                    $http({
                        method: 'post', 
                        url: '/api/activity/addact',
                        data: actData
                        }).then(function (response) {
                        checkHttpStatus(response.status);
                        console.log("adding like activity");
                    },function (error){
                        console.log(error, 'cannot post like activity.');
                    });
                }
               $scope.unLikePost = function (userId, postId){

                    var users = JSON.parse(localStorage["User-Data"]);
                    for(var i = 0 , len = users.data.likes.length ; i<len ; i++){
                    if (users.data.likes[i].postId === postId){
                        console.log("found local!");
                        users.data.likes.splice(i,1);
                    }
                }
                localStorage.setItem("User-Data", JSON.stringify(users)); 
                request = { userId : userId,
                            postId : postId };

                        $http({
                            method: 'POST', 
                            url: 'api/post/unlikes',
                            data: { userId : userId, postId : postId }
                        }).then(function (response) {
                            checkHttpStatus(response.status);
                            console.log(userId+ "is unliking ", postId);
                        },function (error){
                            console.log(error, 'cannot post unlike.');
                        });
               }
               $scope.checkIsLiked = function(postId){
                for(var i = 0 , len = $scope.user.data.likes.length ; i<len ; i++){
                    if ($scope.user.data.likes[i].postId === postId){
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
            }
        ]);
}());