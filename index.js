//imports
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");
const path = require("path");

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

//importing routes from /route:
const UserRoutes = require("./routes/user");

const MovieRoutes = require("./routes/movie");

const ContactRoutes = require("./routes/contact");
// //using routes:
app.use("/api/users", UserRoutes);
app.use("/api", MovieRoutes);
app.use("/api/contact", ContactRoutes);

//get public avatars to display
app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public/avatars', imageName);
  res.sendFile(imagePath);
});

app.listen(process.env.PORT || 5000, ()=> {
  console.log(`Server running at port ${process.env.PORT}`);
});

