import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            email: email,
            password: password
        };

        try {
            const res = await axios.post('http://localhost:5001/Login', user);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setIsAuthenticated(true);
                alert(res.data.message);
                navigate('/'); // navigate to home page after successful login
            } else {
                alert(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Login</h3>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Email" 
                       onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Password" 
                       onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary btn-block">Log In</button>

            <p className="forgot-password text-right">
                Haven't registered yet? <Link to="/SignUp">Sign Up</Link>
            </p>
        </form>
    );
}

export default Login;
