var User = require("../datasets/users");
var Upload = require('../datasets/posts');
var fs = require('fs-extra');
var path = require('path');

module.exports.postImage = function(req, res) {
    var upload = new Upload(req.body);
    upload.save();

    Upload.find({})
        .sort({ date: -1 })
        .exec(function(err, allPosts) {
            if (err) {
                res.error(err);
            } else {
                res.json(allPosts);
            }
        });
}

module.exports.getImage = function(req, res) {
    if (!req.body.following) {
        Upload.find({})
            .sort({ date: -1 })
            .exec(function(err, allPosts) {
                if (err) {
                    res.error(err);
                } else {
                    res.json(allPosts);
                }
            })
    } else {
        var requestedPosts = []
        for (var i = 0, len = req.body.following.length; i < len; i++) {
            requestedPosts.push({ userId: req.body.following[i].userId });
        }
        Upload.find({ $or: requestedPosts })
            .sort({ date: -1 })
            .exec(function(err, allPosts) {
                if (err) {
                    res.error(err)
                } else {
                    res.json(allPosts);
                }
            })

    }
}

module.exports.postActualImage = function(req, res) {
    var file = req.files.file;
    var userId = req.body.userId;

    // console.log('user ' + userId + ' is submitting ', file);
    // var uploadDate = new Date();
    var temp = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + userId + file.name);
    var savePath = "/uploads/" + userId + file.name;
    fs.rename(temp, targetPath, function(err) {
        if (err) {
            console.log(err);
        } else {
            User.findById(userId, function(err, userData) {
                var user = userData;
                user.postUpload = savePath;
                // console.log(user)
                user.save(function(err) {
                    if (err) {
                        console.log("failed save");
                        res.json({ status: 500 });
                    } else {
                        console.log("save successful");

                        res.json({ status: 200 });
                    }
                })
            });
        }

    })
}


module.exports.likePost = function(req, res) {
    var userId = req.body.userId;
    var postId = req.body.postId;
    // console.log(userId+ " is liking", postId);

    User.findById(userId, function(err, user) {
        user.likes.push({ postId: postId });
        user.save();
    })

    Upload.findById(postId, function(err, post) {
        post.likes.push({ userId: userId });
        post.save();
    })
}

module.exports.commentPost = function(req, res) {
    var userId = req.body.userId;
    var username = req.body.username;
    var postId = req.body.postId;
    var comment = req.body.comment;


    Upload.findById(postId, function(err, post) {
        post.comments.push({ userId: userId, username: username, comment: comment });
        post.save();
    })
}

module.exports.unLikePost = function(req, res) {
    var userId = req.body.userId;
    var postId = req.body.postId;

    // console.log("Unliking --- Post "+ postId + "// User "+ userId);

    User.findById(userId, function(err, user) {
        for (var i = 0, len = user.likes.length; i < len; i++) {
            if (user.likes[i].postId === postId) {
                user.likes.remove(user.likes[i]);
            }
        }
        user.save();

    })

    Upload.findById(postId, function(err, post) {
        for (var i = 0, len = post.likes.length; i < len; i++) {
            if (post.likes[i].userId === userId) {
                post.likes.remove(post.likes[i]);
            }
        }
        post.save();
    })

}

module.exports.deletePost = function(req, res) {
    var postId = req.body.postId;

    Upload.findByIdAndRemove(postId, function(err, post) {
        if (err) {
            res.send("Error deleting post");
        } else {
            res.json(post);
        }
    })

}

module.exports.updatePost = function(req, res) {
    var postId = req.body.postId;
    var caption = req.body.caption

    Upload.findById(postId, function(err, post) {
        var postData = post;
        postData.caption = caption;

        postData.save(function(err) {
            if (err) {
                console.log("fail");
                res.json({ status: 500 });
            } else {
                console.log("success");
                res.json({ status: 200 });
            }
        })
    })

}

module.exports.updatePostPic = function(req, res) {

    var file = req.files.file;
    var userId = req.body.userId;
    var postId = req.body.postId;
    console.log("User " + userId + " is updating pic  ", file);
    var uploadDate = new Date();

    var temp = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + userId + uploadDate + file.name);
    var savePath = "/uploads/" + userId + uploadDate + file.name;
    fs.rename(temp, targetPath, function(err) {
        if (err) {
            console.log(err);
        } else {
            Upload.findById(postId, function(err, postData) {
                var post = postData;
                post.postUpload = savePath;
                post.save(function(err) {
                    if (err) {
                        console.log("failed save");
                        res.json({ status: 500 });
                    } else {
                        console.log("save successful");
                        res.json({ status: 200, url: savePath });
                    }
                })
            });
        }

    })
}



module.exports.deleteComment = function(req, res) {
    console.log(req.body);
    var postId = req.body.postId;
    var commentId = req.body.commentId;
    console.log("HERE");
    console.log("Post " + postId + " Comment " + commentId);

    Upload.findById(postId, function(err, post) {
        for (var i = 0, len = post.comments.length; i < len; i++) {
            if (post.comments[i]._id == commentId) {
                post.comments.remove(post.comments[i]);
            }
        }
        post.save();
    })

}