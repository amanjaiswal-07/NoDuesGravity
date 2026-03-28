require('dotenv').config();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  const app = require('./app');
  app.listen(PORT, () => {
    console.log(`✅ No Dues API running on port ${PORT}`);
  });
}

startServer();
