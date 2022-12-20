import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { BrowserRouter as Router, useNavigate, useLocation, Switch, Route, Link } from 'react-router-dom';
import * as  consts from '../../Constant'

export default function CreatePlaylist() {
    const location = useLocation();
    const nav = useNavigate();
    const account = JSON.parse(localStorage.getItem("account"))
    
    const genres = ["Punjabi", "Bollywood", "Romance", "Indian-classical", "Holiday", "Netflix", "Party", "Instrumental", "Workout", "Rock", "Jazz", "Pop", "Hip-Hop and Rap"];
    const [songsByGenre, setSongsByGenre] = useState(new Map())
    
    const [selectedSongs, setSelectedSongs] = useState([])
    const [playlistName, setPlaylistName] = useState("")
    
    const [playlist, setPlaylist] = useState(location.state ? location.state.playlist : null)

    const fetchSongs = async () => {
        let response = await fetch(`${consts.herokuUrl}song/fetchallsongs/${"all"}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            }
        );
        response = await response.json();

        if (response.success) {
            let temp = new Map()
            for (let i = 0; i < genres.length; i++) {
                var count = 0;
                let t = []
                for (let j = 0; j < response.songs.length; j++) {
                    if (response.songs[j].genre == genres[i]) {
                        t.push(response.songs[j])

                    }
                }
                temp.set(genres[i], t);
            }
            setSongsByGenre(temp)
        }
        return response;
    }


    const handleOnChange = (event) => {
        if (event.target.name === 'playlistName')
            setPlaylistName(event.target.value)
        else {
            const temp = selectedSongs.find(e => e === event.target.value)
            if (!temp)
                setSelectedSongs([...selectedSongs, event.target.value])
            else
                setSelectedSongs((o) => {
                    return o.filter(e => e != event.target.value)
                })
        }

    }
    const handleOnClick = async () => {
        if (playlist) {
            let response = await fetch(`${consts.herokuUrl}playlist/editplaylist`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'token': account.token },
                    body: JSON.stringify({ playlistId: playlist._id, playlistName, selectedSongs })
                }
            );
            response = await response.json();
            if (response.success) {
                window.alert("playlist edited")
            }
        }
        else {

            let response = await fetch(`${consts.herokuUrl}playlist/createplaylistbyadmin`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'token': account.token },
                    body: JSON.stringify({ playlistName, selectedSongs })
                }
            );
            response = await response.json();
            if (response.success) {
                window.alert("playlist created")
            }
        }
        nav('/admin/playlists');
    }
    useEffect(() => {
        fetchSongs();
        if (playlist) {
            setPlaylistName(playlist.playlistName);
            let songs = [];
            for (let i of playlist.songs) {
                songs.push(i._id)
            }
            setSelectedSongs(songs);
        }
    }, [])
    return (
        <>
            <Navbar />
            <div className="container my-4">
                <h2> {playlist ? 'Edit playlist' : 'Create playlist'}</h2>
                <hr className="text-primary" />
                <div className="mb-3 d-flex align-items-center my-4">
                    <label htmlFor="playlist-name" className="fw-bold me-4">Playlist Name</label>
                    <input type="text" name="playlistName" id="playlist-name" className="form-control w-25" value={playlistName} onChange={handleOnChange} />
                </div>
                <div>
                    <label className="fw-bold mb-2">Select Songs</label>
                    {
                        [...songsByGenre.keys()].map(g => {
                            if (songsByGenre.get(g).length != 0)
                                return (
                                    <div className="accordion my-2 ms-2" key={g}>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button collapsed border border-secondary shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#${g.split(" ").join("-")}`} aria-expanded="false" aria-controls="flush-collapseOne">
                                                    {g}
                                                </button>
                                            </h2>
                                            <div id={g.split(" ").join("-")} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Song Name</th>
                                                                <th>Artist</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                songsByGenre.get(g).map((s, index) => {
                                                                    return (
                                                                        <tr key={s._id}>
                                                                            <td>{index + 1}</td>
                                                                            <td scope="row">{s.songName}</td>
                                                                            <td>{s.singerName}</td>
                                                                            <td>
                                                                                <div className="form-check">
                                                                                    <input className="form-check-input" type="checkbox" defaultChecked={selectedSongs.includes(s._id)} value={s._id} onChange={handleOnChange} />
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                        })
                    }
                </div>
                <button type="button" className="btn btn-primary my-3" onClick={handleOnClick}>
                    {playlist ? 'Save' : 'Create'}
                </button>
            </div>
        </>
    )
}
