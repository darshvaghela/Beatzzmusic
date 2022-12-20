import React, {useState,useContext}  from 'react'
import { useNavigate } from "react-router-dom";
import UserContext from '../Contexts/user/UserContext';

export default function ResetPassword() {
    const { resetpassword } = useContext(UserContext);
    const [user, setUser] = useState({email: "", password: "", cpassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleOnChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }
    const handleOnClick = async (event) => {
        event.preventDefault();
        if (user.password === user.cpassword) {
            let response = await resetpassword(user.email, user.password);
            if (!response.success) {
                setError(response.error);
            }
            else {
                setUser({email: "", password: "", cpassword: "" });
                setError("");
                navigate("/signin");
            }
        }
        else {
            setError("Password doesn't match");
        }
    }
    return (
        <div className="container d-flex justify-content-center flex-column w-25 border p-3 align-item-center" style={{ marginTop: "180px" }}>
            <h1 className="text-center mb-4">Reset Password</h1>
            <h5 style={{color: 'red',textAlign : 'center'}}>{error}</h5>
            <div className="input-group mb-4">
                <input type="email" className="form-control" name="email" value={user.email} onChange={handleOnChange} placeholder="Email" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group mb-4">
                <input type="password" className="form-control" name="password" value={user.password} onChange={handleOnChange} placeholder="Password" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group mb-4">
                <input type="password" className="form-control" name="cpassword" value={user.cpassword} onChange={handleOnChange} placeholder="Confirm Password" aria-describedby="basic-addon1" />
            </div>

            <button type="button" className="btn btn-primary w-100 mb-4 mx-auto" onClick={handleOnClick}>Sign In</button>
        </div>

    )
}
