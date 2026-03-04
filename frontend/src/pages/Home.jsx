import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Clock, User } from 'lucide-react';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userProgress, setUserProgress] = useState({}); // courseId -> completionPercentage
    const user = JSON.parse(localStorage.getItem('user'));

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const coursesRes = await api.get('courses');
                setCourses(coursesRes.data);

                if (user) {
                    const enrolledRes = await api.get(`courses/enrolled/${user.id}`);
                    // Filter out duplicates if any
                    const uniqueEnrolled = Array.from(new Map(enrolledRes.data.map(item => [item.id, item])).values());
                    setEnrolledCourses(uniqueEnrolled);

                    const progressData = {};
                    for (const course of uniqueEnrolled) {
                        try {
                            const detailRes = await api.get(`courses/${course.id}`);
                            const progressRes = await api.get(`progress/${user.id}/${course.id}`);
                            const totalLessons = detailRes.data.sections.reduce((acc, s) => acc + s.lessons.length, 0);
                            const completedLessons = progressRes.data.filter(p => p.status === 'completed').length;
                            progressData[course.id] = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                        } catch (e) {
                            console.error(`Progress fetch failed for course ${course.id}:`, e);
                        }
                    }
                    setUserProgress(progressData);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-muted)' }}>Synchronizing your workspace...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    return (
        <div>
            <div className="hero">
                <div className="container">
                    <h1>Master the Future <br /> of Technology.</h1>
                    <p>Access world-class learning experiences designed to help you build things that matter.</p>
                    {!user && (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '1rem' }}>
                            Join the Community
                        </Link>
                    )}
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '6rem' }}>
                {user ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="section-title">My Learning Dashboard</h2>
                            <Link to="/explore" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Explore More Courses →</Link>
                        </div>

                        {enrolledCourses.length > 0 ? (
                            <div className="course-grid">
                                {enrolledCourses.map(course => (
                                    <div key={course.id} className="card">
                                        <div style={{ position: 'relative' }}>
                                            <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                {userProgress[course.id] === 100 ? (
                                                    <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>Completed</span>
                                                ) : (
                                                    <span className="badge badge-primary">Active</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{course.title}</h3>

                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                    <span>Course Progress</span>
                                                    <span>{userProgress[course.id] || 0}%</span>
                                                </div>
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar-fill" style={{ width: `${userProgress[course.id] || 0}%` }}></div>
                                                </div>
                                            </div>

                                            <Link to={`/learning/${course.id}/1`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>
                                                {userProgress[course.id] === 100 ? "Review Course" : "Continue Learning"}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '2rem', border: '1px solid var(--border)' }}>
                                <h3 style={{ marginBottom: '1rem' }}>No active courses found.</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your journey by exploring our world-class curriculum.</p>
                                <Link to="/explore" className="btn btn-primary">Browse Catalogue</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="section-title">Explore Our Courses</h2>
                        <div className="course-grid">
                            {courses.map(course => (
                                <div key={course.id} className="card">
                                    <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>{course.title}</h3>
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
                )}
            </div>
        </div>
    );
};

export default Home;
