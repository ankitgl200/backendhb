const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://hbuser01:TPA@ekCBG9-2Cek@hostelbites.xxsasjf.mongodb.net/hostel-bites");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ DB Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;