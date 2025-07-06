import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  label: String,
  correct: Boolean,
  explanation: String
}, { _id: false });

const questionSchema = new mongoose.Schema({
  prompt: String,
  type: { type: String, enum: ['single', 'multiple', 'code'] },
  options: [optionSchema],
  expectedCode: String, // only for code questions
  explanation: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Question', questionSchema);