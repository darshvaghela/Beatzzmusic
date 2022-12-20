import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar';
import { BrowserRouter as Router, useNavigate, Switch, Route, Link, useLocation, useParams } from 'react-router-dom';
import * as  consts from '../../Constant'



export default function EditSong() {
    const location = useLocation();
    const nav = useNavigate();

    const genres = ["", "Punjabi", "Bollywood", "Romance", "Indian-Classical", "Holiday", "Netflix", "Party", "Instrumental", "Workout", "Rock", "Jazz", "Pop", "Hip-Hop and Rap"];
    const id = location.state.id;
    const [song, setSong] = useState({ id: "", songName: "", movieName: "", singerName: "", genre: "" })


    const fetchById = async () => {
        let response = await fetch(`${consts.herokuUrl}song/fetchbyid/${id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        response = await response.json();
        setSong({
            id: id,
            songName: response.song.songName,
            movieName: response.song.movieName,
            singerName: response.song.singerName,
            genre: response.song.genre
        })
        return response;
    }
    const handleOnClick = async () => {
        const account = JSON.parse(localStorage.getItem("account"))

        let response = await fetch(`${consts.herokuUrl}song/editsong`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'token': account.token },
                body: JSON.stringify(song)
            }
        );
        response = await response.json();
        if (response.success) {
            window.alert("Edited Successfully")
            nav('/admin/songs')
        }
    }

    useEffect(() => {
        fetchById();
    }, [])
    const handleOnChange = (event) => {
        setSong({ ...song, [event.target.name]: event.target.value });

    }

    return (
        <div>
            <Navbar />
            <div className="container my-4" >
                <h2>Edit song</h2>
                <hr />
                {/* <h1>{song.genre}</h1> */}
                <div className="mb-3 row my-4">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Song Name</label>
                    <div className="col-sm-10">
                        <input type="text" name="songName" className="form-control w-50" value={song.songName} onChange={handleOnChange} aria-label="songName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Movie Name</label>
                    <div className="col-sm-10">
                        <input type="text" name="movieName" className="form-control w-50" value={song.movieName} onChange={handleOnChange} aria-label="movieName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Singer</label>
                    <div className="col-sm-10">
                        <input type="text" name="singerName" className="form-control w-50" value={song.singerName} onChange={handleOnChange} aria-label="singerName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Genre</label>
                    <div className="col-sm-10">

                        <select className="form-select w-50" name="genre" value={song.genre} onChange={handleOnChange} aria-label="Default select example">
                            {genres.map(s => {

                                return (
                                    <option value={s.genre} >{s}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <button type="button" className="btn btn-success  mb-4 mx-auto" onClick={handleOnClick} >Edit</button>
            </div>
        </div>
    )
}
