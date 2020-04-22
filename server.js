var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var authenticationController = require('./server/controllers/authentication-controller');
var profileController = require('./server/controllers/profile-controller');
var postController = require('./server/controllers/post-controller');
var usersController = require('./server/controllers/users-controller');
var activityController = require('./server/controllers/activities-controller');

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

require('dotenv').config()
mongoose.connect(process.env.MONGOLAB_ROSE_URI ||'mongodb://localHost:27017/Pennstagram');

app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/app', express.static(__dirname + "/app"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(__dirname + "/uploads"));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

// login,signup
app.post('/api/user/signup', authenticationController.signup);
app.post('/api/user/login', authenticationController.login);
app.get('/api/user/getToken', authenticationController.getToken);
app.post('/api/user/token', authenticationController.token);

// profile
app.post("/api/profile/editPhoto", multipartMiddleware, profileController.updatePhoto);
app.post("/api/profile/updateUsername", profileController.updateUsername);
app.post("/api/profile/updateBio", profileController.updateBio);

// user
app.get('/api/users/get', usersController.getUsers);
app.post('/api/users/follow', usersController.followUser);
app.post('/api/users/unfollow', usersController.unfollowUser);

// post
app.post('/api/post/post', postController.postImage);
app.post('/api/post/get', postController.getImage);
app.post('/api/upload/post', multipartMiddleware, postController.postActualImage);
app.post('/api/post/likes', postController.likePost);
app.post('/api/post/unlikes', postController.unLikePost);
app.post('/api/post/comment', postController.commentPost);
app.post('/api/post/delete', postController.deletePost);
app.post('/api/post/update', postController.updatePost);
app.post('/api/post/comment/delete', postController.deleteComment);
app.post("/api/post/updatePic", multipartMiddleware, postController.updatePostPic);

// activity
app.post('/api/activity/addact', activityController.addAct);
app.post('/api/activity/getacts', activityController.getAct);

var port = process.env.PORT || '3000';

app.listen(port, function() {
    console.log("Listening for LocalHost:3000")
});

module.exports = app;
