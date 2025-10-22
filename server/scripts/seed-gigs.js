require('dotenv').config();
const mongoose = require('mongoose');
const Gig = require('../models/Gig');

const sampleGigs = require('../utils/sample-gigs.json');

async function run() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/careerverse';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  await Gig.deleteMany({ source: 'seed' });
  const inserted = await Gig.insertMany(sampleGigs);
  console.log(`Seeded ${inserted.length} gigs`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});




