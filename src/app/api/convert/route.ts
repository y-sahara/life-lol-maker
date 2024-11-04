// app/api/convert/route.ts

import { NextResponse } from "next/server";
import LlamaAI from "llamaai";

interface RequestBody {
  text: string;
}
const apiToken = `${process.env.LLAMA_API_TOKEN}`;
// LlamaAI クライアントの初期化
const llamaAPI = new LlamaAI(apiToken);

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    if (!body.text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiRequestJson = {
      messages: [
        {
          role: "system",
          content:
            "あなたはユーモアのセンスがある作家です。日常の出来事を面白おかしく表現することが得意です。",
        },
        {
          role: "user",
          content: `以下の日常の一コマをユーモアのある表現に変換してください：${body.text}`,
        },
      ],
      stream: false,
    };

    const response = await llamaAPI.run(apiRequestJson);

    // レスポンスを整形
    return NextResponse.json({
      choices: [
        {
          message: {
            content: response.choices[0].message.content,
          },
        },
      ],
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "External API error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
