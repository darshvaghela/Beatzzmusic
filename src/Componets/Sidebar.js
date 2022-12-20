import React from 'react'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link } from 'react-router-dom';
import Beatzz from '../static/Beatzz.jpg';

export default function Sidebar(props) {
    const account = JSON.parse(localStorage.getItem("account"))
    const nav = useNavigate();
    const handleOnClick = (path) => {
        if (account) {
            nav(path)
        }
        else {
            nav('/signin')
        }
    }

    const navigateWithId = (id) => {
        nav('/player', { state: { id: id } })
    }

    return (
        <div className="d-flex align-items-start flex-column h-100" style={{ zIndex: -1 }}>

            <div className="container">
                <div className="my-3">
                    <img src={Beatzz} className="mx-auto d-block" style={{ "width": "150px", "height": "70px" }} />
                </div>

                <div className="my-3">
                    <div className="mb-3">
                        <Link to="/" className="text-decoration-none text-light">
                            <i className="fa fa-home me-3" style={{ fontSize: "20px", color: "white" }}></i>
                            <span>Home</span>
                        </Link>
                    </div>
                    <div className="mb-3">
                        <Link to="/search" className="text-decoration-none text-light">
                            <i className="fa fa-search me-3" style={{ fontSize: "20px", color: "white" }}></i>
                            <span>Search</span>
                        </Link>
                    </div>
                    <div className="mb-4" onClick={() => handleOnClick('/yourplaylist')}>
                        <span className="text-decoration-none text-light" style={{cursor: 'pointer'}}>
                            <i className="fa fa-music me-3" style={{ fontSize: "20px", color: "white" }}></i>
                            <span>Your playlists</span>
                        </span>
                    </div>
                </div>
                {props.currentSong &&
                    <div>
                        <img src={props.currentSong.imageLink} className="w-100 mt-4" style={{ cursor: 'pointer' }} onClick={() => navigateWithId(props.currentSong._id)} />
                        <div className="d-flex justify-content-between mt-2 align-items-center">
                            <div>
                                <span className="text-light mt-4">{props.currentSong.songName}</span>
                            </div>
                            <div title="Add to playlist">
                                <span style={{ fontSize: "25px", color: "white", cursor: "pointer" }} onClick={() => handleOnClick('/createplaylist')}>+</span>
                            </div>

                        </div>
                        <span className="w-100" style={{ color: "#777777", fontSize: "14px" }}>{props.currentSong.singerName}</span>
                    </div>
                }
            </div>
        </div>
    )
}
