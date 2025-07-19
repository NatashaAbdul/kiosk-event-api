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
    const { company, table, firstname, lastname, lucky, uid, email } = req.body;

    // Check for an existing registration with the same UID
let registration = await Registration.findOne({ company, firstname, email });

    if (registration) {
      // Update the existing registration with the new values
      registration.company = company;
      registration.table = table;
      registration.firstname = firstname;
      registration.lastname = lastname; //position
      registration.lucky = lucky;
      registration.email = email; //country


      await registration.save();

      return res.status(200).json({
        message: "Some duplicate(s) found. Please check participant(s).",
        registration
      });
    } else {
      // If no duplicate is found, create and save a new registration
      registration = new Registration({ company, table, firstname, lastname, lucky, uid, email });
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
    var uid = req.body.uid;
    let attendance = await Attendee.findOne({ uid });
    const attendee = new Attendee(req.body);

    if (!attendance) {
      await attendee.save();
    }
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
exports.getRegistrationByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required.' });
  }

  try {
    const registrants = await Registration.find({ email });

    if (registrants.length === 0) {
      return res.status(404).json({ message: 'No registrants found with that email.' });
    }

    // Group full employee objects by company
    const grouped = {};
    registrants.forEach((r) => {
      if (!grouped[r.company]) {
        grouped[r.company] = [];
      }
      grouped[r.company].push({
        name: r.firstname,
        position: r.lastname,
        company: r.company,
        table: r.table,
        country: r.email,
      });
    });

    // Format result
    const result = Object.entries(grouped).map(([company, employees]) => ({
      company,
      employees
    }));

    res.status(200).json(result);
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