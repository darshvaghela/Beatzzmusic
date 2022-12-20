import react, { useState } from 'react'
import SignUP from './Componets/Account/SignUP';
import UserProvider from './Componets/Contexts/user/UserProvider';
import { Route, Routes } from "react-router-dom";
import Home from './Componets/Home';
import SignIn from './Componets/Account/SignIn';
import ResetPassword from './Componets/Account/ResetPassword';
import storage from './Componets/fire';
import AddSong from './Componets/ManageSong/AddSong';
import Admin from './Componets/Admin';
import EditSong from './Componets/ManageSong/EditSong'
import Player from './Componets/Player';
import SongForGenre from './Componets/SongForGenre'
import ViewPlaylist from './Componets/UserPlaylists/ViewPlaylist'
import CreatePlaylist from './Componets/ManagePlaylist/CreatePlaylist'
import CreatePlaylists from './Componets/UserPlaylists/CreatePlaylists'
import YourPlaylists from './Componets/UserPlaylists/YourPlaylists'
import AudioPlayer from 'react-h5-audio-player';
import Search from './Componets/Search';


export default function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <>
      <div className="h-100">
        <UserProvider>
          <Routes>
            <Route path="/admin/addsong" element={<AddSong />} />
            <Route path="/admin/songs" element={<Admin setCurrentSong={setCurrentSong} />} />
            <Route path="/admin/playlists" element={<Admin setCurrentSong={setCurrentSong} />} />
            <Route path="/admin/editsong" element={<EditSong />} />
            <Route path="/admin/createplaylist" element={<CreatePlaylist />} />

            <Route path="/signin" element={<SignIn setCurrentSong={setCurrentSong} />} />
            <Route path="/signup" element={<SignUP setCurrentSong={setCurrentSong} />} />
            <Route path="/resetpassword" element={<ResetPassword />} />

            <Route path="/" element={<Home currentSong={currentSong} />} />
            <Route path="/player" element={<Player currentSong={currentSong} setCurrentSong={setCurrentSong} />} />
            <Route path="/songs" element={<SongForGenre currentSong={currentSong} />} />
            <Route path="/search" element={<Search currentSong={currentSong} setCurrentSong={setCurrentSong}/>} />
            <Route path="/createplaylist" element={<CreatePlaylists currentSong={currentSong} />} />
            <Route path="/yourplaylist" element={<YourPlaylists currentSong={currentSong} />} />
            <Route path="/viewplaylist" element={<ViewPlaylist currentSong={currentSong} setCurrentSong={setCurrentSong} />} />
          </Routes>
          <div style={{ position: 'fixed', width: '100%', bottom: '0' }}>
            {currentSong &&
              <AudioPlayer
                autoPlay
                src={currentSong.songLink}
                onPlay={e => console.log("onPlay")}
              />
            }
          </div>
        </UserProvider>
      </div>
    </>
  );
}

