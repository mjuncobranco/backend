const { Schema, model} = require("mongoose");

const ContactSchema = Schema({
  name:{
    type: String,
    required: [true,"Name is required"],
  },
  email: {
    type: String,
    required: [ true, "Email is required"],
    match: [/.+@.+\..+/, "Invalid email address"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  
},  { timestamps: true });
module.exports= model("Contact", ContactSchema);