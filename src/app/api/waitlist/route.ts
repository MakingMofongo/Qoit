import { Resend } from "resend";
import { NextResponse } from "next/server";
import { config } from "dotenv";
import { resolve } from "path";

// Load qoit.env in addition to .env.local
config({ path: resolve(process.cwd(), "qoit.env") });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add contact to Resend
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    if (error) {
      // If already subscribed, still return success
      if (error.message?.includes("already exists")) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    // Optionally send a welcome email
    if (process.env.RESEND_FROM_EMAIL) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "You're on the Qoit waitlist ✨",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #1a1915; display: inline-flex; align-items: center; justify-content: center;">
                <div style="width: 14px; height: 14px; border-radius: 50%; background: #faf9f7;"></div>
              </div>
            </div>
            <h1 style="font-size: 24px; font-weight: 600; color: #1a1915; margin-bottom: 16px; text-align: center;">
              You're in.
            </h1>
            <p style="font-size: 16px; color: #8a8780; line-height: 1.6; text-align: center; margin-bottom: 24px;">
              Thanks for joining the Qoit waitlist. We'll whisper when it's your turn to go beautifully offline.
            </p>
            <p style="font-size: 14px; color: #8a8780; text-align: center; font-style: italic;">
              Until then... shhh.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


