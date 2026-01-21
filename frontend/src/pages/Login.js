import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAdminAuth }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            setAdminAuth(true);
            navigate('/admin');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input name="username" type="text" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '20px' }}>
                        Login
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '12px' }}>
                        Hint: admin / admin123
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
