import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Attempting to connect to MongoDB with URI: ${process.env.MONGODB_URI ? 'URI set' : 'URI not set'}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`[${new Date().toISOString()}] MongoDB Connected: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
