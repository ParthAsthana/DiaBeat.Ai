import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Profile from './Profile';
import Form from './Form';
import Chatbot from './ChatBot'; 
import SignUp from './SignUp';
import Login from './Login'; 

function PrivateRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return isAuthenticated ? <><Navbar />{children}</> : <Navigate to="/Login" replace />;
}

function AppRouter() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/Profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/Form" element={<PrivateRoute><Form /></PrivateRoute>} />
                <Route path="/ChatBot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
