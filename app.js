const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 5005;

app.use(bodyParser.json());

// Corrected require paths and variable names
const dashboardRoute = require("./routes/dashboarddatabase");

// Using the appropriate variables for each route
app.use("/dashboarddatabase", dashboardRoute);

// Serving static files
app.use(express.static("public"));

// Starting the server
app.listen(port, () => {
  console.log(`Server successful, listening on port ${port}`);
});
