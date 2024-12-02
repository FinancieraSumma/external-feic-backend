const mongoose = require('mongoose');

// Load the database configuration
const summaConfig = require('../../config/database.config.json');

// Build the connection string based on the configuration
const summaConnectionString = `mongodb://${summaConfig.servidor}:${summaConfig.puerto}/${summaConfig.base}`;

// Create a new connection instance
const summaConnection = mongoose.createConnection(summaConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection event handlers (optional but useful for debugging)
summaConnection.on('connected', () => {
  console.log(`Connected to MongoDB database: ${summaConfig.base}`);
});

summaConnection.on('error', (err) => {
  console.error(`Error connecting to MongoDB database: ${summaConfig.base}`, err);
});

module.exports = summaConnection;