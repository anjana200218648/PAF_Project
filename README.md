# EduFlow - Learning Management System

## Overview
EduFlow is a modern learning management system built with Spring Boot and React. It provides an interactive platform for creating, managing, and sharing educational content with features like media uploads, user interactions, and learning progress tracking.

## Features
- 📝 Post Management
- 🎥 Multimedia Content Support
- 👥 User Management
- 📊 Learning Progress Tracking
- 🔔 Real-time Notifications
- 🎯 Interactive Learning System

## Tech Stack
- **Frontend**: React.js
- **Backend**: Spring Boot
- **Database**: MongoDB
- **Dependencies**:
  - Node.js (v16+)
  - Java (v17+)
  - Maven
  - MongoDB

## Getting Started

### Prerequisites
```bash
# Install MongoDB
brew install mongodb-community
brew services start mongodb-community

# Install Node.js (if not installed)
brew install node
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/EduFlow.git
cd EduFlow
```

2. **Backend Setup**
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on http://localhost:8080

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```
The frontend will start on http://localhost:3000

## API Endpoints

### Learning System
- `GET /learningSystem` - Get all learning posts
- `GET /learningSystem/{id}` - Get specific learning post
- `DELETE /learningSystem/{id}` - Delete learning post

### Post Management
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `PUT /posts/{postId}` - Update post
- `DELETE /posts/{postId}` - Delete post

### User Management
- `GET /user/{userID}` - Get user profile
- `PUT /user/{userID}/follow` - Follow user
- `PUT /user/{userID}/unfollow` - Unfollow user

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.