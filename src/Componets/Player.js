import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate, Switch, Route, Link, useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import addtoplaylist from '../static/addtoplaylist-icon.jpg';
import * as  consts from '../Constant'

// import Equalizer from '../static/Equalizer.mp4'

import './custom.css';
import 'react-h5-audio-player/lib/styles.css';

export default function Player(props) {
    const location = useLocation();
    const [song, setSong] = useState(null)
    const account = JSON.parse(localStorage.getItem("account"))
    const nav = useNavigate();

    const fetchById = async () => {
        let response = await fetch(`${consts.herokuUrl}song/fetchbyid/${location.state.id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        response = await response.json();
        setSong(response.song)
        props.setCurrentSong(response.song);
    }
    const handleOnClick = () => {
        if (account) {
            nav('/createplaylist')
        }
        else {
            nav('/signin')
        }
    }

    useEffect(() => {
        fetchById();
    }, [])


    return (
        <div className="container-fluid w-100 bg-dark min-vh-100">
            <div className="row h-100">
                <div className="col-2 p-0 h-100 position-fixed" style={{ backgroundColor: "black" }}>
                    <Sidebar currentSong={props.currentSong} />
                </div>
                <div className="col-10 p-0 offset-2 h-100">
                    <Navbar />
                    {song &&
                        <div className="container my-4 bg-dark" style={props.currentSong ? { height: '81vh', overflow: 'auto' } : { height: '92.48vh', overflow: 'auto' }}>
                            <div className="d-flex">
                                <div className="mx-4">
                                    <img src={song.imageLink} className="rounded" style={{ width: '250px', height: '250px' }} />
                                </div>
                                <div className="d-flex flex-column justify-content-end text-light">
                                    <span className="mb-2 fw-bold">SINGLE</span>
                                    <div className="mb-2">
                                        <span className="display-5 me-2" style={{ fontFamily: "Mochiy Pop P One, sans-serif" }}>{song.songName}</span>
                                        {
                                            (song.movieName != "AlbumSong") ?
                                                `(From "${song.movieName}")` : ""
                                        }
                                    </div>
                                    {/* <span className="">{song.singerName}</span> */}
                                    <div className="text-muted">
                                        <small>{song.singerName.split(',').join(' ● ')}</small>
                                        {" ● "}
                                        <small>1 Song</small>
                                    </div>
                                </div>
                            </div>

                            <table className="table text-light table-dark table-hover mt-4">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {/* <th></th> */}
                                        <th>TITLE</th>
                                        <th>ARTIST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-light" style={{ height: '50px' }}>
                                        <td className="align-middle" style={{ width: "50px" }}>{1}</td>
                                        {/* <td className="align-middle ">
                                            <video style={{ width: "35px", height: "35px" }} autoPlay loop>
                                                <source src={Equalizer} type="video/mp4"/>
                                            </video>
                                        </td> */}
                                        <td className="align-middle" style={{ width: "500px" }} >
                                            <img src={song.imageLink} className="me-3" style={{ width: "35px", height: "35px" }} />
                                            {song.songName}
                                            {
                                                (song.movieName !== "AlbumSong") &&
                                                    <span>&nbsp;(From "{song.movieName}")</span> 

                                            }
                                        </td>
                                        <td className="align-middle" style={{ width: "400px" }}>{song.singerName}</td>
                                        <td className="align-middle text-center">
                                            <span style={{ fontSize: "25px", color: "white", cursor: "pointer" }} title="Add to playlist" onClick={handleOnClick}>+</span>
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
