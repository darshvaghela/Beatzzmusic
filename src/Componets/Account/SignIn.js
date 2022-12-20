import React, { useState, useContext } from 'react'
import UserContext from '../Contexts/user/UserContext';
import { BrowserRouter as Router,useNavigate, Switch, Route, Link } from 'react-router-dom';


export default function SignIn(props) {
    const { signIn } = useContext(UserContext);
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    props.setCurrentSong(null);
    const handleOnChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }
    const handleOnClick = async (event) => {
        event.preventDefault();
        let response = await signIn(user.email, user.password)
        if (!response.success) {
            setError(response.error);
        }
        else {
            localStorage.setItem("account",JSON.stringify({"token":response.authtoken,"user":response.user}));
            setUser({ email: "", password: "" });
            setError("");
            navigate("/");
        }
    }
    return (
        <div className="">

        <div className="container h-100 d-flex justify-content-center flex-column w-25 border p-3 align-item-center" style={{ marginTop: "180px" }}>
            <h1 className="text-center mb-4">Sign In</h1>
            <h5 style={{color: 'red',textAlign : 'center'}}>{error}</h5>
            <div className="input-group mb-4">
                <input type="email" className="form-control" name="email" value={user.email} onChange={handleOnChange} placeholder="Email" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group mb-4">
                <input type="password" className="form-control" name="password" value={user.password} onChange={handleOnChange} placeholder="Password" aria-describedby="basic-addon1" />
            </div>


            <button type="button" className="btn btn-primary w-100 mb-4 mx-auto" onClick={handleOnClick}>Sign In</button>
            <Link to='/resetpassword'className="text-center">Forgot Password?</Link>
            <hr/>
            <Link to="/signup" >
                <button className="btn btn-success w-100 mb-4 mx-auto">Create new account?</button>
            </Link>
        </div>

        </div>
    )
}
