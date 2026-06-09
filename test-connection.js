require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to:', mongoose.connection.host);
    console.log('✓ Database:', mongoose.connection.name);
    await mongoose.disconnect();
    console.log('✓ Done');
  } catch (err) {
    console.log('✗ Error:', err.message);
  }
  process.exit();
}
test();
