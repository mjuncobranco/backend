const express = require("express");
const ContactController = require("../controllers/Contact");
const router = express.Router();
const check = require("../middlewares/auth");

router.post("/message", ContactController.createContact);
router.get("/message", check.auth, ContactController.getContacts)
module.exports = router;