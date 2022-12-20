const express = require('express')
const authenticateuser = require('../middlewares/authenticateuser')
const Song = require('../models/Song')
const AdminPlaylist = require('../models/AdminPlaylist')
const UserPlaylist = require('../models/UserPlaylist')

const router = express.Router()

router.post('/createplaylistbyadmin', authenticateuser, async (req, res) => {
    try {
        await AdminPlaylist.create({ playlistName: req.body.playlistName, user: req.user.id, songs: req.body.selectedSongs });
        res.send({ success: true })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }

})

router.post('/createplaylistbyuser', authenticateuser, async (req, res) => {
    try {
        if (req.body.playlistId) {
            let playlist = await UserPlaylist.findOne({_id:req.body.playlistId})
            let song = playlist.songs.find(s => s == req.body.songId)

            if(song) {
                res.send({success: false, error:"Song already exists in playlist!!"})
            }
            else{
                await UserPlaylist.updateOne({ _id: req.body.playlistId }, {$push:{ songs: req.body.songId }})
                playlist = await UserPlaylist.findOne({_id : req.body.playlistId}).populate('songs')
                res.send({ success: true , playlist })
            }
        }
        else {
            let playlist = await UserPlaylist.create({ playlistName: req.body.playlistName, user: req.user.id, songs: [req.body.songId] });
            playlist = await UserPlaylist.findOne({_id : playlist._id}).populate('songs')
            res.send({ success: true, playlist })
        }
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }

})

router.get('/fetchadminplaylists/:id', async (req, res) => {
    let id = req.params.id

    try {
        let playlists;
        if (id !== "all") {
            playlists = await AdminPlaylist.find({ _id: id }).populate('songs');
        }
        else {
            playlists = await AdminPlaylist.find().populate('songs');
        }
        res.send({ success: true, playlists })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }
})
router.get('/fetchuserplaylists', authenticateuser, async (req, res) => {

    try {
        let playlists = await UserPlaylist.find({ user: req.user.id }).populate('songs');
        res.send({ success: true, playlists })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }
})
router.post('/editplaylist', authenticateuser, async (req, res) => {
    try {
        await AdminPlaylist.updateOne({ _id: req.body.playlistId }, { playlistName: req.body.playlistName, songs: req.body.selectedSongs });
        res.send({ success: true })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }

})
router.delete('/deleteadminplaylist', async (req, res) => {

    AdminPlaylist.deleteOne({ _id: req.body.id }).then((result) => {
        res.status(200).json(result)
    }).catch((err) => { console.warn(err) })
})


router.delete('/deleteuserplaylist', async (req, res) => {

    UserPlaylist.deleteOne({ _id: req.body.id }).then((result) => {
        res.status(200).json(result)
    }).catch((err) => { console.warn(err) })
})

router.post('/removesong', async (req, res) => {
    try{
        await UserPlaylist.updateOne({_id:req.body.playlistId},{$pull:{songs: req.body.songId}})
        let playlist = await UserPlaylist.findOne({_id:req.body.playlistId}).populate('songs')
        res.send({ success: true, playlist})
    }
    catch{
        ((err) => { console.warn(err) })
    }
})

module.exports = router;