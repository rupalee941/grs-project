const express = require('express');
const routes = express.Router();
const Complaint = require('../models/Complaint');
const ComplaintType = require('../models/ComplaintType');
const User = require('../models/User');

routes.post('/register', async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      mobile,
      college,
      session,
      enrollmentNumber,
      complaintType,
      description,
    } = req.body;

    if (!userName || !userEmail || !complaintType || !description) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }

    const type = await ComplaintType.findById(complaintType);
    if (!type || type.status !== 'active') {
      return res.status(404).json({ success: false, msg: 'Complaint type not found or inactive' });
    }

    // Try to auto-populate academic details from the User profile if not provided
    let resolvedCollege = college;
    let resolvedSession = session;
    let resolvedEnrollmentNumber = enrollmentNumber;

    try {
      const user = await User.findOne({ email: userEmail.trim().toLowerCase() })
        .populate('collegeId')
        .populate('sessionId');
      
      if (user) {
        if (!resolvedCollege && user.collegeId) {
          resolvedCollege = user.collegeId.name;
        }
        if (!resolvedSession && user.sessionId) {
          resolvedSession = user.sessionId.name;
        }
        if (!resolvedEnrollmentNumber) {
          resolvedEnrollmentNumber = user.enrollment;
        }
      }
    } catch (dbErr) {
      console.error("Error auto-populating user data for complaint:", dbErr);
    }

    const complaint = new Complaint({
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      mobile,
      college: resolvedCollege,
      session: resolvedSession,
      enrollmentNumber: resolvedEnrollmentNumber,
      complaintType: type._id,
      complaintTypeName: type.name,
      description: description.trim(),
      status: 'not-processed',
    });

    await complaint.save();
    return res.status(201).json({
      success: true,
      msg: 'Complaint registered',
      complaint,
    });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

routes.get('/', async (req, res) => {
  try {
    const { status, email } = req.query;
    const filter = {};

    if (status) {
      if (status.includes(',')) {
        filter.status = { $in: status.split(',') };
      } else {
        filter.status = status;
      }
    }
    if (email) {
      filter.userEmail = email.trim().toLowerCase();
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return res.json({ msg: 'Data fetched', complaints });
  } catch (er) {
    console.error(er);
    return res.json({ msg: 'Server error' });
  }
});

routes.get('/show', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return res.json({ msg: 'Data fetched', complaints });
  } catch (er) {
    console.error(er);
    return res.json({ msg: 'Server error' });
  }
});

routes.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['not-processed', 'pending', 'closed'].includes(status)) {
      return res.json({ msg: 'Invalid status' });
    }

    await Complaint.findByIdAndUpdate(id, { status });
    return res.json({ msg: 'status updated' });
  } catch (er) {
    console.error(er);
    return res.json({ msg: 'Server error' });
  }
});

module.exports = routes;
