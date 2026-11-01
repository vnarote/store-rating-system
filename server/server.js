const env = require('./src/config/environment');
const app = require('./src/app');
const { sequelize } = require('./src/models');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established');
    app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}/api`));
  } catch (error) {
    console.log(error.message);
    
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

start();
