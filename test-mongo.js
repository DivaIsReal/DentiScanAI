const mongoose = require('mongoose');

const uri = "mongodb://ardimansyahhhh_db_user:EhT90uGNc1lSJoCF@ac-zjdkdb4-shard-00-00.sjg290o.mongodb.net:27017,ac-zjdkdb4-shard-00-01.sjg290o.mongodb.net:27017,ac-zjdkdb4-shard-00-02.sjg290o.mongodb.net:27017/dentiscan?ssl=true&replicaSet=atlas-yrppfr-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });