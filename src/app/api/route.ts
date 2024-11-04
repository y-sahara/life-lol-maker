// pages/api/convert.js (Next.jsの場合)
import Anthropic from '@anthropic-ai/sdk';
import { NextApiRequest, NextApiResponse } from 'next';
// ... existing code ...

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY // 環境変数から取得
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `以下の日常の一コマをユーモアのある表現に変換してください：${req.body.text}`
      }]
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}