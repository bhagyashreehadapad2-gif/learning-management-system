import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ChevronLeft, ChevronRight, CheckCircle, Play } from 'lucide-react';

const LearningArea = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [progress, setProgress] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return navigate('/login');

        api.get(`/courses/${courseId}`).then(res => setCourse(res.data));
        api.get('courses').then(res => setAllCourses(res.data));
        api.get(`/progress/${user.id}/${courseId}`).then(res => setProgress(res.data));
    }, [courseId, lessonId, user?.id, navigate]);

    if (!course) return <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Workspace...</div>;

    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentLesson = allLessons.find(l => l.id == lessonId);
    const currentIndex = allLessons.findIndex(l => l.id == lessonId);

    const prevLesson = allLessons[currentIndex - 1];
    const nextLesson = allLessons[currentIndex + 1];

    const markCompleted = async () => {
        try {
            await api.post('/progress/update', { userId: user.id, lessonId, status: 'completed' });
            const progressRes = await api.get(`/progress/${user.id}/${courseId}`);
            setProgress(progressRes.data);

            // Check if this was the last lesson
            const completedCount = progressRes.data.filter(p => p.status == 'completed').length;
            if (completedCount === allLessons.length) {
                setShowCelebration(true);
            } else if (nextLesson) {
                navigate(`/learning/${courseId}/${nextLesson.id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isCompleted = (id) => progress.some(p => p.lesson_id == id && p.status == 'completed');
    const completionPercentage = Math.round((progress.filter(p => p.status == 'completed').length / allLessons.length) * 100) || 0;

    const recommendation = allCourses.find(c => c.id != courseId);

    return (
        <div className="learning-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: 'calc(100vh - 70px)', background: 'var(--bg-dark)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <div style={{ background: '#000', position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${currentLesson?.youtube_url}?autoplay=1&rel=0&modestbranding=1`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allowFullScreen
                    ></iframe>
                </div>
                <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span className="badge badge-primary">Lesson {currentIndex + 1} of {allLessons.length}</span>
                                {completionPercentage === 100 && <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>Course Completed</span>}
                            </div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{currentLesson?.title}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                disabled={!prevLesson}
                                onClick={() => navigate(`/learning/${courseId}/${prevLesson.id}`)}
                                className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: prevLesson ? 1 : 0.5 }}>
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={markCompleted}
                                className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {isCompleted(lessonId) ? "Completed" : "Mark as Complete"} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>About this lesson</h3>
                        <p style={{ color: 'var(--text-muted)' }}>In this lesson, we dive deep into the core concepts and practical applications. Make sure to follow along and complete any exercises provided.</p>
                    </div>
                </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Course Progress</h3>
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>{completionPercentage}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {course.sections.map(section => (
                        <div key={section.id}>
                            <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                {section.title}
                            </div>
                            {section.lessons.map(lesson => (
                                <Link
                                    key={lesson.id}
                                    to={`/learning/${courseId}/${lesson.id}`}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1.25rem 2rem',
                                        borderBottom: '1px solid var(--border)',
                                        alignItems: 'center',
                                        background: lesson.id == lessonId ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        {isCompleted(lesson.id) ? (
                                            <CheckCircle size={20} color="var(--accent)" fill="rgba(16, 185, 129, 0.1)" />
                                        ) : (
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Play size={10} color="var(--text-muted)" fill="var(--text-muted)" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: lesson.id == lessonId ? 600 : 500, color: lesson.id == lessonId ? 'var(--text-main)' : 'var(--text-muted)' }}>{lesson.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{lesson.duration}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {showCelebration && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="celebration-glow"></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Mastery Achieved!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                                Congratulations! You've successfully completed <b>{course.title}</b>. Your certificate of completion is now available.
                            </p>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Recommended for you</p>
                                {recommendation && (
                                    <div className="recommendation-card" onClick={() => navigate(`/course/${recommendation.id}`)}>
                                        <img src={recommendation.thumbnail_url} alt="" style={{ width: '80px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{recommendation.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>By {recommendation.instructor}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1rem' }}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningArea;
