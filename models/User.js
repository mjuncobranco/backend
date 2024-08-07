const { Schema, model, mongoose } = require("mongoose");


const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    nick: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      default: "User"
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    favoriteMovies: [
      {type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      default: []
      }
    ],
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
