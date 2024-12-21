# Restaurant Reservation Server

A robust Node.js backend server for the Restaurant Reservation Platform, built with Express.js and MongoDB. This server handles all reservation management, authentication, and administrative operations.

## 🌐 Live Server
Server is hosted at: https://reservationappserver.onrender.com

## 👥 Project Team
- Xoli Nxiweni (xolinxiweni@gmail.com)
- Asiphile Mthethwa (asiphilemthethwa@gmail.com)

## 🌟 Features

### Core Functionality
- User authentication and authorization
- Restaurant management
- Reservation handling
- Payment processing
- Push notifications
- Analytics and reporting
- Review and rating system

### API Endpoints

#### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/admin/login
GET /api/auth/verify
```

#### Reservations
```
GET /api/reservations
POST /api/reservations
PUT /api/reservations/:id
DELETE /api/reservations/:id
```

#### Restaurants
```
GET /api/restaurants
GET /api/restaurants/:id
POST /api/restaurants
PUT /api/restaurants/:id
DELETE /api/restaurants/:id
```

#### Admin Operations
```
GET /api/admin/dashboard
GET /api/admin/analytics
POST /api/admin/settings
```

## 🛠 Technology Stack

### Core Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose

### Security
- JWT for authentication
- bcrypt for password hashing
- cors for resource sharing
- helmet for HTTP security

### Additional Tools
- nodemailer for email notifications
- stripe for payment processing
- socket.io for real-time updates
- winston for logging

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/Xoli-Nxiweni/ReservationAppServer
cd ReservationAppServer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_uri

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Push Notifications
PUSH_NOTIFICATION_KEY=your_push_notification_key
```

## 📁 Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── app.js         # App entry point
```

## 🔍 API Documentation

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "error": string | null
}
```

### Error Handling
The server implements centralized error handling with custom error classes:
- `BadRequestError`
- `UnauthorizedError`
- `NotFoundError`
- `ValidationError`

## 🔒 Security Measures

- JWT authentication
- Request rate limiting
- Input validation and sanitization
- XSS protection
- Security headers
- CORS configuration
- Password hashing
- MongoDB injection prevention

## 📊 Logging and Monitoring

- Winston logger implementation
- Error tracking
- Performance monitoring
- API usage metrics
- Database query logging

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Auth"

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Deployment Steps
1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Start the server:
```bash
npm start
```

### Deployment Considerations
- Enable SSL/TLS
- Set up proper MongoDB indexes
- Configure proper logging
- Set up monitoring
- Enable rate limiting
- Configure CORS properly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Rate limiting may need adjustment for production scale
- Some endpoints need additional optimization for large datasets
- Webhook handling needs retry mechanism

## 🆘 Support

For support and queries, please contact:
- xolinxiweni@gmail.com
- asiphilemthethwa@gmail.com
