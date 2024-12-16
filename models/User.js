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
      enum: ["user", "admin"],
      default: "user"
    },
    avatar: {
      type: String,
      default: "https://fastly.picsum.photos/id/482/200/300.jpg?hmac=sZqH9D718kRNYORntdoWP-EehCC83NaK3M-KTWvABIg",
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
