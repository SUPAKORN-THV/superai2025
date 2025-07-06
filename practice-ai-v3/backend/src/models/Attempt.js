import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  answer: mongoose.Schema.Types.Mixed,
  correct: Boolean,
  score: Number,
  feedback: String
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  startedAt: Date,
  endedAt: Date,
  totalScore: Number
});

export default mongoose.model('Attempt', attemptSchema);