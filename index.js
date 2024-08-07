//imports
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

//testing working app
console.log("working");
//connecting db
connection();

//creating Node server
const app = express();

//config. cors
app.use(cors());

//changing body to json type
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//creating testing route:
app.get("/testing",(req, res)=> {
  console.log("testing route working");
  return res.status(200).json({
    status: "success",
    message: "Testing route working fine"
  })
});

app.listen(process.env.PORT || 5000, ()=> {
  console.log(`Server running at port ${process.env.PORT}`);
});

