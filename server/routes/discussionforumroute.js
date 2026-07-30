const express = require('express');
const routes = express.Router();  
const Question = require('../models/Question');
const Answer =require('../models/Answer')

//for question register
routes.post('/question', async (req, res) => {
  try {
    const {userId, question } = req.body
    if(!userId || !question){
      return res.json({"msg":"All fields are required"})
    }
    const a = await new Question({
      userId:userId,
      question:question,
      status:'active'
    });
    await a.save();
    return res.json({"msg":"Question registered"})
  }catch(er){
    console.log(er);
    console.error("Server errror")
  }
})

// fetch all questions for admin api
routes.get("/show",async(req,res)=>{
     try{
      const data = await Question.find({status:{$in:['active','inactive']}}).populate('userId','name -_id')
      return res.json({"msg":"Data fetched","questions":data})
     }catch(er){
      console.log(er);
      return res.json({"msg":"Server Error"})

     }

})

routes.delete("/question/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: 'delete' },
      { new: true }
    );
    if (!question) return res.status(404).json({ msg: "Question not found" });

    await Answer.updateMany(
      { questionId: req.params.id, status: { $in: ['active', 'inactive'] } },
      { status: 'delete' }
    );

    return res.json({ msg: "Question and answers deleted" });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// answer api for any question
routes.post("/answer",async(req,res)=>{
  try{
    const {questionId, userId,answer}= req.body;
    if(!questionId || !userId || !answer){
      return res.json({'msg':"all fields are required"})

    }
    const data = await new Answer({
      questionId:questionId,
      userId:userId,
      answer:answer,
      status:'active'
    })
    await data.save();
    return res.json({msg:"Answer added"})
    }
    catch(er){
      console.log(er);
      return res.json({msg:"Server Error"})
    }
  
})

routes.patch("/answer/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) return res.status(400).json({ msg: "Invalid status" });
    const answer = await Answer.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', 'name -_id');
    if (!answer) return res.status(404).json({ msg: "Answer not found" });
    return res.json({ msg: "Answer status updated", answer });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: "Server Error" });
  }
});

routes.delete("/answer/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, { status: 'delete' }, { new: true });
    if (!answer) return res.status(404).json({ msg: "Answer not found" });
    return res.json({ msg: "Answer deleted" });
  } catch (er) {
    console.error(er);
    return res.status(500).json({ msg: "Server Error" });
  }
});
//fetch all answer by question id 
routes.get("/answer/:id",async(req,res)=>{
  try{
    const {id} = req.params;
    const data = await Answer.find({questionId:id}).populate
    ('questionId','question').populate('userId','name -_id')
    return res.json({msg:"data fetched",answer:data})
  
  }catch(er){
    console.log(er)
    return res.json({"msg":"Server Error"})
  }

})

// get all questions with answers populated
routes.get("/questions",async(req,res)=>{
  try{
    const questions = await Question.find({status:'active'}).populate('userId','name -_id');
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await Answer.find({questionId:q._id,status:{$in:['active','inactive']}}).populate('userId','name -_id');
        return {
          ...q.toObject(),
          answers: answers
        };
      })
    );
    return res.json({msg:"Data fetched",questions:questionsWithAnswers});
  }catch(er){
    console.log(er);
    return res.json({"msg":"Server Error"})
  }
})

// get discussion forum count for dashboard
routes.get("/count",async(req,res)=>{
  try{
    const totalQuestions = await Question.countDocuments({status:'active'});
    const totalAnswers = await Answer.countDocuments({status:'active'});
    return res.json({msg:"Count fetched",totalQuestions,totalAnswers});
  }catch(er){
    console.log(er);
    return res.json({"msg":"Server Error"})
  }
})


module.exports = routes
