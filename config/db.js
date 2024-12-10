import mongoose from 'mongoose';

const connectDB = async () => {
    const URI = process.env.MONGO_URI;
    try {
    await mongoose.connect(URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB connected successfully`);
    console.log(`🌐 Cluster: ${mongoose.connection.host}`);
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;