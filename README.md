# Bharat Lancer - AI-Powered Freelance Platform for India 🇮🇳

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Bharat Lancer** is an India-first freelance platform that leverages AI to match freelancers with jobs, verify skills, and enable voice-based job posting for inclusive access.

## 🌟 Key Features

### 🎯 AI-Powered Matching
- **Smart Skill Matching**: Rule-based + embedding similarity algorithms
- **Match Explanations**: Transparent AI decisions showing why freelancers match
- **Real-time Scoring**: Skills, budget, location, and experience considered

### 🎤 Voice Job Input (Inclusive Innovation)
- **Voice-to-Text**: Employers can speak their job requirements
- **AI Parsing**: Automatically extracts skills, budget, duration, and location
- **Instant Matches**: Get top 3 freelancer matches immediately

### 🎓 AI Skill Passport
- **Skill Verification**: Don't trust self-declared skills
- **Weighted Scoring**: Projects (40%) + Portfolio (30%) + Resume (30%)
- **Auto-extraction**: Skills extracted from resumes and portfolios

### 💬 In-App Chat
- **Real-time Messaging**: Direct communication between employers and freelancers
- **File Sharing**: Upload files with watermarking support
- **Conversation History**: Track all communications

### 💳 Secure Payments
- **Razorpay Integration**: Test and production mode support
- **Payment Verification**: Cryptographic signature validation
- **File Access Control**: Unlock original files after payment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Razorpay Account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bharat-lancer.git
cd bharat-lancer
```

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
# Or update MONGODB_URI in .env
```

5. **Run the server**
```bash
npm start
# Server will run on http://localhost:5000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 🔐 Authentication
- `POST /auth/register` - Register new user (freelancer/employer)
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update user profile

#### 👤 Users
- `GET /users/skill-passport` - Get AI skill passport (freelancers only)
- `POST /users/skill-passport/update` - Recalculate skill scores
- `POST /users/extract-skills` - Extract skills from text

#### 💼 Jobs
- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/:id` - Get single job
- `POST /jobs` - Create job (employers only)
- `POST /jobs/voice` - Create job from voice transcript
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `GET /jobs/:id/matches` - Get AI-powered freelancer matches

#### 💬 Chat
- `POST /chat/send` - Send message
- `POST /chat/upload` - Upload file
- `GET /chat/conversations` - Get all conversations
- `GET /chat/:userId` - Get conversation with specific user
- `DELETE /chat/:id` - Delete message

#### 💳 Payments
- `POST /payments/create` - Create Razorpay order
- `POST /payments/verify` - Verify payment
- `GET /payments/user` - Get user's payment history
- `GET /payments/:id` - Get payment details
- `GET /payments/access/:jobId` - Check file access

## 🎬 Demo Flow

### 1. Employer Posts Job via Voice
```bash
POST /api/jobs/voice
{
  "transcript": "I need a Python developer from Chennai for 2 weeks, budget is 30000 rupees"
}
```

**Response**: Auto-created job + top 3 matches with explanations

### 2. View AI Matches
```bash
GET /api/jobs/{jobId}/matches
```

**Response**: Ranked freelancers with:
- Match score (0-100)
- Matched skills
- Explanation (e.g., "87% match: Python + Chennai + Budget fit")

### 3. Employer Chats with Freelancer
```bash
POST /api/chat/send
{
  "receiverId": "freelancer_id",
  "message": "Hi, I saw your profile. Are you available?"
}
```

### 4. Payment & File Unlock
```bash
# Create payment
POST /api/payments/create
{
  "jobId": "job_id",
  "freelancerId": "freelancer_id",
  "amount": 30000
}

# After Razorpay payment
POST /api/payments/verify
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

**Result**: Files unlocked, job status updated to "in-progress"

## 🏆 Hackathon Talking Points

### 🇮🇳 India-First Platform
- Voice input for accessibility (regional language support ready)
- Indian cities database for location matching
- Razorpay for Indian payment preferences
- INR currency default

### 🤖 AI Innovation
- **Skill Passport**: Verifies skills, doesn't trust self-declaration
- **Smart Matching**: Combines rule-based + AI algorithms
- **Voice Parsing**: NLP to extract structured data from speech
- **Transparent AI**: Explains why matches are suggested

### 🔒 Trust & Security
- JWT authentication with role-based access
- Payment verification with cryptographic signatures
- File watermarking (demo level)
- Access control based on payment status

### 📈 Scalability
- MongoDB for flexible schema
- Indexed queries for fast searches
- Modular service architecture
- Ready for microservices split

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Payments**: Razorpay
- **AI/ML**: Custom algorithms (skill extraction, matching)

## 📁 Project Structure

```
bharat-lancer/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Middleware & helpers
│   │   └── app.js           # Express app
│   ├── .env.example         # Environment template
│   └── package.json
└── README.md
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/ping
```

### Register Freelancer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "role": "freelancer",
    "name": "Ragul Kumar",
    "email": "ragul@example.com",
    "password": "password123",
    "location": "Chennai",
    "skills": ["Python", "Django", "React"],
    "hourlyRate": 1500
  }'
```

### Create Voice Job
```bash
curl -X POST http://localhost:5000/api/jobs/voice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "transcript": "I need a React developer from Bangalore for 3 weeks, budget is 50000 rupees"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/bharat-lancer |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `RAZORPAY_KEY_ID` | Razorpay key ID | (required for payments) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | (required for payments) |

## 🎯 Future Enhancements

- [ ] Real-time chat with Socket.io
- [ ] Advanced AI with OpenAI GPT integration
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile app (React Native)
- [ ] Video interviews
- [ ] Escrow payments
- [ ] Dispute resolution system
- [ ] Freelancer portfolio builder

## 👥 Team

- **Developer**: Ragul Kumar
- **Project**: Bharat Lancer
- **Year**: 2026

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Razorpay for payment gateway
- MongoDB for database
- Express.js community
- All open-source contributors

---

**Made with ❤️ for India's freelance community**