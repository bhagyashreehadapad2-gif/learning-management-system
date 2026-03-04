const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM courses`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get enrolled courses for a user
router.get('/enrolled/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows] = await db.execute(`
            SELECT c.* 
            FROM courses c 
            JOIN enrollments e ON c.id = e.course_id 
            WHERE e.user_id = ?`, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get course details (including sections and lessons)
router.get('/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const [courses] = await db.execute(`SELECT * FROM courses WHERE id = ?`, [courseId]);
        const course = courses[0];

        if (!course) return res.status(404).json({ error: 'Course not found' });

        const [rows] = await db.execute(`
            SELECT s.id as section_id, s.title as section_title, l.id as lesson_id, l.title as lesson_title, l.youtube_url, l.duration 
            FROM sections s 
            LEFT JOIN lessons l ON s.id = l.section_id 
            WHERE s.course_id = ?`, [courseId]);

        const sections = [];
        rows.forEach(row => {
            let section = sections.find(s => s.id === row.section_id);
            if (!section) {
                section = { id: row.section_id, title: row.section_title, lessons: [] };
                sections.push(section);
            }
            if (row.lesson_id) {
                section.lessons.push({ id: row.lesson_id, title: row.lesson_title, youtube_url: row.youtube_url, duration: row.duration });
            }
        });

        res.json({ ...course, sections });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
