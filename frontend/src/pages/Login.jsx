import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        try {
            const res = await api.post(endpoint, { username, password });
            if (!isRegister) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } else {
                setIsRegister(false);
                alert('Registered successfully! Please login.');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '400px', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            className="btn btn-outline"
                            style={{ width: '100%', textAlign: 'left', cursor: 'text' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            className="btn btn-outline"
                            style={{ width: '100%', textAlign: 'left', cursor: 'text' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                        {isRegister ? 'Sign Up' : 'Login'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <span
                            onClick={() => setIsRegister(!isRegister)}
                            style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '0.5rem' }}
                        >
                            {isRegister ? 'Login' : 'Sign Up'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
