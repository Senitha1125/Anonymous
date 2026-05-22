const Message = require("./models/Message");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const authMiddleware = require("./middleware/authMiddleware");

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Anonymous Backend Running");
});

app.post("/message",authMiddleware, async (req, res) => {

    try {

        const newMessage = new Message({
            message: req.body.message
        });

        await newMessage.save();

        res.send("Message saved successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error saving message");
    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/messages", authMiddleware, async (req, res) =>  {

    try {

        const messages = await Message.find();

        res.json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error fetching messages");
    }

});

app.delete("/message/:id", authMiddleware, async (req, res) => {

    try {

        if(req.user.username !== process.env.ADMIN_USERNAME) {

            return res.status(403).send("Access denied");

        }

        await Message.findByIdAndDelete(req.params.id);

        res.send("Message deleted successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error deleting message");
    }

});
app.post("/signup", async (req, res) => {

    try {

        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.send("User created successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Signup failed");
    }

});

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        const token = jwt.sign(

            {
   id: user._id,
   username: user.username
},

            process.env.JWT_SECRET,

            { expiresIn: "1d" }

        );

       res.json({

    token,

    username: user.username,

    isAdmin:
        user.username === process.env.ADMIN_USERNAME

});

    } catch (error) {

        console.log(error);

        res.status(500).send("Login failed");
    }

});