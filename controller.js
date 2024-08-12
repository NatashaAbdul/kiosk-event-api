const { Attendee, Registration } = require("./model");
const axios = require("axios");

exports.createRegistration = async (req, res) => {
  // try {
  //   const registration = new Registration(req.body);
  //   await registration.save();
  //   res.status(201).json(registration);
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
  try {
    // Extract data from the request body
    const { company, table, person, lucky, uid } = req.body;

    // Check for an existing registration with the same UID
    let registration = await Registration.findOne({ uid });

    if (registration) {
      // Update the existing registration with the new values
      registration.company = company;
      registration.table = table;
      registration.person = person;
      registration.lucky = lucky;

      await registration.save();

      return res.status(200).json({
        message: "Some duplicate(s) found. Registration updated successfully. Please check participant(s).",
        registration
      });
    } else {
      // If no duplicate is found, create and save a new registration
      registration = new Registration({ company, table, person, lucky, uid });
      await registration.save();

      return res.status(201).json({
        message: "Registration created successfully.",
        registration
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAttendee = async (req, res) => {
  try {
    const attendee = new Attendee(req.body);
    await attendee.save();
    res.status(201).json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRegistration = async (req, res) => {
  try {
    const registration = await Registration.find();
    res.status(200).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.find();
    res.status(200).json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleRegistration = async (req, res) => {
  const API_URL = "https://kiosk-event-api.onrender.com/api/registration";

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const desiredUid = req.params.uid;
    const result = data.find((item) => item.uid === desiredUid);

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const { uid } = req.params;
    const registration = await Registration.findOneAndDelete({ uid });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteAttendee = async (req, res) => {
  try {
    const { uid } = req.params;
    const attendee = await Attendee.findOneAndDelete({ uid });

    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    res.status(200).json({ message: "Attendee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};