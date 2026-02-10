const mongoose = require('mongoose');
const Job = require('./src/models/Job');
const User = require('./src/models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharat-lancer')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function seedJobs() {
    try {
        // Find an employer user or create one
        let employer = await User.findOne({ role: 'employer' });
        
        if (!employer) {
            console.log('No employer found. Please create an employer account first.');
            process.exit(1);
        }

        // Sample jobs
        const sampleJobs = [
            {
                title: 'Full Stack Web Developer Needed',
                description: 'Looking for an experienced full stack developer to build a modern web application using React and Node.js. Must have experience with MongoDB and RESTful APIs.',
                requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'REST API'],
                budget: { min: 45000, max: 55000 },
                duration: '2-3 months',
                jobType: 'freelance',
                locationPreference: 'Remote',
                employer: employer._id,
                status: 'open'
            },
            {
                title: 'Mobile App Developer - React Native',
                description: 'Need a skilled React Native developer to create a cross-platform mobile application for iOS and Android. Experience with Firebase is a plus.',
                requiredSkills: ['React Native', 'JavaScript', 'Firebase', 'Mobile Development'],
                budget: { min: 70000, max: 80000 },
                duration: '3-4 months',
                jobType: 'contract',
                locationPreference: 'Mumbai',
                employer: employer._id,
                status: 'open'
            },
            {
                title: 'UI/UX Designer for E-commerce Platform',
                description: 'Seeking a creative UI/UX designer to redesign our e-commerce platform. Must have experience with Figma and modern design principles.',
                requiredSkills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'User Research'],
                budget: { min: 35000, max: 45000 },
                duration: '1-2 months',
                jobType: 'freelance',
                locationPreference: 'Bangalore',
                employer: employer._id,
                status: 'open'
            },
            {
                title: 'Python Backend Developer',
                description: 'Looking for a Python developer with Django/Flask experience to build backend APIs for our SaaS product. Must know PostgreSQL.',
                requiredSkills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API'],
                budget: { min: 55000, max: 65000 },
                duration: '2 months',
                jobType: 'freelance',
                locationPreference: 'Remote',
                employer: employer._id,
                status: 'open'
            },
            {
                title: 'DevOps Engineer - AWS Specialist',
                description: 'Need an experienced DevOps engineer to set up CI/CD pipelines and manage AWS infrastructure. Docker and Kubernetes experience required.',
                requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
                budget: { min: 75000, max: 85000 },
                duration: '3 months',
                jobType: 'contract',
                locationPreference: 'Delhi',
                employer: employer._id,
                status: 'open'
            }
        ];

        // Clear existing jobs (optional)
        await Job.deleteMany({});
        console.log('Cleared existing jobs');

        // Insert sample jobs
        const jobs = await Job.insertMany(sampleJobs);
        console.log(`✅ Successfully created ${jobs.length} sample jobs!`);

        jobs.forEach(job => {
            console.log(`- ${job.title} (₹${job.budget.min} - ₹${job.budget.max})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding jobs:', error);
        process.exit(1);
    }
}

seedJobs();
