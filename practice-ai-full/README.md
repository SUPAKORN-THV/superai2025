# AI-Driven Computer Language Quiz Application

A comprehensive quiz application that leverages AI to generate programming language quizzes, built with Vue.js frontend and Node.js backend, deployed on Vercel.

## 🚀 Features

### Frontend (Vue.js)
- **User Authentication**: Secure login and registration with JWT
- **Learner Dashboard**: Personal progress tracking, quiz history, and performance analytics
- **Admin Dashboard**: User and content management tools
- **Quiz Designer**: Upload lessons via chat and generate questions using LLM
- **Interactive Quiz Taking**: Support for single-choice, multiple-choice, and code questions
- **Detailed Results**: Scores, explanations, and improvement recommendations
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Backend (Node.js)
- **RESTful APIs**: Complete CRUD operations for users, quizzes, and attempts
- **AI Integration**: Google Gemini for quiz generation and content creation
- **Secure Code Execution**: VM2 sandbox for safe code testing
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Rate Limiting**: Protection against abuse and spam

### AI Features
- **Dynamic Quiz Generation**: AI-powered question creation based on topics
- **Code Validation**: Automated testing of user-submitted code
- **Personalized Feedback**: AI-generated explanations and improvement tips
- **Multi-language Support**: JavaScript, Python, Java, C++, HTML, CSS, SQL

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Vue Router, Pinia, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI**: Google Gemini API
- **Authentication**: JWT, bcryptjs
- **Code Execution**: VM2 sandbox
- **Deployment**: Vercel
- **Testing**: Jest, Vitest

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key

### Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/ai-quiz-app.git
cd ai-quiz-app
\`\`\`

### Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

### Environment Variables

#### Backend (.env)
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/ai-quiz-app
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
\`\`\`

#### Frontend (.env)
\`\`\`env
VITE_API_URL=http://localhost:3001
\`\`\`

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
\`\`\`bash
npm i -g vercel
\`\`\`

2. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

3. **Set Environment Variables**
\`\`\`bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GEMINI_API_KEY
\`\`\`

### Manual Deployment Steps

1. **Build Frontend**
\`\`\`bash
cd frontend
npm run build
\`\`\`

2. **Deploy Backend**
- Configure `vercel.json` for API routes
- Set environment variables in Vercel dashboard
- Deploy using `vercel --prod`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quiz Endpoints
- `GET /api/quizzes` - List all quizzes
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt

### AI Endpoints
- `POST /api/ai/generate-quiz` - Generate quiz using AI
- `POST /api/ai/execute-code` - Execute code in sandbox

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/quiz-attempts` - Get user's quiz history

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

## 🏗️ Project Structure

\`\`\`
ai-quiz-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   └── router/
│   ├── public/
│   └── package.json
├── vercel.json
└── README.md
\`\`\`

## 🔧 Development

### Running in Development Mode
\`\`\`bash
# Root directory - runs both frontend and backend
npm run dev

# Or separately
npm run dev:frontend
npm run dev:backend
\`\`\`

### Building for Production
\`\`\`bash
npm run build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Vercel for hosting and deployment
- Vue.js and Node.js communities
- All contributors and testers

## 📞 Support

For support, email support@yourapp.com or join our Slack channel.

## 🔮 Future Enhancements

- [ ] Real-time multiplayer quizzes
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with more AI models
- [ ] Gamification features
- [ ] Social learning features
- [ ] Advanced code execution environments
- [ ] Video explanations for questions
