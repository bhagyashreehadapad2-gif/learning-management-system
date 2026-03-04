const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Midleware for Auth (Simplified for MVP)
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    next(); // In real app, verify JWT here
};

// Enroll in course
router.post('/enroll', authenticate, async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        await db.execute(`INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`, [userId, courseId]);
        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ message: 'Already enrolled' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Get user progress for a course
router.get('/:userId/:courseId', authenticate, async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT p.lesson_id, p.status 
            FROM progress p 
            JOIN lessons l ON p.lesson_id = l.id 
            JOIN sections s ON l.section_id = s.id 
            WHERE p.user_id = ? AND s.course_id = ?`, [userId, courseId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update lesson progress
router.post('/update', authenticate, async (req, res) => {
    const { userId, lessonId, status } = req.body;
    try {
        await db.execute(`
            INSERT INTO progress (user_id, lesson_id, status, last_watched) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE status = VALUES(status), last_watched = CURRENT_TIMESTAMP`,
            [userId, lessonId, status]);
        res.json({ message: 'Progress updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
