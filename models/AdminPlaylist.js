const mongoose = require('mongoose');

const AdminPlaylistSchema = new mongoose.Schema({

    playlistName : {
        type: String,
        require: true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    songs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'songs'
    }]
})
module.exports = mongoose.model('adminPlaylists',AdminPlaylistSchema);