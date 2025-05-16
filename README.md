# EduFlow Learning Management System

## 🚀 Overview
EduFlow is a modern learning management platform built with Spring Boot and React, designed to provide an intuitive and engaging educational experience.

## ✨ Key Features
- **Post Management**: Create and manage educational content
- **Media Support**: Upload and manage images and videos
- **User Interactions**: Follow system and social learning features
- **Progress Tracking**: Monitor learning achievements
- **Real-time Notifications**: Stay updated with learning activities

## 🛠 Tech Stack
- **Frontend**: React 18+
- **Backend**: Spring Boot 3.x
- **Database**: MongoDB
- **UI Components**: Lucide React Icons
- **Styling**: Custom CSS modules

## 📋 Prerequisites
- Node.js (v16 or higher)
- Java JDK 17+
- MongoDB 6.0+
- Maven 3.8+

## ⚡ Quick Start

### Backend Setup
```bash
# Start MongoDB
brew services start mongodb-community

# Run Spring Boot application
cd backend
./mvnw spring-boot:run
```

### Frontend Setup
```bash
# Install dependencies and start React app
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

### Learning System
```
GET    /learningSystem          # Fetch all learning posts
GET    /learningSystem/{id}     # Get specific learning post
DELETE /learningSystem/{id}     # Remove learning post
```

### Post Management
```
GET    /posts                   # List all posts
POST   /posts                   # Create new post
PUT    /posts/{postId}          # Update existing post
DELETE /posts/{postId}          # Delete post
DELETE /posts/{postId}/media    # Remove media from post
```

### User Management
```
GET    /user/{userID}           # Get user profile
PUT    /user/{userID}/follow    # Follow user
PUT    /user/{userID}/unfollow  # Unfollow user
GET    /user/{userID}/followedUsers  # Get followed users
```

## 🎨 UI Components
The application features a modern, responsive design with:
- Clean and intuitive user interface
- Responsive layouts
- Dark blue (#183B4E) and gold (#DDA853) accent colors
- Interactive media management
- Loading states and animations

## 🔧 Development

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8080
MONGODB_URI=mongodb://localhost:27017/eduflow
```

### Running Tests
```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test
```

## 📝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License.

## 👥 Authors
- Initial work - [Your Name]
- See also the list of [contributors](https://github.com/yourusername/eduflow/contributors)
