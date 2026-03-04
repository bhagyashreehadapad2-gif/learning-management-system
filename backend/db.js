const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(process.env.DATABASE_URL);
const db = pool.promise();

const initDb = async () => {
    try {
        // Users table
        await db.execute(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(50) DEFAULT 'student'
        )`);

        // Courses table
        await db.execute(`CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            instructor VARCHAR(255),
            description TEXT,
            thumbnail_url VARCHAR(500),
            what_will_learn TEXT
        )`);

        // Sections table
        await db.execute(`CREATE TABLE IF NOT EXISTS sections (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            title VARCHAR(255),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )`);

        // Lessons table
        await db.execute(`CREATE TABLE IF NOT EXISTS lessons (
            id INT AUTO_INCREMENT PRIMARY KEY,
            section_id INT,
            title VARCHAR(255),
            youtube_url VARCHAR(255),
            duration VARCHAR(50),
            FOREIGN KEY (section_id) REFERENCES sections(id)
        )`);

        // Enrollments table
        await db.execute(`CREATE TABLE IF NOT EXISTS enrollments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            course_id INT,
            enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, course_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )`);

        // Progress table
        await db.execute(`CREATE TABLE IF NOT EXISTS progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            lesson_id INT,
            status VARCHAR(50) DEFAULT 'pending',
            last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, lesson_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (lesson_id) REFERENCES lessons(id)
        )`);

        console.log('Aiven MySQL tables initialized.');

        // Seed data
        const [rows] = await db.query("SELECT COUNT(*) as count FROM courses");
        if (rows[0].count === 0) {
            // Course 1: Java
            await db.execute("INSERT INTO courses (title, instructor, description, thumbnail_url, what_will_learn) VALUES (?, ?, ?, ?, ?)",
                ["Java Mastery: Zero to Hero", "John Doe", "A comprehensive guide to Java programming. Master everything from variables and data types to advanced multi-threading and enterprise patterns.", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80", "OOP principles, Collections Framework, Streams API, Multithreading, Enterprise Architecture"]);

            // Course 2: Python for ML
            await db.execute("INSERT INTO courses (title, instructor, description, thumbnail_url, what_will_learn) VALUES (?, ?, ?, ?, ?)",
                ["Python for Machine Learning", "Jane Smith", "Unlock the power of data. Learn how to build and deploy intelligent models using the world's most popular programming language.", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&q=80", "NumPy, Pandas, Matplotlib, Scikit-learn, Neural Networks basics"]);

            // Course 3: UI/UX Design
            await db.execute("INSERT INTO courses (title, instructor, description, thumbnail_url, what_will_learn) VALUES (?, ?, ?, ?, ?)",
                ["Premium UI/UX Design", "Alex Rivera", "Design interfaces that wow. Master the principles of user-centric design and learn to use industry-standard tools like Figma and Adobe XD.", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=80", "Design Thinking, Color Theory, Typography, Prototyping, User Testing"]);

            // Sections & Lessons for Java (ID 1)
            await db.execute("INSERT INTO sections (course_id, title) VALUES (?, ?)", [1, "Getting Started"]);
            await db.execute("INSERT INTO sections (course_id, title) VALUES (?, ?)", [1, "Core Concepts"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [1, "Introduction to Java", "hQclqpaWl-w", "08:45"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [1, "JDK & IDE Setup", "eIrMbAQSU34", "12:30"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [2, "Classes and Objects", "iuYl6n0fV04", "18:20"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [2, "Inheritance & Polymorphism", "nOvcS0rY7I4", "22:15"]);

            // Sections & Lessons for Python (ID 2)
            await db.execute("INSERT INTO sections (course_id, title) VALUES (?, ?)", [2, "Data Science Basics"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [3, "Introduction to NumPy", "Rbg7H6H_hGk", "14:10"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [3, "Pandas Crash Course", "vmEHCJofslg", "25:40"]);

            // Sections & Lessons for UI/UX (ID 3)
            await db.execute("INSERT INTO sections (course_id, title) VALUES (?, ?)", [3, "Design Foundation"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [4, "Understanding Design Principles", "7Z16p8KbcCg", "10:30"]);
            await db.execute("INSERT INTO lessons (section_id, title, youtube_url, duration) VALUES (?, ?, ?, ?)", [4, "Figma for Beginners", "jk1T0CdLxwU", "35:00"]);

            console.log('Premium seed data inserted into Aiven.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = { db, initDb };
