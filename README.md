# Practice-AI: Advanced AI-Powered Programming Quiz Platform

A comprehensive, intelligent quiz application that leverages cutting-edge AI to generate programming language quizzes with multi-language support, built with Vue.js frontend and Node.js backend.

## 🚀 Latest Features & Enhancements

### 🌐 Multi-Language AI Support
- **Language Detection**: Automatically detects and preserves conversation language (Thai, Chinese, Japanese, English)
- **Localized Quiz Generation**: AI maintains original language when generating quizzes from chat conversations
- **Cultural Context**: AI understands and respects linguistic nuances in different languages

### 🤖 Advanced AI Integration
- **Conversational Quiz Creation**: Chat with AI to generate quizzes without file uploads
- **Smart Content Analysis**: AI extracts quiz content from both uploaded files and chat conversations
- **Context-Aware Generation**: AI remembers conversation context for better question generation
- **Code Template Generation**: AI creates language-specific boilerplate code with proper imports

### 👥 Enhanced User Management
- **Complete User Profiles**: First name, last name, and username registration
- **Role-Based Access Control**: Secure admin and user role management
- **Beautiful Modal Confirmations**: Professional UI for critical admin actions
- **Persistent Authentication**: Login state maintained across browser sessions

### 📝 Advanced Quiz Management
- **Full CRUD Operations**: Create, read, update, delete quizzes with proper authorization
- **AI-Powered Editing**: Add AI-generated questions to existing quizzes
- **Interactive Chat Interface**: Wider, responsive chat screen for better conversations
- **Code Question Optimization**: Pre-filled templates with language-specific imports

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** with Composition API
- **Vue Router 4** for navigation
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini 2.5-Flash** for AI generation
- **VM2** for secure code execution
- **JWT** authentication with bcrypt
- **Multer** for file uploads

### AI & Processing
- **Google Gemini API** for quiz generation
- **Language Detection** for multi-language support
- **File Processing** (PDF, images, documents)
- **Code Execution Sandbox** with VM2

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Quick Start
```bash
# Clone repository
https://github.com/SUPAKORN-THV/superai2025.git
cd practice-ai

# Install dependencies for concurrent process
npm run init

# Start development servers
npm run dev
```

### Detailed Setup

#### Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
```

#### Environment Variables (.env)
```env
MONGODB_URI=mongodb://localhost:27017/practice-ai
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
SSL_ENABLED=false
SSL_CERT_PATH=./ssl/certificate.pem
SSL_KEY_PATH=./ssl/private-key.pem
PUBLIC_URL=https://your-domain.com
```

#### Frontend Configuration
```bash
cd frontend
npm install
cp .env.example .env
```

#### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:3001
```
#### Docker Creation
```bash
docker build -t practice-ai:latest . 
docker save -o practice-ai.docker practice-ai:latest
```
#### Docker Loader
```bash
docker load -i practice-ai.docker
```
#### Docker Run
```bash
docker run -p 5173:5173 -p 3001:3001 --env-file .env practice-ai:latest
```

## 🎯 Core Features

### 🔐 Authentication & User Management
- **Secure Registration**: First name, last name, username, email, password
- **JWT Authentication**: Persistent login with automatic token refresh
- **Role Management**: User and admin roles with proper authorization
- **Profile Management**: Update user information and preferences

### 📚 Quiz Creation & Management
- **Multiple Creation Methods**:
  - Direct AI generation from topics
  - Conversational AI chat interface
  - Manual question creation
  - File upload with content extraction

- **Question Types**:
  - Single-choice questions
  - Multiple-choice questions
  - Free-text answers
  - Code challenges with templates

- **AI-Powered Features**:
  - Topic-based question generation
  - Language-specific code templates
  - Difficulty-appropriate content
  - Contextual explanations

### 🎮 Interactive Quiz Taking
- **Responsive Interface**: Mobile-first design with desktop optimization
- **Real-time Timer**: Visual progress tracking with time management
- **Code Execution**: Live code testing with VM2 sandbox
- **Instant Feedback**: Detailed explanations and performance insights

### 👨‍💼 Admin Dashboard
- **User Management**: 
  - View all users with search functionality
  - Grant/revoke admin privileges with confirmation modals
  - Delete users with double confirmation
  - Track user statistics and activity

- **Quiz Management**:
  - Edit any quiz in the system
  - Delete quizzes with impact warnings
  - Monitor quiz performance and attempts
  - Bulk operations for content management

- **System Analytics**:
  - Popular programming languages
  - User activity trends
  - Quiz performance metrics
  - System usage statistics

### 💬 AI Chat Interface
- **Expanded Chat Screen**: Wider interface for better conversation flow
- **File Upload Support**: Optional PDF, image, and document processing
- **Multi-language Conversations**: AI responds in user's preferred language
- **Context Preservation**: Maintains conversation history for better responses

## 🌍 Supported Programming Languages

### Code Execution & Templates
- **JavaScript**: Node.js environment with modern ES6+ features
- **Python**: Python 3.x with common libraries
- **Java**: Full Java environment with main class structure
- **C++**: GCC compiler with standard libraries (`#include <iostream>`)
- **HTML/CSS**: Web development fundamentals
- **SQL**: Database query and design concepts

### Language-Specific Features
- **Auto-imports**: Proper headers and imports for each language
- **Boilerplate Code**: Pre-filled templates with main functions
- **Syntax Highlighting**: Code editor with language-specific formatting
- **Error Handling**: Detailed compilation and runtime error messages

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - User registration with full profile
POST /api/auth/login        - User authentication
GET  /api/auth/me          - Get current user profile
```

### Quiz Management
```
GET    /api/quizzes         - List all quizzes with creator info
POST   /api/quizzes         - Create new quiz
GET    /api/quizzes/:id     - Get quiz details
GET    /api/quizzes/:id/edit - Get full quiz for editing
PUT    /api/quizzes/:id     - Update quiz (creator/admin only)
DELETE /api/quizzes/:id     - Delete quiz (creator/admin only)
POST   /api/quizzes/:id/attempt - Submit quiz attempt
```

### AI Integration
```
POST /api/ai/generate-quiz     - Generate quiz from topic
POST /api/ai/execute-code      - Execute code in sandbox
POST /api/ai/test-connection   - Test AI service status
```

### Chat System
```
POST   /api/chat/sessions                    - Create chat session
GET    /api/chat/sessions                    - Get user's sessions
POST   /api/chat/sessions/:id/messages      - Send message
POST   /api/chat/sessions/:id/generate-quiz - Generate quiz from chat
```

### Admin Operations
```
GET    /api/admin/stats           - System statistics
GET    /api/admin/users           - All users management
PUT    /api/admin/users/:id/role  - Update user role
DELETE /api/admin/users/:id       - Delete user
GET    /api/admin/quizzes         - All quizzes management
```

## 🏗️ Project Architecture

```
practice-ai/
├── backend/
│   ├── src/
│   │   ├── config/           # Database and app configuration
│   │   ├── models/           # MongoDB schemas
│   │   │   ├── User.js       # User model with profiles
│   │   │   ├── Quiz.js       # Quiz model with questions
│   │   │   ├── QuizAttempt.js # Quiz attempt tracking
│   │   │   └── ChatSession.js # AI chat sessions
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.js       # Authentication routes
│   │   │   ├── quizzes.js    # Quiz CRUD operations
│   │   │   ├── ai.js         # AI generation endpoints
│   │   │   ├── chat.js       # Chat system routes
│   │   │   └── admin.js      # Admin management
│   │   ├── services/         # Business logic
│   │   │   ├── aiChatService.js    # AI conversation handling
│   │   │   └── fileProcessor.js    # File upload processing
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.js       # JWT authentication
│   │   └── server.js         # Application entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   │   ├── layout/       # Navigation and footer
│   │   │   ├── chat/         # Chat interface components
│   │   │   └── ConfirmModal.vue # Admin confirmation modals
│   │   ├── views/            # Page components
│   │   │   ├── auth/         # Login and registration
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── Home.vue      # Landing page
│   │   │   ├── Dashboard.vue # User dashboard
│   │   │   ├── Quizzes.vue   # Quiz listing
│   │   │   ├── CreateQuiz.vue # Quiz creation
│   │   │   ├── EditQuiz.vue  # Quiz editing
│   │   │   └── TakeQuiz.vue  # Quiz taking interface
│   │   ├── stores/           # Pinia state management
│   │   │   └── auth.js       # Authentication state
│   │   ├── services/         # API communication
│   │   │   └── api.js        # Axios configuration
│   │   └── router/           # Vue Router configuration
│   └── package.json
├── vercel.json              # Deployment configuration
└── package.json            # Root package configuration
```

## 🔧 Development Workflow

### Local Development
```bash
# Start both frontend and backend
npm run dev

# Start individually
npm run dev:frontend  # Vue.js dev server on :5173
npm run dev:backend   # Express server on :3001
```

### Code Quality
```bash
# Run tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# The backend runs directly in production
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GEMINI_API_KEY
```

### Environment Configuration
Ensure all environment variables are properly set in your deployment platform:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GEMINI_API_KEY`: Google Gemini API key
- `FRONTEND_URL`: Frontend application URL

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Model validation and utility functions
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT token validation
- **AI Service Tests**: Gemini API integration

### Frontend Testing
- **Component Tests**: Vue component functionality
- **Store Tests**: Pinia state management
- **Router Tests**: Navigation and guards
- **E2E Tests**: Complete user workflows

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: User and admin permissions
- **Route Protection**: Frontend and backend guards

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Content sanitization
- **Rate Limiting**: API abuse prevention

### Code Execution Security
- **VM2 Sandbox**: Isolated code execution environment
- **Timeout Protection**: Prevents infinite loops
- **Resource Limits**: Memory and CPU constraints
- **Safe Imports**: Restricted library access

## 🌟 Advanced Features

### AI Capabilities
- **Context-Aware Generation**: Maintains conversation context
- **Multi-Language Support**: Detects and preserves user language
- **Code Template Generation**: Language-specific boilerplate
- **Difficulty Adaptation**: Adjusts content complexity

### User Experience
- **Responsive Design**: Mobile-first approach
- **Progressive Web App**: Offline capabilities
- **Real-time Updates**: Live quiz progress
- **Accessibility**: WCAG 2.1 compliance

### Performance Optimization
- **Lazy Loading**: Component and route splitting
- **Caching Strategy**: API response caching
- **Image Optimization**: Automatic compression
- **Bundle Optimization**: Tree shaking and minification

## 📈 Analytics & Monitoring

### User Analytics
- Quiz completion rates
- Performance trends
- Popular topics and languages
- User engagement metrics

### System Monitoring
- API response times
- Error tracking and logging
- Resource usage monitoring
- AI service performance

## 📄 License

This project is non-licensed.

## 🏛️ About

**Practice-AI** is developed by **Mahidol University** for Super AI Engineer Season 5 - Track AI Innovator
**Permission** to edit OR re-publish this repository is up to the development team.

### Development Team
- **Institution**: Mahidol University
- **Copyright**: © 2025 Mahidol University. All rights reserved.
- **Contact**: For support and inquiries, please contact the development team

### Acknowledgments
- Google Gemini API for advanced AI capabilities
- Vue.js and Node.js communities for excellent frameworks
- MongoDB for reliable data storage
- Vercel for seamless deployment platform
- All contributors and beta testers

---

**Practice-AI** - Empowering the next generation of programmers through intelligent, interactive learning experiences.