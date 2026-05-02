import { NextResponse } from "next/server";
import { generateDocument } from "@/lib/utils/documentGenerator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateName, data } = body;

    if (!templateName || !data) {
      return NextResponse.json(
        { error: "Template name and data are required" },
        { status: 400 }
      );
    }

    const buffer = generateDocument(templateName, data);

    // Return the generated docx file as a response
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${templateName.replace(".docx", "")}_${data.fish || 'hujjat'}.docx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });
  } catch (error: any) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
