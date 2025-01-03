import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
// Remove unused import
// import { sendEmail } from "@/services/email-service";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Remove console.log statements used for debugging
    const payload = (await req.json()) as WebhookEvent;

    // Console log the event
    console.log("Webhook received:", JSON.stringify(payload, null, 2));

    // Handle different event types
    switch (payload.type) {
      case "user.created":
        try {
          const user = await prisma.user.create({
            data: {
              id: payload.data.id,
              email: payload.data.email_addresses[0].email_address,
              firstName: payload.data.first_name || null,
              lastName: payload.data.last_name || null,
            },
          });
          console.log("New user created:", user);
          // TODO: Create Stripe customer here and update it in the user table db
        } catch (error) {
          console.error("Error creating user:", error);
        }
        break;
      case "user.updated":
        console.log("User updated:", payload.data);
        break;
      // Add more cases as needed
      default:
        console.log("Unhandled event type:", payload.type);
    }

    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[WEBHOOK_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// payload.data:

//   {
//     backup_code_enabled: false,
//     banned: false,
//     create_organization_enabled: true,
//     created_at: 1729542646484,
//     delete_self_enabled: true,
//     email_addresses: [
//       {
//         created_at: 1729542625906,
//         email_address: 'eugenio@nudgem.com',
//         id: 'idn_2nlLHFK3Vcjl5avgSQodEtrNiZI',
//         linked_to: [],
//         object: 'email_address',
//         reserved: false,
//         updated_at: 1729542646512,
//         verification: {
//           attempts: 1,
//           expire_at: 1729543226438,
//           status: 'verified',
//           strategy: 'email_code'
//         }
//       }
//     ],
//     external_accounts: [],
//     external_id: null,
//     first_name: null,
//     has_image: false,
//     id: 'user_2nlLJsJsjuQtE8EJbjbvKH4DFHU',
//     image_url:
//       'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybmt4bjVXVzBZTWg4RldVQ2hVTDRnZXhJamoiLCJyaWQiOiJ1c2VyXzJubExKc0pzanVRdEU4RUpiamJ2S0g0REZIVSJ9',
//     last_active_at: 1729542646483,
//     last_name: null,
//     last_sign_in_at: null,
//     legal_accepted_at: null,
//     locked: false,
//     lockout_expires_in_seconds: null,
//     mfa_disabled_at: null,
//     mfa_enabled_at: null,
//     object: 'user',
//     passkeys: [],
//     password_enabled: true,
//     phone_numbers: [],
//     primary_email_address_id: 'idn_2nlLHFK3Vcjl5avgSQodEtrNiZI',
//     primary_phone_number_id: null,
//     primary_web3_wallet_id: null,
//     private_metadata: {},
//     profile_image_url: 'https://www.gravatar.com/avatar?d=mp',
//     public_metadata: {},
//     saml_accounts: [],
//     totp_enabled: false,
//     two_factor_enabled: false,
//     unsafe_metadata: {},
//     updated_at: 1729542646525,
//     username: null,
//     verification_attempts_remaining: 100,
//     web3_wallets: []
//   }
