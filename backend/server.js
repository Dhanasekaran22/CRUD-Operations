const express = require('express');
const cors = require('cors');
const { createUser } = require('./endpoint operation');

const app = express();

//middleware
app.use(cors());
app.use(express.json()); 

// Endpoints
app.post('/user', createUser);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});