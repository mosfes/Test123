import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: 'application/json' },
});

export async function GET() {
    try {
        const [rows]: any = await db.query(
            'SELECT content FROM feedback WHERE is_appropriate = TRUE'
        );

        if (rows.length === 0) {
            return NextResponse.json(
                {
                    summary_text: 'ยังไม่มีข้อมูล',
                    overall_sentiment: 'ไม่มี',
                    positive_themes: [],
                    negative_themes: [],
                    neutral_themes: [],
                },
                { status: 200 }
            );
        }

        const allFeedbackText = rows.map((r: any) => r.content).join('\n');

        const analysisPrompt = `
      วิเคราะห์ข้อเสนอแนะเหล่านี้:
      ${allFeedbackText}

      ตอบกลับเป็น JSON Format เท่านั้น โดยมี Key ดังนี้:
      {
        "summary_text": "สรุปภาพรวมสั้นๆ",
        "overall_sentiment": "เชิงบวก / เชิงลบ / กลาง",
        "sentiment_score": 80, // ให้เป็นตัวเลขตั้งแต่ 0 ถึง 100 ตามสัดส่วนความพึงพอใจโดยรวม (0=แย่ที่สุด, 100=ดีที่สุด)
        "positive_themes": ["จุดเด่น1", "จุดเด่น2"],
        "negative_themes": ["จุดด้อย1", "จุดด้อย2"],
        "neutral_themes": ["ข้อสังเกตทั่วไป"]
      }
    `;

        const result = await model.generateContent(analysisPrompt);
        const analysisData = JSON.parse(result.response.text());

        return NextResponse.json(analysisData, { status: 200 });
    } catch (error: any) {
        console.error('Error analyzing feedback:', error);

        if (error.message && error.message.includes('429 Too Many Requests')) {
            return NextResponse.json({ error: 'ขณะนี้มีผู้ใช้งาน AI เกินขีดจำกัด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง' }, { status: 429 });
        }

        return NextResponse.json({ error: 'วิเคราะห์ผลล้มเหลว: ' + error.message }, { status: 500 });
    }
}
