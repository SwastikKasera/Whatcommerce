import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://127.0.0.1:27017/whatsapp";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function ConnectMongo(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log("mongodb connected");
    
    return cached.conn;
}

if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
        bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log("mongodb connected promise");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default ConnectMongo;