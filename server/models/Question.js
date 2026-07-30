const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
  {
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    question: {
      type: String,
      required: false,
    },
    status:{
        type:String,
        required:true,
        enum:['active','inactive','delete'],
        default:"active"
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

module.exports = mongoose.model('Question',questionSchema);
