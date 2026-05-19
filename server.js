const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Anonymous Thoughts Backend Running");
});

app.post("/message", (req, res) => {

    console.log(req.body);

    res.send("Message received");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});