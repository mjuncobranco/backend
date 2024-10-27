const { Schema, model} = require("mongoose");

const MovieSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actors: {
      type: String,
      required: true,
     
    },
    year:{
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
     
    },
    rating: {
      type: Number,
      required: true
    },
    trailer:{
      type: String,
      default: "https://www.youtube.com"
    },
    image: {
      type: String,
      default: "default.png",
    },
   
  },
  { timestamps: true
   
   }
);

module.exports = model("Movie", MovieSchema);
