import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { userInfo, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <NavLink to="/" className="nav-logo">
                    <span>movie<span>book</span></span>
                </NavLink>

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                    {userInfo ? (
                        <>
                            {!userInfo.isAdmin && (
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Bookings</NavLink>
                            )}
                            {userInfo.isAdmin && (
                                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
                            )}
                            <div className="user-profile">
                                <User size={18} />
                                <span>{userInfo.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <NavLink to="/login" className="nav-btn">Login</NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
