const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const users = require("./routes/api/users");
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/MAILME', {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongo DB database established successfully");
})

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

const UserRouter = require('./routes/users');
const MailRouter = require('./routes/mail');

app.use('/USERS', UserRouter);
app.use('/MAIL', MailRouter);

app.listen(port, () => {
    console.log(`Server running on port port ${port}`);
});