import { NextRequest, NextResponse } from "next/server";
import {
  sendContactFormNotification,
  sendContactFormConfirmation,
} from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message, userId, userType } = body;

    // Basic validation
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // TODO: Save contact form submission to database
    // const contactSubmission = await saveContactSubmission({
    //   name,
    //   email,
    //   category,
    //   subject,
    //   message,
    //   userId,
    //   userType,
    //   createdAt: new Date(),
    // });

    // Send admin notification email
    const emailSent = await sendContactFormNotification(
      {
        name,
        email,
        category,
        subject,
        message,
        userId,
        userType,
      },
      "Admin"
    );

    if (!emailSent) {
      console.warn("⚠️ [Contact API] Failed to send admin notification email");
    }

    // Send confirmation email to user
    const confirmationSent = await sendContactFormConfirmation(
      email,
      subject,
      message.substring(0, 140),
      name
    );

    if (!confirmationSent) {
      console.warn(
        "⚠️ [Contact API] Failed to send confirmation email to user"
      );
    }

    console.log("Contact form submission received:", {
      name,
      email,
      category,
      subject,
      message: message.substring(0, 100) + "...",
      userId,
      userType,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
