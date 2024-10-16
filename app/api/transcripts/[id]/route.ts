import { NextResponse } from "next/server";
import { getMongoDb } from "../../../../lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return new NextResponse("Transcript ID is required", { status: 400 });
    }

    const db = await getMongoDb();

    if (!db) {
      console.error("[TRANSCRIPT_GET] Failed to connect to database");
      return new NextResponse("Database connection failed", { status: 500 });
    }

    const collection = db.collection("articles");

    const transcript = await collection.findOne({ _id: new ObjectId(id) });

    if (!transcript) {
      return new NextResponse("Transcript not found", { status: 404 });
    }

    const bucket = new GridFSBucket(db);

    if (transcript.company_info && transcript.company_info.logo_id) {
      const logoBase64 = await getLogoAsBase64(
        transcript.company_info.logo_id,
        bucket
      );
      transcript.company_info.logo_base64 = logoBase64;
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error("[TRANSCRIPT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Function to fetch logo as base64
async function getLogoAsBase64(
  logoId: string,
  bucket: GridFSBucket
): Promise<string | null> {
  try {
    const downloadStream = bucket.openDownloadStream(new ObjectId(logoId));
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const fileData = Buffer.concat(chunks);
    return `data:image/png;base64,${fileData.toString("base64")}`;
  } catch (error) {
    console.error(`Error fetching logo ${logoId}:`, error);
    return null;
  }
}
