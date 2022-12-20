import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate, Switch, Route, Link, useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import * as  consts from '../Constant'

export default function SongforGenre(props) {
    
    const nav = useNavigate();
    const location = useLocation();
    const account = JSON.parse(localStorage.getItem("account"))

    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState("");

    const fetchSongsByGenre = async () => {
        let response = await fetch(`${consts.herokuUrl}song/fetchallsongs/${location.state.genre}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        response = await response.json();
        if (response.success) {
            setSongs(response.songs)
            setTitle(location.state.genre)
        }
    }



    const fetchSongsByPlaylist = async () => {
        let response = await fetch(`${consts.herokuUrl}playlist/fetchadminplaylists/${location.state.playlistId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            }
        );
        response = await response.json();
        console.log(response);
        if (response.success) {
            setSongs(response.playlists[0].songs)
            setTitle(response.playlists[0].playlistName)
        }
    }

    const navigateWithId = (id) => {
        nav('/player', { state: { id: id } })
    }


    useEffect(() => {
        if (location.state.genre)
            fetchSongsByGenre();
        else
            fetchSongsByPlaylist();
    }, [])

    return (
        <>
            <div className="container-fluid w-100 bg-dark min-vh-100">

                <div className="row h-100">
                    <div className="col-2 p-0 h-100 position-fixed sidebar" style={{ "backgroundColor": "black" }}>
                        <Sidebar currentSong={props.currentSong}/>

                    </div>
                    <div className="col-10 offset-2 p-0 h-100 ">
                        <Navbar />
                        <div className="container" style={props.currentSong ? {height : '81vh', overflow : 'auto'} : {height : '92.48vh', overflow: 'auto'} }>
                            <h3 className="my-3 text-light">{title}</h3>
                            <div className="row row-cols-6 g-4 mb-3">
                                {
                                    songs.map((s) => {
                                        return (
                                            <div className="col">
                                                <div className="card h-100 mycard text-light" onClick={() => navigateWithId(s._id)}>
                                                    <img src={s.imageLink} className="card-img-top" />
                                                    <div className="card-footer h-25">
                                                        <p className="card-title">{s.songName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
