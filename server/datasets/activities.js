const mongoose = require('mongoose');
module.exports = mongoose.model('Activities', {
    userId: String,
    username : String,
    posterUsername: String,
    caption: String,
    description : String,
    date: { type: Date, default: Date.now }
})