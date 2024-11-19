// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log("Webhook received");
  const reqText = await req.text();
  return webhooksHandler(reqText, req);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  console.log(`Fetching customer email for ID: ${customerId}`);
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log(
      `Customer email fetched: ${(customer as Stripe.Customer).email}`
    );
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted"
) {
  console.log(`Handling ${type} subscription event`);
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  console.log(customerEmail);

  if (!customerEmail) {
    console.error("Customer email could not be fetched");
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const subscriptionData = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer as string,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000),
    end_date: new Date(subscription.current_period_end * 1000),
    plan_id: subscription.items.data[0]?.price.id,
    email: customerEmail,
  };

  console.log("Subscription data:", subscriptionData);

  try {
    let result;
    const { userId } = useAuth();

    if (!userId) throw new Error("User not found");

    if (type === "deleted") {
      console.log("Updating subscription status to cancelled");
      result = await prisma.subscription.update({
        where: { subscription_id: subscription.id },
        data: { status: "cancelled" },
      });
      console.log("Disconnecting subscription from user");
      await prisma.user.update({
        where: { id: userId },
        data: { subscription: { disconnect: true } },
      });
    } else {
      console.log("Finding user");
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error("User not found");

      console.log("Upserting subscription");
      result = await prisma.subscription.upsert({
        where: { subscription_id: subscription.id },
        update: { ...subscriptionData, user_id: user.id },
        create: { ...subscriptionData, user_id: user.id },
      });
    }

    console.log(`Subscription ${type} successful:`, result);
    return NextResponse.json({
      status: 200,
      message: `Subscription ${type} success`,
      data: result,
    });
  } catch (error) {
    console.error(`Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed"
) {
  console.log(`Handling invoice ${status} event`);
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);

  if (!customerEmail) {
    console.error("Customer email could not be fetched");
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  try {
    console.log("Finding user");
    // const user = await prisma.user.findUnique({
    //   where: { email: customerEmail },
    // });
    const { userId } = useAuth();

    if (!userId) throw new Error("User not found");

    console.log("Finding subscription");
    const subscription = await prisma.subscription.findUnique({
      where: { subscription_id: invoice.subscription as string },
    });
    if (!subscription) throw new Error("Subscription not found");

    const invoiceData = {
      invoice_id: invoice.id,
      subscription_id: invoice.subscription as string,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      status,
      email: customerEmail,
      user_id: userId,
      period_start: new Date(invoice.period_start * 1000),
      period_end: new Date(invoice.period_end * 1000),
    };

    console.log("Invoice data:", invoiceData);

    console.log("Creating invoice record");
    const result = await prisma.invoice.create({
      data: invoiceData,
    });

    console.log("Invoice created successfully:", result);
    return NextResponse.json({
      status: 200,
      message: `Invoice payment ${status}`,
      data: result,
    });
  } catch (error) {
    console.error(`Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  console.log("Handling checkout session completed event");
  const session = event.data.object as Stripe.Checkout.Session;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata: any = session?.metadata;

  if (metadata?.subscription === "true") {
    console.log("Processing subscription payment");
    // This is for subscription payments
    const subscriptionId = session.subscription;
    try {
      console.log("Updating subscription metadata");
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      console.log("Finding user");
      const { userId } = useAuth();

      if (!userId) throw new Error("User not found");

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");

      console.log("Updating invoices with user ID");
      await prisma.invoice.updateMany({
        where: { email: user.email! },
        data: { user_id: userId },
      });

      console.log("Connecting subscription to user");
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscription: {
            connect: { subscription_id: subscriptionId as string },
          },
        },
      });

      console.log("Subscription metadata updated successfully");
      return NextResponse.json({
        status: 200,
        message: "Subscription metadata updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription metadata:", error);
      return NextResponse.json({
        status: 500,
        error: "Error updating subscription metadata",
      });
    }
  } else {
    console.log("Processing one-time payment");
    // This is for one-time payments
    const dateTime = new Date(session.created * 1000);
    try {
      console.log("Finding user");
      const { userId } = useAuth();

      if (!userId) throw new Error("User not found");

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const paymentData = {
        user_id: user.id,
        stripe_id: session.id,
        email: user.email!,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent as string,
        payment_time: dateTime,
        currency: session.currency || "USD",
        status: session.payment_status,
      };

      await prisma.payment.create({ data: paymentData });

      // const updatedCredits =
      //   (user.credits || 0) + (session.amount_total || 0) / 100;
      // const updatedUser = await prisma.user.update({
      //   where: { id: user.id },
      //   data: { credits: updatedCredits },
      // });

      return NextResponse.json({
        status: 200,
        message: "Payment and credits updated successfully",
        // updatedUser,
      });
    } catch (error) {
      console.error("Error handling checkout session:", error);
      return NextResponse.json({
        status: 500,
        error: "Error handling checkout session",
      });
    }
  }
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest
): Promise<NextResponse> {
  console.log("Processing webhook");
  const sig = request.headers.get("Stripe-Signature");

  try {
    console.log("Constructing Stripe event");
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Event type: ${event.type}`);
    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created");
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated");
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted");
      case "invoice.payment_succeeded":
        return handleInvoiceEvent(event, "succeeded");
      case "invoice.payment_failed":
        return handleInvoiceEvent(event, "failed");
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      default:
        console.log("Unhandled event type:", event.type);
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
    });
  }
}
