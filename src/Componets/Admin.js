import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { BrowserRouter as Router, useLocation, useNavigate, Switch, Route, Link } from 'react-router-dom';
import Playlists from './ManagePlaylist/Playlists';
import Songs from './ManageSong/Songs';

export default function Admin(props) {
    const nav = useNavigate();
    const location = useLocation();
    props.setCurrentSong(null);
    useEffect(() => {
        
        const account = JSON.parse(localStorage.getItem("account"))
        if (!account) {

            nav('/signin')
        }
        if (account && account.user.isAdmin === false) {
            nav('/')
        }
    }, [])
    return (
        <>
            <Navbar
                btns={
                    <>
                        <Link to="/admin/songs" className="nav-link" style={{ letterSpacing: 2, cursor: "pointer" }}>Songs </Link>
                        <Link to="/admin/playlists" className="nav-link" style={{ letterSpacing: 2, cursor: "pointer" }}>Playlists</Link>
                    </>
                }
            />
            {location.pathname == "/admin/songs" ?
                <Songs />
                :
                <Playlists />
            }
        </>
    )
}
