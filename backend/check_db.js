const { db } = require('./db');

const checkDb = async () => {
    try {
        const [users] = await db.execute('SELECT * FROM users');
        console.log('Users:', users);
        const [enrollments] = await db.execute('SELECT * FROM enrollments');
        console.log('Enrollments:', enrollments);
        const [courses] = await db.execute('SELECT * FROM courses');
        console.log('Courses:', courses);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDb();
