import prismadb from "../../../lib/prismadb";
import { NextResponse } from "next/server";

const rateLimitStore: { [key: string]: { requests: number[] } } = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return new NextResponse("Valid email address is required", {
        status: 400,
      });
    }

    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes window
    const maxRequests = 10; // Max 10 requests per 5 minutes

    if (!rateLimitStore[clientIp]) {
      rateLimitStore[clientIp] = { requests: [] };
    }

    const clientData = rateLimitStore[clientIp];

    clientData.requests = clientData.requests.filter(
      (time) => now - time < windowMs
    );

    if (clientData.requests.length >= maxRequests) {
      const oldestRequest = clientData.requests[0];
      const resetTime = Math.ceil((oldestRequest + windowMs - now) / 1000);
      return new NextResponse(
        `Rate limit exceeded. Please try again in ${resetTime} seconds.`,
        { status: 429 }
      );
    }

    clientData.requests.push(now);

    const existingEmail = await prismadb.email.findUnique({
      where: {
        address: email,
      },
    });

    if (existingEmail) {
      return new NextResponse("Email already exists", { status: 409 });
    }

    const data = await prismadb.email.create({
      data: {
        address: email,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[EMAIL_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
