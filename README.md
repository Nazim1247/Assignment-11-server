## Web side Name:

# Online Tutor Booking Platform

## Live Site Link:

### https://assignment-11-6b184.web.app/

## Backend (Server)

### Features
- Secure API endpoints for tutor data and user authentication.
- JWT-based authentication.
- MongoDB for data storage.
- Handles review counts and tutor filtering based on categories.

### Technologies Used
- Node.js
- Express.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add `.env` file with the following:
   ```env
   PORT=5000
   MONGO_URI=<your-mongo-connection-string>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. API will run at:
   ```
   http://localhost:5000