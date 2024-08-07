import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req){

    const data = await req.json()

    // Access your API key as an environment variable (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = data.input

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(data.input)
    console.log(text);

    return NextResponse.json({output: text})
}