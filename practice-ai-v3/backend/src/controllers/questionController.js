import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import { triggerQuestionGeneration } from '../services/n8nService.js';
import evaluateCode from '../utils/evaluateCode.js';

export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const { lessonContent, numQuestions } = req.body;
    const questions = await triggerQuestionGeneration(lessonContent, numQuestions);
    const docs = await Question.insertMany(questions.map(q => ({ ...q, createdBy: req.user.id })));
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listQuestions = async (req, res) => {
  res.json(await Question.find());
};

export const evaluateAttempt = async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, answer}]
    const attempt = new Attempt({ user: req.user.id, startedAt: new Date(), answers: [] });
    let total = 0;

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      let correct = false;
      let score = 0;
      let feedback = '';

      if (question.type === 'single') {
        const correctOption = question.options.find(o => o.correct);
        correct = correctOption?.label === ans.answer;
        score = correct ? 1 : 0;
        feedback = correct ? '✅' : `❌ เฉลย: ${correctOption?.label}`;
      } else if (question.type === 'multiple') {
        const correctLabels = question.options.filter(o => o.correct).map(o => o.label).sort();
        const userLabels = ans.answer.sort();
        correct = JSON.stringify(correctLabels) === JSON.stringify(userLabels);
        score = correct ? 1 : 0;
        feedback = correct ? '✅' : `❌ เฉลย: ${correctLabels.join(', ')}`;
      } else if (question.type === 'code') {
        const { passed, output, expected } = await evaluateCode(ans.answer, question.expectedCode);
        correct = passed;
        score = correct ? 1 : 0;
        feedback = correct ? '✅' : `❌ Output: ${output}, Expected: ${expected}`;
      }

      attempt.answers.push({
        question: question._id,
        answer: ans.answer,
        correct,
        score,
        feedback
      });
      total += score;
    }

    attempt.endedAt = new Date();
    attempt.totalScore = total;
    await attempt.save();
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};