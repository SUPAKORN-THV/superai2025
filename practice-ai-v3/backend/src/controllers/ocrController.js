import { triggerOCR } from '../services/ocrService.js';
import fs from 'fs';

export const ocrUpload = async (req, res) => {
  try {
    const text = await triggerOCR(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};