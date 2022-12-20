import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link } from 'react-router-dom';
import * as  consts from '../../Constant'

export default function Songs() {
    const nav = useNavigate();
    const [songsByGenre, setSongsByGenre] = useState(new Map())
    const [songs,setSongs] = useState([])
    const genres = ["Punjabi", "Bollywood", "Romance", "Indian-classical", "Holiday", "Netflix", "Party", "Instrumental", "Workout", "Rock", "Jazz", "Pop", "Hip-Hop and Rap"];
    const fetchSongs = async () => {
        let response = await fetch(`${consts.herokuUrl}song/fetchallsongs/${"all"}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            }
        );
        response = await response.json();

        if (response.success) {
            setSongs(response.songs)
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
            console.log(temp)
        }
        return response;
    }

    const handleDeleteClick = async (id) => {
        const account = JSON.parse(localStorage.getItem("account"))
        const song = songs.find(s => s._id === id);
        if(window.confirm(`Are you sure you want to delete "${song.songName}"?`)){

            let response = await fetch(`${consts.herokuUrl}song/deletesong`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'token':account.token},
                body: JSON.stringify({ id })
            }
            );
            response = await response.json();
            fetchSongs();
        }
    }

    const handleEditClick = (id) => {
        nav('/admin/editsong', { state: { id: id } })
    }

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem("account"))
        if (!account) {

            nav('/signin')
        }
        if (account && account.user.isAdmin === false) {
            nav('/')
        }
        fetchSongs();
    }, [])
    return (
        <>
            <div className="container">
                <h2 className="my-2">Songs</h2>
                <hr className="text-primary" />
                <Link to="/admin/addsong" >
                    <button className="btn btn-success  my-2 mx-auto">+ Add New Song</button>
                </Link>
                {
                    [...songsByGenre.keys()].map(g => {
                        if (songsByGenre.get(g).length != 0)
                            return (
                                <div className="accordion my-2" key={g}>
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
                                                            <th>Song</th>
                                                            <th>Artist</th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            songsByGenre.get(g).map((s, index) => {
                                                                return (
                                                                    <tr key={s._id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            {s.songName}
                                                                            {
                                                                                (s.movieName != "AlbumSong") ?
                                                                                    <span className="">&nbsp;(From "{s.movieName}")</span> : <span></span>

                                                                            }
                                                                        </td>
                                                                        <td>{s.singerName}</td>
                                                                        <td><button className="btn btn-link link-danger text-decoration-none p-0 btn shadow-none" onClick={() => handleDeleteClick(s._id)}>Delete</button></td>
                                                                        <td><button className="btn btn-link link-success text-decoration-none p-0 btn shadow-none" onClick={() => handleEditClick(s._id)}>Edit</button></td>

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
        </>
    )
}
