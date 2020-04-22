var mongoose = require('mongoose');
var User = require('../datasets/users');

module.exports.signup = function(req, res) {
    // console.log(req.body);
    var user = new User(req.body);
    var email = req.body.email;

    User.find({email:email}, function(err, userData) {
        if(userData.length ==0){
            user.image = "https://i.stack.imgur.com/34AD2.jpg";
            user.save();
            res.json(req.body);
        }
        else{
            console.log("User Exist");
            res.json({_id: "User exists"});
        }
        
    });

    
}
module.exports.token = function(req, res) {
    var userId = req.body.userId;
    var token = req.body.token;

    User.findById(userId, function(err, userData) {
        var user = userData;
        user.secureToken = token;
        user.save(function(err) {
            if (err) {
                console.log("post token fail");
            } else {
                console.log("post token success");
            }
        })
    });
}
module.exports.getToken = function(req, res) {
    var userId = req.body.userId;
    
    User.findById(userId, function(err, usersData) {
        if (err) {
            res.error(err);
            console.log("get token fail");
        } else {
            res.json(usersData[0].secureToken);
        }
    })
}
module.exports.login = function(req, res) {
    console.log(req.body);

    User.find(req.body, function(error, results) {

            if (results.length == 0) {
                console.log("Error!");
                User.find({email: req.body.email}, function(err,userData){

                    if(userData.length !=0){
                        console.log("Wrong pw");
                        var userId = userData[0]._id;
                        var num = userData[0].loginSecurity+1
                        updateLoginSecurity(userId,num);
                        res.json({
                            login: false,
                            email: req.body.email,
                            tried: num
                        })
                    }
                    else{
                        console.log("No User");
                        res.json({
                            login: false,
                            email: "Not exist"
                        })
                    }
                })
            }
            else{
                var userData = results[0];
                if(userData.loginSecurity >= 5 ){
                    res.json({
                            login: false,
                            email: req.body.email,
                            tried: userData.loginSecurity
                    })
                }
                else{ 
                    updateLoginSecurity(userData._id,0);
                    res.json({
                        login: true,
                        email: req.body.email,
                        _id: userData._id,
                        username: userData.username,
                        image: userData.image,
                        following : userData.following,
                        followers : userData.followers,
                        likes : userData.likes
                    });        
                }

            }
    })
}

var updateLoginSecurity = function(userId,num) {
    User.findById(userId, function(err, userData) {
        var user = userData;
        user.loginSecurity = num;

        user.save(function(err) {
            if (err) {
                console.log("fail");
            } else {
                console.log("success");
            }
        })
    });

};

