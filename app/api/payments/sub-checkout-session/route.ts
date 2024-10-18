// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest) {
//   const { userId, email, subscription, planName } = await req.json();

//   console.log("userId", userId);
//   console.log("email", email);
//   console.log("subscription", subscription);
//   console.log("planName", planName);

//   const plans = {
//     "Trader 🚀 ": {
//       monthlyPrice: 4999, // $49.99 in cents
//       annualPrice: 47990, // $479.90 in cents
//     },
//     "API ⚡": {
//       monthlyPrice: 19999, // $199.99 in cents
//       annualPrice: 191990, // $1,919.90 in cents
//     },
//   };

//   if (subscription) {
//     console.log("Creating subscription checkout session");
//     try {
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//           {
//             price_data: {
//               currency: "usd",
//               recurring: {
//                 interval: "month",
//               },
//               product_data: {
//                 name: `${planName} Monthly Subscription`,
//               },
//               unit_amount: plans[planName as keyof typeof plans].monthlyPrice,
//             },
//             quantity: 1,
//           },
//           {
//             price_data: {
//               currency: "usd",
//               recurring: {
//                 interval: "year",
//               },
//               product_data: {
//                 name: `${planName} Annual Subscription (20% off)`,
//               },
//               unit_amount: plans[planName as keyof typeof plans].annualPrice,
//             },
//             quantity: 1,
//           },
//         ],
//         metadata: { userId, email, subscription, planName },
//         mode: "subscription",
//         success_url: `${process.env.FRONTEND_URL}`,
//         cancel_url: `${process.env.FRONTEND_URL}`,
//         allow_promotion_codes: true,
//       });

//       console.log("session", session);

//       return NextResponse.json({ sessionId: session.id });
//     } catch (error) {
//       console.error("Error creating checkout session:", error);
//       return NextResponse.json({ error: "Failed to create checkout session" });
//     }
//   } else {
//     // Your existing non-subscription checkout code remains unchanged
//     // You may want to update this part if you have one-time payment options
//     return NextResponse.json({
//       error: "Non-subscription payments not implemented",
//     });
//   }
// }
