const mongoose = require("mongoose");

const optionSchema = mongoose.Schema({
  option: {
    type: String,
    required: false,
    default: ''
  },
  img: {
    type: String,
    required: false,
    default: ''
  },
  selectedInPoll: {
    type: Number,
    required: false,
    default: 0
  }
})

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
  options: {
    type: [optionSchema],
    required: true,
  },
  attempted: {
    type: Number,
    required: false,
    default: 0
  },
  answerCorrected: {
    type: Number,
    required: false,
    default: 0
  },
  answerIncorrectly: {
    type: Number,
    required: false,
    default: 0
  },
});

const quizSchema = mongoose.Schema(
  {
    quizName: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      required: true,
    },
    timer: {
      type: String,
      required: true,
      default: 'off'
    },
    createdBy: {
      type: String,
      required: true,
    },
    impression: {
      type: Number,
      required: false,
      default: 0,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
