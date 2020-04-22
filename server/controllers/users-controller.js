var Users = require('../datasets/users');

module.exports.getUsers = function(req, res) {
    // console.log("GET TAGGING USERS")
    Users.find({}, function(err, usersData) {
        if (err) {
            res.error(err);
        } else {
            res.json(usersData);
        }
    })

}

module.exports.followUser = function(req, res) {
    var userId = req.body.userId;
    var posterId = req.body.posterId;

    console.log("following--- Poster " + posterId + "// Follower " + userId);
    Users.findById(posterId, function(err, poster) {
        poster.followers.push({ userId: userId });
        console.log(poster.followers);
        poster.save();
    })

    Users.findById(userId, function(err, follower) {
        follower.following.push({ userId: posterId });
        follower.save();
    })

}


module.exports.unfollowUser = function(req, res) {
    var userId = req.body.userId;
    var posterId = req.body.posterId;

    console.log("Unfollowing--- Poster " + posterId + "// Follower " + userId);

    Users.findById(posterId, function(err, poster) {
        for (var i = 0, len = poster.followers.length; i < len; i++) {
            console.log(poster.followers[i]);
            if (poster.followers[i].userId === userId) {
                console.log("FOUND1");
                poster.followers.remove(poster.followers[i]);
            }
        }
        poster.save();
    })

    Users.findById(userId, function(err, follower) {
        for (var i = 0, len = follower.following.length; i < len; i++) {
            
            if (follower.following[i].userId === posterId) {
                follower.following.remove(follower.following[i]);
                console.log("FOUND2");
            }
        }
        follower.save();
    })


}