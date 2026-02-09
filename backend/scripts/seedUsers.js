const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleUsers = [
  // Employers
  {
    name: 'Ragul Kumar A',
    email: 'ragul@techcorp.com',
    password: 'password123',
    role: 'employer',
    companyName: 'TechCorp Solutions',
    bio: 'Leading technology company specializing in web and mobile development',
    location: 'Chennai, India'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@innovatelabs.com',
    password: 'password123',
    role: 'employer',
    companyName: 'InnovateLabs',
    bio: 'Innovation-driven startup focusing on AI and ML solutions',
    location: 'Bangalore, India'
  },
  {
    name: 'Arjun Patel',
    email: 'arjun@designhub.com',
    password: 'password123',
    role: 'employer',
    companyName: 'DesignHub Studio',
    bio: 'Creative design agency for modern digital experiences',
    location: 'Mumbai, India'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@dataminds.com',
    password: 'password123',
    role: 'employer',
    companyName: 'DataMinds Analytics',
    bio: 'Data science and analytics consulting firm',
    location: 'Hyderabad, India'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@cloudsolutions.com',
    password: 'password123',
    role: 'employer',
    companyName: 'CloudSolutions Inc',
    bio: 'Cloud infrastructure and DevOps services provider',
    location: 'Pune, India'
  },
  // Freelancers
  {
    name: 'Aisha Khan',
    email: 'aisha.khan@freelancer.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Full Stack Developer with 5+ years experience in MERN stack',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript', 'AWS'],
    hourlyRate: 2500,
    location: 'Delhi, India',
    portfolio: 'https://aishakhan.dev'
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@designer.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'UI/UX Designer creating beautiful and functional digital experiences',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Research', 'Prototyping'],
    hourlyRate: 2000,
    location: 'Ahmedabad, India',
    portfolio: 'https://rohanmehta.design'
  },
  {
    name: 'Kavya Iyer',
    email: 'kavya.iyer@datascience.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Data Scientist specializing in ML and AI solutions',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL', 'R'],
    hourlyRate: 3000,
    location: 'Bangalore, India',
    portfolio: 'https://kavyaiyer.ai'
  },
  {
    name: 'Amit Gupta',
    email: 'amit.gupta@writer.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Technical Content Writer and Blogger with expertise in tech topics',
    skills: ['Content Writing', 'Technical Writing', 'SEO', 'Blogging', 'Copywriting'],
    hourlyRate: 1500,
    location: 'Jaipur, India',
    portfolio: 'https://amitgupta.blog'
  },
  {
    name: 'Neha Desai',
    email: 'neha.desai@marketing.com',
    password: 'password123',
    role: 'freelancer',
    bio: 'Digital Marketing Specialist with focus on social media and SEO',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Google Ads', 'Analytics'],
    hourlyRate: 1800,
    location: 'Surat, India',
    portfolio: 'https://nehadesai.marketing'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (except admin if any)
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    console.log('Cleared existing sample users');

    // Hash passwords and create users
    const usersToCreate = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Display user info
    console.log('\n📋 Sample Users Created:');
    console.log('\n👔 EMPLOYERS:');
    createdUsers.filter(u => u.role === 'employer').forEach(user => {
      console.log(`  - ${user.name} (${user.companyName})`);
      console.log(`    Email: ${user.email}`);
      console.log(`    ID: ${user._id}`);
    });

    console.log('\n💼 FREELANCERS:');
    createdUsers.filter(u => u.role === 'freelancer').forEach(user => {
      console.log(`  - ${user.name}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Skills: ${user.skills.join(', ')}`);
      console.log(`    ID: ${user._id}`);
    });

    console.log('\n🔐 All passwords: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
