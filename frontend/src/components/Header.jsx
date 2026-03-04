import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <Link to="/" className="logo">LMS Platform</Link>
                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)', opacity: 0.8 }}>Dashboard</Link>
                    <Link to="/explore" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)', opacity: 0.8 }}>Explore</Link>
                </nav>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '2rem', border: '1px solid var(--border)' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                {user.username[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.username}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Sign In</Link>
                )}
            </div>
        </header>
    );
};

export default Header;
