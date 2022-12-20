import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import './custom.css'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as  consts from '../Constant'

export default function Home(props) {
    const nav = useNavigate();
    const account = JSON.parse(localStorage.getItem("account"))
    const [songsByGenre, setSongsByGenre] = useState(new Map())
    const genres = ["Punjabi", "Bollywood", "Romance", "Indian-Classical", "Holiday", "Netflix", "Party", "Instrumental", "Workout", "Rock", "Jazz", "Pop", "Hip-Hop and Rap"];
    
    const [playlists, setPlaylists] = useState([])

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
                    if (response.songs[j].genre == genres[i] && count < 6) {
                        t.push(response.songs[j])
                        count++
                    }
                }
                temp.set(genres[i], t);
            }
            setSongsByGenre(temp)
        }
    }
    const fetchPlaylists = async () => {
        let response = await fetch(`${consts.herokuUrl}playlist/fetchadminplaylists/${"all"}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        );
        response = await response.json();
        if (response.success) {
            setPlaylists(response.playlists);
        }
    }

    const navigateWithId = (id) => {
        nav('/player', { state: { id: id } })
    }

    const navigateWithGenre = (genre) => {
        nav('/songs', { state: { genre: genre } })
    }

    const navigateWithPlaylist = (id) => {
        nav('/songs', { state: { playlistId: id } })

    }


    useEffect(() => {
        fetchSongs();
        fetchPlaylists();
    }, [])

    return (
        <>
            <div className="container-fluid w-100 bg-dark min-vh-100">
                <div className="row h-100">
                    <div className="col-2 p-0 h-100 position-fixed" style={{ backgroundColor: "black" }}>
                        <Sidebar currentSong={props.currentSong} />
                    </div>
                    <div className="col-10 p-0 offset-2 h-100">
                        <Navbar />
                        {/* Admin side playlist */}
                        <div className="scrollbar-color" style={props.currentSong ? {height : '81vh', overflow : 'auto'} : {height : '92.48vh', overflow: 'auto'}} >
                            {
                                playlists.map(p => {
                                    return (
                                        <>
                                            <div className="container" key={p._id}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h3 className="my-3 text-light">{p.playlistName}</h3>
                                                    <span onClick={() => navigateWithPlaylist(p._id)} className="hovereffect" style={{ letterSpacing: 1 }}>See All</span>
                                                </div>
                                                <div className="row row-cols-6 g-4 mb-4">
                                                    {
                                                        p.songs.map((s,index) => {
                                                            if(index<6)
                                                            return (
                                                                <div className="col" key={s._id}>
                                                                    <div className="card h-100 text-light mycard" onClick={() => navigateWithId(s._id)}>
                                                                        <img src={s.imageLink} className="card-img-top" />
                                                                        <div className="card-footer h-25">
                                                                            <p className="card-title" >{s.songName}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }

                            {/* Songs by genre */}
                            {
                                [...songsByGenre.keys()].map(g => {
                                    if (songsByGenre.get(g).length != 0)
                                        return (
                                            <>
                                                <div className="container" key={g.split(" ").join("-")}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h3 className="my-3 text-light">{g}</h3>
                                                        <span onClick={() => navigateWithGenre(g)} className="hovereffect" style={{ letterSpacing: 1 }}>See All</span>
                                                    </div>
                                                    <div className="row row-cols-6 g-4 mb-3">
                                                        {
                                                            songsByGenre.get(g).map((s) => {
                                                                return (
                                                                    <div className="col" key={s._id}>
                                                                        <div className="card h-100 text-light mycard" onClick={() => navigateWithId(s._id)}>
                                                                            <img src={s.imageLink} className="card-img-top" />
                                                                            <div className="card-footer h-25">
                                                                                <p className="card-title" >{s.songName}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>


            </div>

        </>
    )
}
