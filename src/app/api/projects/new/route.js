// app/api/projects/new/route.js
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { insertProject } from "@/lib/db";

const createProjectSchema = z.object({
  title: z.string().min(2, { message: "Your title is too short" }).max(200),
  description: z
    .string()
    .min(10, { message: "Your description is too short" })
    .max(1000),
  img: z
    .string()
    .url({ message: "Please enter a valid URL for the image" })
    .or(z.literal(""))
    .optional(),
  link: z
    .string()
    .url({ message: "Please enter a valid URL for the link" })
    .or(z.literal(""))
    .optional(),
  keywords: z.array(z.string()).optional(),
});

export async function POST(request) {
  try {
    await auth0.requireSession();

    const body = await request.json();
    const parsed = createProjectSchema.parse(body);

    const created = await insertProject({
      title: parsed.title.trim(),
      description: (parsed.description ?? "").trim(),
      img: parsed.img || null,
      link: parsed.link || "#",
      keywords: parsed.keywords ?? [],
    });

    return NextResponse.json(
      {
        message: "Project created",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
