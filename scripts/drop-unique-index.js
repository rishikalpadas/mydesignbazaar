import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function dropUniqueIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    const collection = db.collection('user_subscription_credits');

    // Get existing indexes
    console.log('\nCurrent indexes:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the unique index on userId if it exists
    try {
      await collection.dropIndex('userId_1');
      console.log('\n✅ Successfully dropped unique index on userId');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n✅ No unique index found on userId (already removed or never existed)');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }

    // Verify indexes after drop
    console.log('\nIndexes after drop:');
    const indexesAfter = await collection.indexes();
    console.log(JSON.stringify(indexesAfter, null, 2));

    // Check for any documents
    const count = await collection.countDocuments();
    console.log(`\nTotal documents in collection: ${count}`);

    if (count > 0) {
      const sample = await collection.find().limit(3).toArray();
      console.log('\nSample documents:');
      console.log(JSON.stringify(sample, null, 2));
    }

    await mongoose.connection.close();
    console.log('\n✅ Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

dropUniqueIndex();
