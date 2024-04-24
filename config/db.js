const mongoose = require('mongoose');

// MongoDB connection string
const dbURI = process.env.DBURI
 
mongoose.connect(dbURI)
  .then(() => console.log('Database is connected to MongoDB successfully'))
  .catch((error) => console.error('Connection error', error));



