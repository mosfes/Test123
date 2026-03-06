import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
    model: 'gemini-flash-lite-latest',
    generationConfig: { responseMimeType: 'application/json' },
});

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'กรุณากรอกข้อเสนอแนะ' }, { status: 400 });
        }

        const moderationPrompt = `
    ตรวจสอบข้อความนี้: "${content}"
    ให้ประเมินว่าเป็นข้อความที่เหมาะสมหรือไม่ (ตรวจสอบคำหยาบ, ภาษาลับ, ภาษาวิบัติที่รุนแรง)
    
    ตอบกลับเป็น JSON Format เท่านั้น โดยมี Key ดังนี้:
    {
      "is_appropriate": "YES" หรือ "NO",
      "reason": "ถ้าเหมาะสมให้ตอบว่า 'เหมาะสม', ถ้าไม่ให้ระบุเหตุผลสั้นๆ"
    }
    `;

        const result = await model.generateContent(moderationPrompt);
        const moderationData = JSON.parse(result.response.text());

        if (moderationData.is_appropriate !== 'YES') {
            return NextResponse.json(
                { error: `เนื้อหาไม่เหมาะสม: ${moderationData.reason}` },
                { status: 400 }
            );
        }

        const [dbResult]: any = await db.query('INSERT INTO feedback (content, is_appropriate) VALUES (?, ?)', [
            content,
            true,
        ]);

        return NextResponse.json(
            { message: 'ส่งข้อเสนอแนะสำเร็จ!', submittedContent: { id: dbResult.insertId, content } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error submitting feedback:', error);

        if (error.message && error.message.includes('429 Too Many Requests')) {
            return NextResponse.json({ error: 'ขณะนี้มีผู้ใช้งาน AI เกินขีดจำกัด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง' }, { status: 429 });
        }

        return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const [rows]: any = await db.query(
            'SELECT id, content FROM feedback WHERE is_appropriate = TRUE ORDER BY id DESC'
        );
        return NextResponse.json(rows, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json({ error: 'ไม่สามารถดึงข้อมูลได้' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ไม่พบ ID ของข้อเสนอแนะ' }, { status: 400 });
        }

        await db.query('DELETE FROM feedback WHERE id = ?', [id]);

        return NextResponse.json({ message: 'ลบข้อเสนอแนะสำเร็จ' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting feedback:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบ: ' + error.message }, { status: 500 });
    }
}
