const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },

  day: {
    type: Number,
    required: true
  },

  visits: {
    type: Number,
    required: true
  }
});

const traffic = mongoose.model("Traffic", trafficSchema);
module.exports = traffic;
