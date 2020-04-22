const mongoose = require('mongoose');
module.exports = mongoose.model('Posts', {
    user: String,
    userId: String,
    profilePic: String,
    postUpload: String,
    caption: String,
    likes: [{ userId: String }],
    comments: [{userId: String, username: String, comment: String}],
    date: { type: Date, default: Date.now },
    tagged :[{userId:String, username:String}],
})