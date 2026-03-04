const axios = require('axios');

const reproduce = async () => {
    try {
        // Enroll user 1 in course 1
        // Note: No token here because I'm calling directly, let's see if it fails
        const res = await axios.post('http://localhost:5001/api/progress/enroll', {
            userId: 1,
            courseId: 1
        });
        console.log('Enrollment Result:', res.data);
    } catch (err) {
        console.log('Error Status:', err.response?.status);
        console.log('Error Body:', err.response?.data);
    }
    process.exit(0);
};

reproduce();
