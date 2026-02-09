const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharat-lancer')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Job = require('../models/Job');
const User = require('../models/User');

// Sample job data with correct schema
const sampleJobs = [
  // Web Development
  {
    title: 'Full-Stack E-commerce Website Development',
    description: 'Need an experienced full-stack developer to build a modern e-commerce platform with payment integration, product catalog, shopping cart, and admin dashboard.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express', 'Payment Integration'],
    budget: { min: 140000, max: 160000 },
    duration: '3 months',
    jobType: 'contract',
    locationPreference: 'Remote'
  },
  {
    title: 'React Dashboard for Analytics Platform',
    description: 'Looking for a React developer to create an interactive dashboard with charts, graphs, and real-time data visualization.',
    requiredSkills: ['React', 'JavaScript', 'D3.js', 'Chart.js', 'REST API'],
    budget: { min: 75000, max: 85000 },
    duration: '6 weeks',
    jobType: 'freelance',
    locationPreference: 'Bangalore'
  },
  {
    title: 'WordPress Website Customization',
    description: 'Need WordPress expert to customize existing theme, add custom plugins, and optimize for SEO.',
    requiredSkills: ['WordPress', 'PHP', 'WooCommerce', 'SEO', 'CSS'],
    budget: { min: 30000, max: 40000 },
    duration: '2 weeks',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'REST API Integration for Mobile App',
    description: 'Seeking backend developer to integrate third-party APIs (payment, maps, notifications) into existing Node.js backend.',
    requiredSkills: ['Node.js', 'REST API', 'Express', 'API Integration', 'Postman'],
    budget: { min: 55000, max: 65000 },
    duration: '1 month',
    jobType: 'contract',
    locationPreference: 'Mumbai'
  },
  {
    title: 'Landing Page Design and Development',
    description: 'Create a high-converting landing page for SaaS product. Need both design and development.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Responsive Design'],
    budget: { min: 20000, max: 30000 },
    duration: '1 week',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },

  // Mobile App Development
  {
    title: 'Flutter Food Delivery App Development',
    description: 'Build a complete food delivery app with Flutter. Features include restaurant listings, cart, real-time tracking, and payment integration.',
    requiredSkills: ['Flutter', 'Dart', 'Firebase', 'Google Maps API', 'REST API'],
    budget: { min: 180000, max: 220000 },
    duration: '4 months',
    jobType: 'contract',
    locationPreference: 'Delhi'
  },
  {
    title: 'React Native Fitness Tracker App',
    description: 'Develop a fitness tracking mobile app with workout plans, progress tracking, and social features.',
    requiredSkills: ['React Native', 'JavaScript', 'Redux', 'Health APIs', 'Firebase'],
    budget: { min: 110000, max: 130000 },
    duration: '2 months',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'iOS Social Media App Development',
    description: 'Create an iOS app for photo sharing with filters, stories, and messaging.',
    requiredSkills: ['Swift', 'iOS', 'UIKit', 'Core Data', 'Firebase'],
    budget: { min: 170000, max: 190000 },
    duration: '3 months',
    jobType: 'contract',
    locationPreference: 'Bangalore'
  },

  // UI/UX Design
  {
    title: 'Mobile App UI/UX Design',
    description: 'Design complete UI/UX for a fintech mobile app. Need wireframes, mockups, and interactive prototypes.',
    requiredSkills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Material Design'],
    budget: { min: 65000, max: 75000 },
    duration: '1 month',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'Website Redesign - Modern UI',
    description: 'Redesign existing corporate website with modern, clean UI. Need Figma designs for all pages.',
    requiredSkills: ['Figma', 'Web Design', 'UI Design', 'Responsive Design', 'Adobe XD'],
    budget: { min: 45000, max: 55000 },
    duration: '3 weeks',
    jobType: 'freelance',
    locationPreference: 'Mumbai'
  },
  {
    title: 'Design System Creation for SaaS Product',
    description: 'Create comprehensive design system with components, color palette, typography, and guidelines.',
    requiredSkills: ['Figma', 'Design Systems', 'UI Components', 'Documentation', 'Branding'],
    budget: { min: 85000, max: 95000 },
    duration: '6 weeks',
    jobType: 'contract',
    locationPreference: 'Remote'
  },

  // Data Science/AI
  {
    title: 'Machine Learning Model for Recommendation System',
    description: 'Build ML model for product recommendations based on user behavior.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Scikit-learn'],
    budget: { min: 130000, max: 150000 },
    duration: '2 months',
    jobType: 'contract',
    locationPreference: 'Bangalore'
  },
  {
    title: 'Data Analysis Dashboard with Python',
    description: 'Create interactive data analysis dashboard using Streamlit or Dash.',
    requiredSkills: ['Python', 'Pandas', 'Streamlit', 'Data Visualization', 'SQL'],
    budget: { min: 60000, max: 70000 },
    duration: '1 month',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'AI Chatbot Integration for Customer Support',
    description: 'Integrate AI chatbot (GPT-based) into existing website for customer support.',
    requiredSkills: ['Python', 'NLP', 'OpenAI API', 'Chatbot', 'API Integration'],
    budget: { min: 95000, max: 105000 },
    duration: '6 weeks',
    jobType: 'contract',
    locationPreference: 'Remote'
  },

  // Content Writing
  {
    title: 'Technical Blog Writing - AI & Machine Learning',
    description: 'Write 10 high-quality blog posts (1500+ words each) on AI and ML topics.',
    requiredSkills: ['Content Writing', 'Technical Writing', 'SEO', 'AI Knowledge', 'Research'],
    budget: { min: 25000, max: 35000 },
    duration: '1 month',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'E-commerce Product Descriptions',
    description: 'Write compelling product descriptions for 200+ products in fashion category.',
    requiredSkills: ['Content Writing', 'Copywriting', 'E-commerce', 'SEO', 'Fashion'],
    budget: { min: 18000, max: 22000 },
    duration: '2 weeks',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },

  // Digital Marketing
  {
    title: 'SEO Optimization for SaaS Website',
    description: 'Optimize website for search engines, improve rankings, and increase organic traffic.',
    requiredSkills: ['SEO', 'Google Analytics', 'Keyword Research', 'Link Building', 'Content Strategy'],
    budget: { min: 50000, max: 60000 },
    duration: '2 months',
    jobType: 'contract',
    locationPreference: 'Remote'
  },
  {
    title: 'Social Media Marketing Campaign',
    description: 'Plan and execute social media campaign across Instagram, Facebook, and LinkedIn.',
    requiredSkills: ['Social Media Marketing', 'Content Creation', 'Facebook Ads', 'Instagram', 'Analytics'],
    budget: { min: 40000, max: 50000 },
    duration: '1 month',
    jobType: 'freelance',
    locationPreference: 'Mumbai'
  },

  // Video Editing
  {
    title: 'YouTube Video Editing - Tech Channel',
    description: 'Edit 20 YouTube videos for tech review channel. Need dynamic editing with graphics and transitions.',
    requiredSkills: ['Video Editing', 'Adobe Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics'],
    budget: { min: 35000, max: 45000 },
    duration: '1 month',
    jobType: 'freelance',
    locationPreference: 'Remote'
  },
  {
    title: 'Product Demo Video Creation',
    description: 'Create professional product demo video (2-3 minutes) with animations, voiceover, and background music.',
    requiredSkills: ['Video Editing', 'Animation', 'Adobe After Effects', 'Voiceover', 'Sound Design'],
    budget: { min: 30000, max: 40000 },
    duration: '2 weeks',
    jobType: 'freelance',
    locationPreference: 'Bangalore'
  }
];

async function seedJobs() {
  try {
    // Get all employers
    const employers = await User.find({ role: 'employer' }).limit(5);
    
    if (employers.length === 0) {
      console.log('⚠️  No employers found. Please run seedUsers.js first.');
      process.exit(1);
    }

    console.log(`📊 Found ${employers.length} employers`);

    // Distribution: Ragul (10), Priya (3), Arjun (3), Sneha (2), Vikram (2)
    const distribution = [10, 3, 3, 2, 2];
    
    // Delete existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    const jobsWithEmployers = [];
    let jobIndex = 0;

    employers.forEach((employer, empIndex) => {
      const jobCount = distribution[empIndex] || 0;
      
      for (let i = 0; i < jobCount && jobIndex < sampleJobs.length; i++) {
        jobsWithEmployers.push({
          ...sampleJobs[jobIndex],
          employer: employer._id,
          status: 'open'
        });
        jobIndex++;
      }
    });

    const createdJobs = await Job.insertMany(jobsWithEmployers);
    
    console.log(`\n✅ Successfully created ${createdJobs.length} sample jobs!`);
    console.log('\n📋 Job Distribution:');
    
    for (const employer of employers) {
      const count = createdJobs.filter(j => j.employer.toString() === employer._id.toString()).length;
      console.log(`  - ${employer.name}: ${count} jobs`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
