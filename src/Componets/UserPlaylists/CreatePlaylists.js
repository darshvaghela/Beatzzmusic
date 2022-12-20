import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, useNavigate, Switch, Route, Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar'
import playlisticon from '../../static/playlist-icon.png';
import EmptyPlaylist from '../../static/empty-playlist.jpg'
import * as  consts from '../../Constant'



export default function UserPlaylists(props) {
  const nav = useNavigate();
  const account = JSON.parse(localStorage.getItem("account"))

  const [create, setCreate] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);

  const handleOnChange = (event) => {
    setPlaylistName(event.target.value)
  }
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
  const handleOnClick = async (id) => {

    let response = await fetch(`${consts.herokuUrl}playlist/createplaylistbyuser`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': account.token },
        body: JSON.stringify({ playlistName, songId: props.currentSong._id, playlistId: id })
      }
    );
    response = await response.json();
    if (response.success) {
      window.alert(id ? "Song added successfully" : "Playlist Created")
      fetchuserPlaylists()
      nav('/viewplaylist', { state: { playlist: response.playlist } })
    }
    else {
      window.alert(response.error)
    }
  }
  const handleToggle = () => {
    setCreate(true)
  }
  if (!props.currentSong)
    nav('/')

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
          <div className="col-10 offset-2 p-0 h-100 ">
            <Navbar />
            <div className="container text-light scrollbar-color" style={props.currentSong ? { height: '81vh', overflow: 'auto' } : { height: '92.48vh', overflow: 'auto' }}>
              <div className="my-3">
                <h2 className="mb-3">Create new playlist</h2>
                {!create ?
                  <div>
                    <div className="row row-cols-6 g-4 mb-3">
                      <div className="col">
                        <div className="card h-100 text-light mycard" onClick={handleToggle}>
                          <img src={playlisticon} className="card-img-top bg-success" />
                          <div className="card-footer h-25">
                            <p className="card-title" >New Playlist</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  <div>
                    <div className="form-group d-flex align-items-center">
                      <input type="text" className="form-control w-25 me-4" value={playlistName} onChange={handleOnChange} placeholder="Playlist Name" />
                      <button type="submit" className="btn btn-success" onClick={() => handleOnClick()}>Create</button>
                    </div>
                  </div>
                }
              </div>
              <div className="my-4">
                <h2 className="mb-3">Your playlists</h2>
                {userPlaylists.length == 0 &&
                  <h5 className="my-4 text-muted">No existing playlists !!</h5>
                }
                <div className="row row-cols-6 g-4 mb-3">
                  {
                    userPlaylists.map((p, index) => {
                      return (
                        <div className="col" key={p._id}>
                          <div className="card h-100 text-light mycard" onClick={() => handleOnClick(p._id)}>
                            {p.songs[0] ?
                              <img src={p.songs[0].imageLink} className="card-img-top" />
                              :
                              <img src={EmptyPlaylist} className="card-img-top" />

                            }
                            <div className="card-footer h-25">
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
