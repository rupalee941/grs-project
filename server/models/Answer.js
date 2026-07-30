const mongoose = require('mongoose');

const answerSchema = mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      // default: 'Anonymous',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    answer: {
      type: String,
      required: true,
    },
    status:{
        type:String,
        required:true,
        enum:['active','inactive','delete']
    }
  },
  { timestamps: true }
);

// const forumTopicSchema = mongoose.Schema(
//   {
//     question: {
//       type: String,
//       required: true,
//     },
//     postedByName: {
//       type: String,
//       required: false,
//       default: 'Anonymous',
//     },
//     postedByEmail: {
//       type: String,
//       required: false,
//     },
//     category: {
//       type: String,
//       required: false,
//     },
//     answers: [answerSchema],
//   },
//   { timestamps: true }
// );

module.exports = mongoose.model('Answer', answerSchema);
