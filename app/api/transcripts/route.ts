import { NextResponse } from "next/server";
import { getMongoDb } from "../../../lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return new NextResponse("Month and year are required query parameters", {
        status: 400,
      });
    }

    const db = await getMongoDb();
    if (!db) {
      console.error("[ARTICLES_GET] Failed to connect to database");
      return new NextResponse("Database connection failed", { status: 500 });
    }

    const collection = db.collection("articles");

    const totalCounttemp = await collection.countDocuments();
    console.log(`Total articles in collection: ${totalCounttemp}`);
    // Convert month number to month name
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(month) - 1];

    // Construct the regex pattern for the date
    const datePattern = `${monthName} \\d{1,2}, ${year}`;
    console.log("datePattern: " + datePattern);
    const articles = await collection
      .find({
        "company_info.date": { $regex: datePattern },
      })
      .toArray();

    // Create a GridFSBucket
    const bucket = new GridFSBucket(db);

    // Fetch logos for all articles
    const articlesWithLogos = await Promise.all(
      articles.map(async (article) => {
        if (article.company_info && article.company_info.logo_id) {
          const logoBase64 = await getLogoAsBase64(
            article.company_info.logo_id,
            bucket
          );
          return {
            ...article,
            company_info: {
              ...article.company_info,
              logo_base64: logoBase64,
            },
          };
        }
        return article;
      })
    );

    const totalCount = articlesWithLogos.length;

    return NextResponse.json({
      articles: articlesWithLogos,
      totalCount,
    });
  } catch (error) {
    console.error("[ARTICLES_GET]", error);
    // return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
// Function to fetch logo as base64
async function getLogoAsBase64(
  logoId: ObjectId,
  bucket: GridFSBucket
): Promise<string | null> {
  try {
    const downloadStream = bucket.openDownloadStream(logoId);
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
