const express = require("express");
const router = express.Router();

// Load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Work" }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
    
});

module.exports = router;
