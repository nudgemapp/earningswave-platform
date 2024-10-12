import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/services/email-service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new NextResponse("Valid email address is required", {
        status: 400,
      });
    }

    await sendEmail({
      to: "matt@nudgem.com",
      subject: "New EarningsWave Email Submission",
      body: `New EarningsWave email submitted: ${email}`,
    });

    const existingEmail = await prisma.email.findUnique({
      where: {
        address: email,
      },
    });

    if (existingEmail) {
      return new NextResponse("Email already exists", { status: 409 });
    }

    const data = await prisma.email.create({
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
