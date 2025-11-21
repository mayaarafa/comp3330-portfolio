import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    // ... // complete the rest

    // FUTURE CONCERNS - you can ignore them now
    // TODO: (recommended) validate here again with Zod
    // TODO: persist to DB (Prisma/Drizzle/etc.)
    // TODO: revalidatePath("/projects") after write (if using Next cache)

    console.log({ contact: { name, email, message } });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.RESEND_TO],
      subject: "Contact Form Submission",
      html: `<p>${message}</p>`,
      replyTo: email,
    });

    console.log("data:", data);
    console.log("error:", error);

    if (!data) {
      return Response.json(
        { ok: false, message: "There was an error submitting the message." },
        { status: 504 }
      );
    } else {
      return Response.json(
        { ok: true, message: "Your email was sent successfully." },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error(err);
    return Response.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
