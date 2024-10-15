const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Import CORS
const app = express();

require('dotenv').config();

// Enable CORS with default settings
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Define routes
app.use('/api', require('./src/Routes/Routes'));
app.use('/api/admin', require('./src/Routes/adminrRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
