const express = require('express')
const routes = express.Router();
const Admin = require('../models/Admin') 
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const College = require('../models/College')
const Complaint = require('../models/Complaint')
//admin register code
routes.post('/register',async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        //check admin exist or not
        const isExist = await Admin.countDocuments();
        if(isExist>0){
            return res.json({"msg":"Admin already register"})
        }
        //check
        const user = await Admin.findOne({email:email})
        if(user){
            return res.json({"msg":"Email already Register"})
        }
        const a = await new Admin(req.body);
        a.save();
        res.json({"msg":"Admin Registered Successfully"})
    }catch(er){
        console.log(er);
        console.log({"msg":"Admin Not Register Successfully"})
    }
})

routes.post('/login', async(req,res)=>{
    try{
        const {email , password} = req.body;
        if(!email){
            return res.json({"msg":"Email not enterd"})
        }

        const user = await Admin.findOne({email:email})
        if(!user){
            return res.json({"msg":"Email Not Found"})
        }

        if (user.password === password) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{'expiresIn':'1D'})
            res.json({
                "msg":"success",
                "adminId":"user_id",
                "name":user.name,
                "token":token
            })
        }else{
            return res.json({"msg":"password is incorrect"})
        }
    }catch(er){
        console.log(er);
        res.json({"msg":"Server error"})
    }
})

routes.get('/dashboard-stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ status: { $ne: 'delete' } });
        const loggedInUsers = await User.countDocuments({ loginCount: { $gt: 0 }, status: { $ne: 'delete' } });
        const blockedUsers = await User.countDocuments({ status: 'inactive' });
        const totalColleges = await College.countDocuments({ status: { $ne: 'delete' } });
        const notProcessed = await Complaint.countDocuments({ status: 'not-processed' });
        const pending = await Complaint.countDocuments({ status: 'pending' });
        const closed = await Complaint.countDocuments({ status: 'closed' });

        return res.json({
            success: true,
            stats: {
                totalUsers,
                loggedInUsers,
                blockedUsers,
                totalColleges,
                notProcessed,
                pending,
                closed
            }
        });
    } catch (er) {
        console.error(er);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});

module.exports = routes;
