import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
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
      const res = await axios.post('http://localhost:5001/SignUp', user);
      if (res.data) {
        alert(res.data.message);
        navigate('/Login'); // navigate to login page after successful signup
      } else {
        alert('Something went wrong!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

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

      <button type="submit" className="btn btn-primary btn-block">Sign Up</button>

      <p className="forgot-password text-right">
        Already registered? <Link to="/Login">Sign in</Link>
      </p>
    </form>
  );
}

export default SignUp;
