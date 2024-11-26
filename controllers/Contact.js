const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const contact = new Contact({ name, email, message });

    const savedContact = await contact.save();

    res.status(201).json({
      status: "success",
      data: savedContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
// admin access only
const getContacts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only.",
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { createContact, getContacts };
