import React, { useState } from 'react'
import storage from '../fire'
import ProgressBar from "@ramonak/react-progress-bar";
import Navbar from '../Navbar';
import { BrowserRouter as Router, useNavigate, Switch, Route, Link } from 'react-router-dom';
import * as  consts from '../../Constant'


export default function AddSong() {
    const [song, setSong] = useState("");
    const [image, setImage] = useState("");
    const [songurl, setSongurl] = useState("");
    const [imageurl, setImageurl] = useState("");
    const [data, setData] = useState({ songName: "", movieName: "", singerName: "", songLink: "", imageLink:"", genre: "" });
    const genres = ["","Punjabi", "Bollywood", "Romance", "Indian-classical", "Holiday", "Netflix", "Party", "Instrumental", "Workout", "Rock", "Jazz", "Pop", "Hip-Hop and Rap"];
    const [songprogress, setSongprogress] = useState(0)
    const [imageprogress, setImageprogress] = useState(0)
    const songUpload = () => {
        const uploadTask = storage.ref(`/songs/${song.name}`).put(song);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                setSongprogress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                .ref("songs")
                .child(song.name)
                    .getDownloadURL()
                    .then(url => {
                        // setSongurl(url);
                        setData({...data,songLink:url});
                        console.log(url);
                        console.log(data);
                        
                    });
            }
            );
        }

        const imageUplaod = () => {
            const uploadTask = storage.ref(`/images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setImageprogress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // setImageurl(url);
                        setData({...data, imageLink: url })
                        console.log(url);
                        console.log(data);
                      
                    });
                }
                );
                
            }
            const handleOnChange = (event) => {
                // console.log(event.target.value)
                setData({ ...data, [event.target.name]: event.target.value });
                
            }
            
            const addSong = async () => {
                const account = JSON.parse(localStorage.getItem("account"))
                let response = await fetch(`${consts.herokuUrl}song/addsong`,
                {
                    method: 'POST',
                headers: { 'Content-Type': 'application/json' ,'token':account.token},
                body: JSON.stringify(data)
            }
        );

        response = await response.json();
        if (response.success) {
            setData({ songName: "", movieName: "", singerName: "", songLink: "", imageLink: "", genre: "" })
            setSongprogress(0)
            setImageprogress(0)
            setSong([0])
            setImage([0])
        }
        return response;
    }
    // console.log("first");
    // console.log(data.songLink);
    // console.log("second");


    return (


        <div>
            <Navbar />
            <div className="container my-4" >
                <h2>Add song</h2>
                <hr />


                <div className="mb-3 row my-4">
                    <label className="col-sm-2 col-form-label">Add Song</label>
                    <div className="col-sm-10">
                        <input type="file" className="form-control w-50" onChange={(e) => { setSong(e.target.files[0]) }} />
                    </div>
                </div>

                <div className="mb-3 row my-4">
                    <div className="col-sm-6">
                        <ProgressBar completed={songprogress} bgColor="blue" className="w-100" />
                    </div>
                    <div className="col-sm-6">
                        <button className="btn btn-primary rounded" onClick={songUpload}>Upload</button>
                    </div>

                </div>

                <div className="mb-3 row my-4">
                    <label className="col-sm-2 col-form-label">Add Poster</label>
                    <div className="col-sm-10">
                        <input type="file" className="form-control w-50" onChange={(e) => { setImage(e.target.files[0]) }} />
                    </div>
                </div>

                <div className="mb-3 row my-4">
                    <div className="col-sm-6">
                        <ProgressBar completed={imageprogress} bgColor="blue" className="w-100" />
                    </div>
                    <div className="col-sm-6">
                        <button className="btn btn-primary rounded" onClick={imageUplaod}>Upload</button>
                    </div>

                </div>

                <div className="mb-3 row my-4">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Song Name</label>
                    <div className="col-sm-10">
                        <input type="text" name="songName" className="form-control w-50" value={data.songName} onChange={handleOnChange} aria-label="songName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Movie Name</label>
                    <div className="col-sm-10">
                        <input type="text" name="movieName" className="form-control w-50" value={data.movieName} onChange={handleOnChange} aria-label="movieName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Singer</label>
                    <div className="col-sm-10">
                        <input type="text" name="singerName" className="form-control w-50" value={data.singerName} onChange={handleOnChange} aria-label="singerName" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Genre</label>
                    <div className="col-sm-10">

                        <select className="form-select w-50" name="genre" onChange={handleOnChange} aria-label="Default select example">
                            {genres.map(s => {

                                return (
                                    <option value={s.genre}>{s}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>


                <Link to="/admin/songs" >
                    <button type="button" className="btn btn-success  mb-4 mx-auto" onClick={addSong}>Add</button>
                </Link>
            </div>



            {/* <h3>{data.songLink}</h3> */}
        </div>



    )
}
