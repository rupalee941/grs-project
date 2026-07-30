const express = require('express');
const routes = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail')


//use api for registration
routes.post('/register', async (req, res) => {
  try{
    const {
      name,
      father,
      email,
      mobile,
      gender,
      dob,
      password,
      sessionId,
      collegeId,
      course,
      enrollment,
      address

    }=req.body

    if(!name || !father || !email || !mobile || !gender || !dob|| !password || !sessionId || !collegeId || !course || !enrollment || !address){
      return res.status(400).json({success:false, msg:"All fields are required"})
    }
    const isExist = await User.findOne({email:email.trim().toLowerCase()})
     if (isExist){
      return res.status(409).json ({success:false, msg:"Email already registered"})
     }
     const isEnroll = await User.findOne({enrollment:enrollment.trim()})
     if(isEnroll){
      return res.status(409).json({success:false, msg:"Enrollment already registered"})
     }
   const user = new User({
    name:name.trim(),
    father:father.trim(),
    email:email.trim().toLowerCase(),
    mobile:mobile.trim(),
    gender:gender,
    dob:dob,
    password:password,
    sessionId:sessionId,
    collegeId:collegeId,
    course :course,
    enrollment:enrollment.trim(),
    address:address.trim(),
    status:'active'
   })
   await user.save();
    res.status(201).json({
    success:true,
    msg:"User registered successfully",
    user:{
      id:user._id,
      name:user.name,
      email:user.email,
      mobile:user.mobile,
      status:user.status
    }
   })
   const msg = `Dear ${name} you are registered successfully on grievance redressal portal of LNMU . 
  Thank You
   `;
   setTimeout(()=>{
    sendEmail(email,'Registration at Grievance Redressal System of LNMU',msg)
   },100)

  } catch (error) {
    console.error(error);
    return res.status(500).json({success:false, msg: 'Server error' });


  }
});

// User Login API
routes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, msg: "Incorrect password" });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, msg: "Your account is not active" });
    }

    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

// Change user password
routes.patch('/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, msg: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, msg: 'New password and confirm password do not match' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ success: false, msg: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, msg: 'Password updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Admin API for students view
routes.get('/user', async (req, res) => {
  try {
    const data = await User.find({ status: { $in: ['active', 'inactive'] } })
      .populate('collegeId')
      .populate('sessionId');
    return res.json({ msg: "Users fetched successfully", user: data });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: "Server error" });
  }
});

routes.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({ msg: 'status updated', user });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: 'Server error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: 'delete' }, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({ msg: 'User deleted' });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = routes;
