# User Authentication with Passport.js (Local Strategy) and Session Management

This project implements a simple user authentication system using **Passport.js** with **Local Strategy**. It supports user registration, login, and session management with MongoDB as the database. The application handles login and registration with validation, prevents duplicate users, and allows auto-logout after inactivity.

## Prerequisites

Before running this project, ensure the following are installed on your system:

- **Node.js**: [Download here](https://nodejs.org/)
- **MongoDB**: [Download here](https://www.mongodb.com/)

## Setup Instructions

### 1. Install dependencies

After cloning or downloading the repository, navigate to the project folder and run:

```bash
npm install
```

This will install all the required dependencies listed in `package.json`.

### 2. MongoDB Configuration

Ensure that MongoDB is installed and running on your local machine or a remote server. 

Update the MongoDB URL in `app.js` to point to your MongoDB instance. Modify the line:

```js
const mongoURI = 'your_mongodb_url_here';
```

### 3. Running the Application

After installing dependencies and configuring MongoDB, you can start the application by running:

```bash
npm run
```

### 4. Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

This will display the login page.

---

## Features

### 1. User Login
- **Route:** `localhost:3000/login`
- Authenticates username and password with existing records in MongoDB.
- Session management: After successful login, the session is created, and the user is redirected to a welcome page.
- **Auto Logout:** If there is no activity for 10 seconds, the user is automatically logged out. Users can also manually log out via the logout button.

### 2. User Signup
- **Route:** `localhost:3000/signup`
- Allows new user registration if the username doesn't already exist in MongoDB.
- Validates the following fields before creating a new user:
  - **Username**: Must contain only alphabets and spaces.
  - **Email**: Must follow the standard email format.
  - **Phone**: Must contain only numbers.
  - **Address**: Can include spaces, commas, and hyphens, but no special characters.
- Passwords are hashed and salted before being stored in the database for security.
- Prevents duplicate registrations by checking if a user already exists.

### 3. Logout
- **Route:** `localhost:3000/logout`
- Users can only access this route if logged in.
- Users are logged out either manually by clicking the logout button or automatically after inactivity.

### 4. Form Validation
- Registration form validates all fields on the client side and ensures the user meets the required criteria before saving the data to the database.

---

## File Structure

```
.
├── app.js                  # Main application file (sets up the server, routing, and passport config)
├── models
│   └── account.js          # MongoDB user schema and model
├── package.json            # Project dependencies
├── package-lock.json       # Dependency lock file
├── public
│   └── index.css           # CSS file for styling the views
├── views
│   ├── error.ejs           # Error page view
│   ├── login.ejs           # Login page view
│   ├── signup.ejs          # Signup page view
│   └── welcome.ejs         # Welcome page (post-login)
└── README.md               # Project readme file
```

---

## How it Works

1. **User Login**: If the user credentials match those in the MongoDB database, the user is successfully logged in, and a session is created.
2. **Session Management**: Sessions are managed using the `express-session` library. Sessions will automatically expire after 10 seconds of inactivity or when the user manually logs out.
3. **Form Validation**: Ensures that all fields are correctly formatted before data is submitted to the server. Passwords are hashed using bcrypt before being saved to the database.

---

## Routes

- `/login`: User login page.
- `/signup`: User registration page.
- `/logout`: Logs out the user and destroys the session.
- `/welcome`: Welcome page displayed after a successful login.

---

## Notes

- You need to have **MongoDB** installed and running on your system.
- Ensure that you update the MongoDB URL in `app.js` to reflect your MongoDB connection details.
- The application prevents multiple user registrations, ensuring no duplicates exist in the database.
- The session automatically logs out users after 10 seconds of inactivity.
