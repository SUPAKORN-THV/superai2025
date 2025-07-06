import fetch from 'node-fetch';
import fs from 'fs';

export const triggerOCR = async (filePath) => {
  const stream = fs.createReadStream(filePath);
  const res = await fetch(process.env.N8N_OCR_WORKFLOW_URL, {
    method: 'POST',
    body: stream,
    headers: { 'Content-Type': 'application/octet-stream' }
  });
  if (!res.ok) throw new Error('n8n OCR workflow failed');
  const data = await res.json();
  return data.text;
};