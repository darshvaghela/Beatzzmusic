import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar'
import EmptyPlaylist from '../../static/empty-playlist.jpg'
import '../custom.css'
import * as  consts from '../../Constant'


export default function YourPlaylists(props) {
    const nav = useNavigate();
    const account = JSON.parse(localStorage.getItem("account"))
    const [userPlaylists, setUserPlaylists] = useState([]);

    const fetchuserPlaylists = async () => {
        let response = await fetch(`${consts.herokuUrl}playlist/fetchuserplaylists`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'token': account.token },
            }
        );
        response = await response.json();
        if (response.success) {
            setUserPlaylists(response.playlists)
        }
    }

    const handleOnClick = (p) => {
        nav('/viewplaylist', { state: { playlist: p } })
    }
    useEffect(() => {
        fetchuserPlaylists();
    }, [])
    return (
        <>

            <div className="container-fluid w-100 min-vh-100 bg-dark">
                <div className="row h-100">
                    <div className="col-2 p-0 h-100 position-fixed" style={{ backgroundColor: "black" }}>
                        <Sidebar currentSong={props.currentSong} />

                    </div>
                    <div className="col-10 offset-2 p-0 h-100">
                        <Navbar />
                        <div className="container text-light scrollbar-color" style={props.currentSong ? { height: '81vh', overflow: 'auto' } : { height: '92.48vh', overflow: 'auto' }}>
                            <div>
                                <h2 className="my-3">Your playlists</h2>
                                {userPlaylists.length == 0 &&
                                    <h5 className="my-4 text-muted">No playlists created !!</h5>
                                }
                                <div className="row row-cols-6 g-4 mb-3">
                                    {
                                        userPlaylists.map((p, index) => {
                                            return (
                                                <div className="col" key={p._id}>
                                                    <div className="card h-100 text-light mycard">
                                                        {p.songs[0] ?
                                                            <img src={p.songs[0].imageLink} className="card-img-top" onClick={() => handleOnClick(p)} />
                                                            :
                                                            <img src={EmptyPlaylist} className="card-img-top" onClick={() => handleOnClick(p)} />

                                                        }
                                                        <div className="card-footer h-25 d-flex justify-content-between">
                                                            <p className="card-title" >{p.playlistName}</p>

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
            </div>
        </>
    )
}
