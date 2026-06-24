require('dotenv').config();

const app = require('./src/app');
const { logError } = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  err.isOperational = false;
  logError(err);
});

process.on('uncaughtException', (err) => {
  err.isOperational = false;
  logError(err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Workspace server running → http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
