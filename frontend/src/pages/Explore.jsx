import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Clock, Search } from 'lucide-react';

const Explore = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        api.get('courses').then(res => setCourses(res.data));
    }, []);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Explore Our Curriculum</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Browse through our curated list of premium courses designed by industry experts.
                </p>
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search for courses, technologies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', color: 'white', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="course-grid">
                {filteredCourses.map(course => (
                    <div key={course.id} className="card">
                        <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>Professional</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <Clock size={14} /> <span>12h 30m</span>
                                </div>
                            </div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{course.title}</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)', height: '3rem', overflow: 'hidden' }}>
                                {course.description}
                            </p>
                            <Link to={`/course/${course.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
