const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: false,
  },
  person: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  lucky: {
    type: String,
    required: false,
  },
  table: {
    type: String,
    required: false,
  },
  checkInTime: {
    type: Date,
  },
});

const attendeeSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: false,
  },
  person: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  lucky: {
    type: String,
    required: false,
  },
  table: {
    type: String,
    required: false,
  },
  checkInTime: {
    type: Date,
  },
});

attendeeSchema.pre("save", function (next) {
  if (!this.checkInTime) {
    this.checkInTime = new Date();
  }
  next();
});

const Attendee = mongoose.model("Attendee", attendeeSchema);
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = {
  Attendee,
  Registration,
};
