var Act = require("../datasets/activities");
var fs = require("fs-extra");
var path = require("path");

module.exports.addAct = function(req, res) {
    var act = new Act(req.body);
    act.save();
    res.json(req.body);
}

module.exports.getAct = function(req, res) {
    // console.log(req.body)
    if(!req.body.following){
    // Act.find({})
    //     .sort({ date: -1 })
    //     .exec(function(err, allActs) {
    //         if (err) {
    //             res.error(err);
    //         } else {
    //             res.json(allActs);
    //         }
    //     })
        }else{
            var requestedActs = []
            for (var i = 0, len = req.body.following.length ; i<len ; i++){
                requestedActs.push({userId : req.body.following[i].userId});
            }
            Act.find({$or : requestedActs})
            .sort({date : -1})
            .exec(function(err, allActs){
                if(err){
                    res.error(err)
                }else{
                    res.json(allActs);
                }
            })

    }
}