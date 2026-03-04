import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { CheckCircle, PlayCircle, Clock } from 'lucide-react';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        api.get(`/courses/${id}`).then(res => setCourse(res.data));
        if (user) {
            api.get(`courses/enrolled/${user.id}`).then(res => {
                const enrolled = res.data.some(c => c.id == id);
                setIsEnrolled(enrolled);
            });
        }
    }, [id, user?.id]);

    const handleEnroll = async () => {
        if (!user) return navigate('/login');
        try {
            await api.post('/progress/enroll', { userId: user.id, courseId: id });
            setIsEnrolled(true);
            const firstLessonId = course.sections[0].lessons[0].id;
            navigate(`/learning/${id}/${firstLessonId}`);
        } catch (err) {
            alert('Could not enroll. Please try again.');
        }
    };

    if (!course) return <div className="container">Loading...</div>;

    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

    return (
        <div style={{ paddingBottom: '6rem' }}>
            <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', padding: '4rem 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <span className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>Premium Course</span>
                        <h1 style={{ fontSize: '3rem', fontWeight: 850, marginBottom: '1.5rem', lineHeight: 1.1, background: 'linear-gradient(to bottom right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{course.title}</h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px' }}>{course.description}</p>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--primary-light))' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor</div>
                                    <div style={{ fontWeight: 600 }}>{course.instructor}</div>
                                </div>
                            </div>
                            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <Clock size={18} /> <span>12 hours of content</span>
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '0.5rem' }}>
                        <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', borderRadius: '1rem', marginBottom: '1rem' }} />
                        <div style={{ padding: '1rem' }}>
                            <button
                                onClick={isEnrolled ? () => navigate(`/learning/${id}/${course.sections[0].lessons[0].id}`) : handleEnroll}
                                className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                {isEnrolled ? "Continue Learning" : "Enroll Now — Free"}
                            </button>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>Full lifetime access • Certificate of completion</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '5rem' }}>
                    <div>
                        <h2 className="section-title">What you'll learn</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'var(--bg-card)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border)', marginBottom: '4rem' }}>
                            {course.what_will_learn?.split(',').map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <CheckCircle size={20} color="var(--accent)" style={{ marginTop: '0.2rem' }} />
                                    <span style={{ fontSize: '0.95rem' }}>{item.trim()}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="section-title">Course Curriculum</h2>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '1.5rem', overflow: 'hidden', background: 'var(--bg-card)' }}>
                            {course.sections.map(section => (
                                <div key={section.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ padding: '1.5rem', background: 'var(--bg-elevated)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {section.title}
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>{section.lessons.length} lessons</span>
                                    </div>
                                    <div style={{ padding: '0.5rem 0' }}>
                                        {section.lessons.map(lesson => (
                                            <div key={lesson.id} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', transition: 'background 0.2s' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <PlayCircle size={18} color="var(--text-muted)" />
                                                    {lesson.title}
                                                </div>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{lesson.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
