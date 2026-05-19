const Message = require("./models/Message");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

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

app.post("/message", async (req, res) => {

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