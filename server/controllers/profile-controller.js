var User = require("../datasets/users");
var fs = require("fs-extra");
var path = require("path");

module.exports.updatePhoto = function(req, res) {
    var file = req.files.file;
    var userId = req.body.userId;
    console.log("User " + userId + " is submitting  ", file);
    var uploadDate = new Date();
    var temp = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + userId + uploadDate + file.name);
    var savePath = "/uploads/" + userId + uploadDate + file.name;
    fs.rename(temp, targetPath, function(err) {
        
        if (err) {
            console.log(err);
        } else {
            User.findById(userId, function(err, userData) {
                var user = userData;
                user.image = savePath;
                user.save(function(err) {
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
};

module.exports.updateUsername = function(req, res) {
    var username = req.body.username;
    var userId = req.body.userId;

    User.findById(userId, function(err, userData) {
        var user = userData;
        user.username = username;
        user.save(function(err) {
            if (err) {
                console.log("fail");
                res.json({ status: 500 });
            } else {
                console.log("success");
                res.json({ status: 200 });
            }
        })
    });
};

module.exports.updateBio = function(req, res) {
    var bio = req.body.bio;
    var userId = req.body.userId;
    console.log("UPDATING: "+ bio +"  "+ userId);

    User.findById(userId, function(err, userData) {
        var user = userData;
        user.bio = bio;

        user.save(function(err) {
            if (err) {
                console.log("fail");
                res.json({ status: 500 });
            } else {
                console.log("success");
                res.json({ status: 200 });
            }
        })
    });
};


// module.exports.getProfile = function(req,res){
//     var userId = req.body.userId;
//     User.find(userId, function(error, results) {
//         if (error) {
//             console.log("Error getting profile!");
//         }
//         console.log(results);
//         if (results) {
//             var userData = results[0];
//             res.json({
//                 email: userdata.email,
//                 username: userData.username,
//                 bio: userData.bio,
//                 image: userData.image
//             });
//         }
//     })
// }