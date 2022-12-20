import React from 'react'
import { BrowserRouter as Router, useLocation, useNavigate, Switch, Route, Link } from 'react-router-dom';


export default function Navbar(props) {
    const nav = useNavigate();
    const location = useLocation();
    const account = JSON.parse(localStorage.getItem("account"))
    const handleOnClick = () => {
        localStorage.removeItem("account")
        nav('/')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark w-100" style={{ "backgroundColor": "#151313" }}>
                <div className="container w-100">
                    <div className="navbar-nav d-flex w-100">
                        <div className="d-flex me-auto">
                            {(account && account.user.isAdmin) &&
                                <span className="">
                                    {location.pathname.startsWith("/admin") ?

                                        <Link to="/" className="nav-link" style={{ letterSpacing: 2, cursor: "pointer" }}>Home</Link>
                                        :
                                        <Link to="/admin/songs" className="nav-link" style={{ letterSpacing: 2, cursor: "pointer" }}>Admin</Link>
                                    }
                                </span>
                            }
                            {props.btns}
                            {props.search}
                        </div>
                        <div className="d-flex">
                            {account ?
                                <span className="nav-link" style={{ letterSpacing: 2, cursor: "pointer" }} onClick={handleOnClick}>Logout ({account.user.name})</span>
                                :
                                <>
                                    <Link to="/signup" className="nav-link" style={{ letterSpacing: 2 }}>Sign Up</Link>
                                    <Link to="/signin" className="nav-link" style={{ letterSpacing: 2 }}>Sign In</Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
