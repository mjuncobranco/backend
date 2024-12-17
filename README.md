# MovieApp Backend
# Movie & User Management System

## Description
This project is a RESTful API developed using Node.js, Express, and MongoDB, designed to manage a database of movies, users, and contacts. It features user authentication, a role-based system (user/admin), and functionalities such as adding favorite movies, sending contact messages, and managing user information.

---

## Features
- **User Management**:
  - User registration and authentication with JWT tokens.
  - Roles: user and admin.
  - Update user settings & change avatar.
  - Admin can see all existing users and delete users' account.
- **Movie Management**:
  - Full CRUD operations for movies (only admins can create, update, or delete).
  - Retrieve movie details and a list of all movies including movie trailers.
- **Favorites**:
  - Users can add or remove movies from their favorites list.
- **Contact System**:
  - Users and guests can send messages through a contact form.
  - Admins can view all messages.

---

## Technologies
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer (for uploading avatars)

---

## Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/mjuncobranco/backend.git>
   cd <backend>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=<mongodb+srv://mongodb:mongodb@movieapp.irg57.mongodb.net/movieApp>
   JWT_SECRET=<CLAVE_SECRETA_DE_MOVIE_APP>
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will be available at `http://localhost:5000`.

---

## Endpoints

### **Movies**
- **GET** `/home/movies` - Retrieve all movies.
- **GET** `/home/movies/:id` - Retrieve details of a specific movie.
- **POST** `/home/movies/add_new_movie` - Add a new movie (admin only).
- **PATCH** `/home/movies/update_movie` - Update movie information (admin only).
- **DELETE** `/home/movies/remove_movie` - Delete a movie (admin only).

### **Users**
- **POST** `/register` - Register a new user.
- **POST** `/login` - Log in and retrieve a JWT token.
- **GET** `/auth/settings` - Retrieve authenticated user data.
- **PATCH** `/auth/settings` - Update user data.
- **POST** `/auth/settings/change-avatar` - Change user avatar.
- **GET** `/auth/users/list` - List all users (admin only).
- **DELETE** `/auth/settings/delete-user` - Delete user account (admin only).

### **Favorites**
- **GET** `/auth/favorites` - Retrieve a user's favorite movies.
- **POST** `/auth/favorites/:id` - Add a movie to favorites.
- **DELETE** `/auth/favorites/:id` - Remove a movie from favorites.

### **Contact Messages**
- **POST** `/message` - Send a contact message.
- **GET** `/message` - Retrieve all messages (admin only).

---

## Data Models using Mongoose

### **Movie**
```javascript
const { Schema, model } = require("mongoose");

const MovieSchema = Schema(
  {
    title: { type: String, required: true },
    director: { type: String, required: true },
    description: { type: String, required: true },
    actors: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    trailer: {
      type: String,
      default: "https://www.youtube.com",
    },
    image: {
      type: String,
      default: "default.png",
    },
  },
  { timestamps: true }
);

module.exports = model("Movie", MovieSchema);
```

### **User**
```javascript
const { Schema, model, mongoose } = require("mongoose");

const UserSchema = Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    nick: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default:
        "https://fastly.picsum.photos/id/482/200/300.jpg?hmac=sZqH9D718kRNYORntdoWP-EehCC83NaK3M-KTWvABIg",
    },
    favoriteMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
```

### **Contact Message**
```javascript
const { Schema, model } = require("mongoose");

const MovieSchema = Schema(
  {
    title: { type: String, required: true },
    director: { type: String, required: true },
    description: { type: String, required: true },
    actors: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    trailer: {
      type: String,
      default: "https://www.youtube.com",
    },
    image: {
      type: String,
      default: "default.png",
    },
  },
  { timestamps: true }
);

module.exports = model("Movie", MovieSchema);
```

---
## Helpers
### **`jwt.js`**
- Generates JWT token using user data & secret key.
### **`validateData.js`**
- Using Validator.js to validate user input fields.

## Middlewares

### **`auth.js`**
- Verifies the JWT token and grants access to protected routes.

### **`upload.js`**
- Handles file uploads (avatars).

---

## Testing
Test the routes using tools like Postman or Thunder Client. You can create your own user or admin account. Here's an admin account ready for you:

- Email: admin01@admin.com
- Password: Admin01!

1. **Registration and Authentication**:
   - Create a user.
   - Log in and obtain a JWT token.

2. **Movies**:
   - Retrieve the list of movies.
   - Create, update, and delete movies (as admin).

3. **Favorites**:
   - Add and remove movies from favorites.

4. **Messages**:
   - Send a contact message.
   - List messages (as admin).

5. **Future Enhancements**:
   - Create a Forum Page to share opinions & discuss movies.
   - Add pagination for movie and users lists.
   - Incorporate Node JS module NodeMailer to send    emails from server on register & login action.  

---

## Special thanks to
- Anton Hangano
- Ignacio Chicharro.
- Manuel Moraga Molina.
- Cristina Martin Muñoz
- Loli Murillo



---

## Author
Developed by [Melina Junco Branco].


###
