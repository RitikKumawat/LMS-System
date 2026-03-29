const Redis = require('ioredis');
const mongoose = require('mongoose');
const r = new Redis({ host: 'localhost', port: 6379, password: 'redis_pass' });

async function main() {
  // Connect to MongoDB  
  await mongoose.connect('mongodb://ritik:ritik12345@ac-tav2how-shard-00-00.w9azrsu.mongodb.net:27017,ac-tav2how-shard-00-01.w9azrsu.mongodb.net:27017,ac-tav2how-shard-00-02.w9azrsu.mongodb.net:27017/lms?ssl=true&authSource=admin&retryWrites=true&w=majority');
  
  const db = mongoose.connection.db;
  
  // Check enrollment user_id
  const enrollment = await db.collection('enrollments').findOne({ user_id: new mongoose.Types.ObjectId('6921e3bd4b7a1e2063d08bc0') });
  console.log('enrollment lookup with padded id:', enrollment ? 'found' : 'not found');
  
  // Find the actual enrollment
  const enrollments = await db.collection('enrollments').find({}).limit(5).toArray();
  for (const e of enrollments) {
    const uid = e.user_id.toString();
    console.log('enrollment user_id:', uid, 'len:', uid.length, 'course_id:', e.course_id.toString());
  }
  
  // Check pending certificates
  const certs = await db.collection('certificates').find({ status: 'pending' }).toArray();
  console.log('\nPending certificates:', certs.length);
  for (const c of certs) {
    console.log('  cert:', c._id.toString(), 'user:', c.user_id.toString(), '(len:', c.user_id.toString().length, ') course:', c.course_id.toString());
  }
  
  await mongoose.disconnect();
  r.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
