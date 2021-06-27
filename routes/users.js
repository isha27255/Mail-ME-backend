const express = require("express");
const router = express.Router();
let User=require('../models/user');

router.get("/", (req, res) => {
  User.find()
      .then(user => res.json(user))
      .catch(err => res.status(400).json("Error is " + err));
});

router.get("/:id", (req, res) => {
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json("Error is " + err));       
  });

router.post("/add", (req, res) => {
  
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    const new_user = new User({firstname, lastname, username, email, password});

    new_user.save()
        .then(() => res.json("User Added Successfully"))
        .catch(err => res.status(400).json("Error is " + err));       
});

module.exports = router;