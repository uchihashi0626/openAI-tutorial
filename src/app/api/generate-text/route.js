// app/api/generate-text/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    // フロントから送られてくるJSON { userInput: "..." } を取得
    const { userInput } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 受け取った userInput をユーザーメッセージとしてセット
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 必要に応じてGPT-3.5等に変えてください
      messages: [
        { role: "system", content: `You are a helpful assistant.
  ` },
        { role: "user", content: userInput },
      ],
      // store: true, // 必要なら残す
    });

    return NextResponse.json({
      // モデルが生成したテキストを返す
      message: completion.choices[0].message,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
