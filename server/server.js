require('dotenv').config({ path: '../.env' });
const { serve } = require('@hono/node-server');
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync();
    console.log('Database models synchronized.');

    serve({
      fetch: app.fetch,
      port: PORT
    }, (info) => {
      console.log(`Server running on http://localhost:${info.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
