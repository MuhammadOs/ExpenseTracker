const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.log("Error connecting to MongoDb", err);
    process.exit(1);
  }
};

module.exports = connectDB;
