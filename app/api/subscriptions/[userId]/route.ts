import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authenticatedUserId } = auth();

    console.log(params.userId);

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        user_id: params.userId,
      },
      include: {
        invoices: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    console.log(subscription);

    if (!subscription) {
      return NextResponse.json({
        id: "",
        subscription_id: "",
        stripe_user_id: "",
        status: "inactive",
        start_date: new Date(),
        end_date: new Date(),
        plan_id: "",
        user_id: params.userId,
        isExpired: true,
        isActive: false,
        invoices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Check if subscription is expired
    const isExpired = new Date(subscription.end_date) < new Date();

    const subscriptionData = {
      ...subscription,
      isExpired,
      isActive: subscription.status === "active" && !isExpired,
    };

    return NextResponse.json(subscriptionData);
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
