const mongoose = require('mongoose');
// Gunakan path ke .env.local untuk membaca konfigurasi
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    // Log URI dengan sensor password untuk keamanan
    const uriForLog = process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
      'undefined';
    console.log('MongoDB URI (tersensor):', uriForLog);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI tidak ditemukan. Periksa file .env.local Anda');
    }
    
    // Coba terhubung ke MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Berhasil terhubung ke MongoDB!');
    
    // Coba buat dokumen test di collection users
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      location: String,
      favoritePlants: [String],
      profileImage: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.model('User', userSchema);
    
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      location: 'Jakarta',
      favoritePlants: ['Tomat', 'Cabai'],
      createdAt: new Date()
    });
    
    console.log('Berhasil membuat user test!');
    
    // Verifikasi
    const users = await User.find();
    console.log('Users dalam database:', users);
    
    // Coba buat collection lain untuk memastikan
    const postSchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      title: String,
      type: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const Post = mongoose.model('Post', postSchema);
    
    // Tambahkan post test
    await Post.create({
      userId: users[0]._id,
      title: 'Test Post',
      type: 'seed',
      createdAt: new Date()
    });
    
    console.log('Berhasil membuat post test!');
    
    // Verifikasi collections yang terbuat
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections dalam database:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('Error koneksi MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Koneksi ditutup');
  }
}

testConnection();