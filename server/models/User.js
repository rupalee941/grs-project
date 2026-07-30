const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    father:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    sessionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Session",
        required:true
    },
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"College",
        required:true
    },
    course:{
        type:String,
        required:true
    },
    enrollment:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
   },
   password:{
       type:String,
       required:false
   },
   status:{
    type :String,
    required:true,
    enum:['active','inactive','delete'],
    default:'active'
   },
   loginCount:{
     type:Number,
     default:0
   },
   lastLogin:{
     type:Date,
   },
   profile:{
    type:String,
     
   }

},{
    timestamps:true

})
 module.exports = mongoose.model("User",userSchema)