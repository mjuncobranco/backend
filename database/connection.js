const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery",true);

const connection= async() => {
  try {
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("You've successfully connected to db movie_app");
   
  } catch (error) {
    console.log(error);
    throw new Error("Unable to connect to db movie_app")
  }
}

module.exports = {connection}