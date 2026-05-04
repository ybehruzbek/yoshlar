import { NextResponse } from "next/server";
import { auth } from "@/auth";
import mammoth from "mammoth";

// POST: Convert uploaded .docx to HTML for preview
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".docx")) {
      return NextResponse.json({ error: "Faqat .docx fayllar qabul qilinadi" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert docx to HTML using mammoth
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "b => strong",
          "i => em",
          "u => u",
        ],
      }
    );

    return NextResponse.json({
      html: result.value,
      messages: result.messages,
    });
  } catch (error: any) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
