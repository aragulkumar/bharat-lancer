const mongoose = require('mongoose');
const Job = require('./src/models/Job');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharat-lancer')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkJobs() {
    try {
        const jobs = await Job.find().populate('employer', 'name email');
        console.log(`\n✅ Found ${jobs.length} jobs in database:\n`);
        
        if (jobs.length === 0) {
            console.log('⚠️  No jobs found! Run "node seedJobs.js" to create sample jobs.');
        } else {
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. ${job.title}`);
                console.log(`   Budget: ₹${job.budget.min} - ₹${job.budget.max}`);
                console.log(`   Employer: ${job.employer?.name || 'Unknown'}`);
                console.log(`   Status: ${job.status}`);
                console.log('');
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error checking jobs:', error);
        process.exit(1);
    }
}

checkJobs();
