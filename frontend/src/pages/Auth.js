import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import './Auth.css';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { userInfo, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.state?.from || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isRegister ? '/users' : '/users/login';
            const { data } = await API.post(endpoint, formData);
            login(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="auth-page container fade-in">
            <div className="auth-card glass-morphism">
                <h2 className="text-gradient">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="auth-subtitle">{isRegister ? 'Join us for the best movie experience' : 'Login to your account to continue'}</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {isRegister && (
                        <div className="input-group">
                            <UserIcon className="input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="input-icon" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="primary-btn auth-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegister ? 'Register' : 'Login')}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={toggleMode} className="mode-toggle">
                        {isRegister ? ' Login' : ' Register Now'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
