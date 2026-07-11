const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.use(authMiddleware); 

router.post('/suggest', async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          },
          required: ['description', 'priority'],
        },
      },
    });

    const prompt = `You are helping fill out a task in a task manager app.
The user gave this rough task title: "${title}"

Generate:
1. A clear, professional 1-2 sentence description expanding on what this task likely involves.
2. A sensible priority level: Low, Medium, or High, based on how the title reads (e.g. "bug", "urgent", "crash" suggest higher priority; "cleanup", "minor", "docs" suggest lower).

Respond only in the JSON format defined by the schema.`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    res.status(200).json({
      description: parsed.description,
      priority: parsed.priority,
    });
  } catch (error) {
    console.error('AI suggestion error:', error.message);
    res.status(500).json({ message: 'Failed to generate AI suggestion' });
  }
});

module.exports = router;