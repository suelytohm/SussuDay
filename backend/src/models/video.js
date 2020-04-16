const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId,
  url: String
});

module.exports = mongoose.model('Video', videoSchema);
