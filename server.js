const express = require("express");
const app = express();
app.use(express.json());

app.use("*", (req, res) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

const port = 3000 || process.env.PORT;
app.listen(port, console.log(`Server is running on port ${port}`));
