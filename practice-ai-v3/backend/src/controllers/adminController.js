import Attempt from '../models/Attempt.js';

export const getStats = async (req, res) => {
  const attempts = await Attempt.find().populate('user');
  res.json(attempts);
};