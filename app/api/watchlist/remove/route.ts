import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { companyId } = await req.json();
    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    // Delete the watchlist entry
    await prisma.watchlistEntry.delete({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WATCHLIST_REMOVE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
