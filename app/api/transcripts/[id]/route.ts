import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return new NextResponse("Transcript ID is required", { status: 400 });
    }

    const transcript = await prisma.earningsCallTranscript.findUnique({
      where: { id: parseInt(id) },
      include: { logo: true },
    });

    console.log(transcript);

    if (!transcript) {
      return new NextResponse("Transcript not found", { status: 404 });
    }

    const responseData = { ...transcript };

    // Convert logo data to base64 if it exists
    if (transcript.logo) {
      const logoBase64 = `data:image/png;base64,${transcript.logo.data.toString(
        "base64"
      )}`;
      responseData.company_info = {
        ...(typeof transcript.company_info === "object"
          ? transcript.company_info
          : {}),
        logo_base64: logoBase64,
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[TRANSCRIPT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
