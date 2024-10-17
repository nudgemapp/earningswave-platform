import { NextResponse } from "next/server";
import { getMongoDb } from "../../../../lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "1", 10);
    const sort = searchParams.get("sort") || "date:-1";

    const db = await getMongoDb();

    if (!db) {
      console.error("[TRANSCRIPT_GET] Failed to connect to database");
      return new NextResponse("Database connection failed", { status: 500 });
    }

    const collection = db.collection("articles");

    // Parse the sort parameter
    const [sortField, sortOrder] = sort.split(":");
    const sortOptions: { [key: string]: 1 | -1 } = {
      [sortField]: sortOrder === "-1" ? -1 : 1,
    };

    // Find the next available transcript
    const transcripts = await collection
      .find()
      .sort(sortOptions)
      .limit(limit)
      .toArray();

    if (transcripts.length === 0) {
      return new NextResponse("No transcripts found", { status: 404 });
    }

    const bucket = new GridFSBucket(db);

    // Fetch logos for all transcripts
    const transcriptsWithLogos = await Promise.all(
      transcripts.map(async (transcript) => {
        if (transcript.company_info && transcript.company_info.logo_id) {
          const logoBase64 = await getLogoAsBase64(
            transcript.company_info.logo_id,
            bucket
          );
          transcript.company_info.logo_base64 = logoBase64;
        }
        return transcript;
      })
    );

    return NextResponse.json({ articles: transcriptsWithLogos });
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
