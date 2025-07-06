import fetch from 'node-fetch';

export const triggerQuestionGeneration = async (lessonContent, numQuestions = 5) => {
  const response = await fetch(process.env.N8N_QUESTION_WORKFLOW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonContent, numQuestions })
  });

  if (!response.ok) throw new Error('n8n workflow failed');
  return await response.json(); // expected array of {prompt, type, options, expectedCode, explanation}
};