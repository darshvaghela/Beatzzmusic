import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link } from 'react-router-dom';
import * as  consts from '../../Constant'

export default function Playlists() {
    const account = JSON.parse(localStorage.getItem("account"))
    const [playlists, setPlaylists] = useState([])
    const nav = useNavigate();

    const fetchPlaylists = async () => {
        let response = await fetch(`${consts.herokuUrl}playlist/fetchadminplaylists/${"all"}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
            }
        );
        response = await response.json();
        if (response.success) {
            setPlaylists(response.playlists);
        }
    }

    const handleEditClick = (p) => {
        nav('/admin/createplaylist', { state: { playlist: p }})
    }
    const handleDeleteClick = async (id) => {
        const playlist = playlists.find(p => p._id === id)
        if(window.confirm(`Are you sure you want to delete "${playlist.playlistName}"?`)) {

            let response = await fetch(`${consts.herokuUrl}playlist/deleteadminplaylist`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
            );
            response = await response.json();
            fetchPlaylists();
        }
        
    }
    useEffect(() => {
        if (!account) {

            nav('/signin')
        }
        if (account && account.user.isAdmin === false) {
            nav('/')
        }
        fetchPlaylists();
    }, [])
    return (
        <div>
            <div className="container">
                <h2 className="my-2">Playlists</h2>
                <hr />
                <Link to="/admin/createplaylist">
                    <button className="btn btn-success  my-2 mx-auto">+ Create PlayList</button>
                </Link>
            

                {
                    playlists.map(p => {
                        return (
                            <div className="accordion my-2" key={p._id}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed border border-secondary shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#${p.playlistName.split(" ").join("-")}`} aria-expanded="false" aria-controls="flush-collapseOne">
                                            {p.playlistName}
                                        </button>
                                    </h2>
                                    <div id={p.playlistName.split(" ").join("-")} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Song</th>
                                                        <th>Artist</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        p.songs.map((s, index) => {
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
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            <div className="my-2">
                                                <button type="button" className="btn btn-success me-4" onClick={() => {handleEditClick(p)}}>
                                                    Edit
                                                </button>
                                                <button type="button" className="btn btn-danger" onClick={() => {handleDeleteClick(p._id)}}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
