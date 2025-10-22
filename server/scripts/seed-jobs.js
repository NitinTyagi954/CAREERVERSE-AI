require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');

const sampleJobs = require('../utils/sample-jobs.json');

async function run() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/careerverse';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  await Job.deleteMany({ source: 'seed' });
  const inserted = await Job.insertMany(sampleJobs);
  console.log(`Seeded ${inserted.length} jobs`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});




