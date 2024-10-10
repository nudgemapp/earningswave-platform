import prismadb from "../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

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
