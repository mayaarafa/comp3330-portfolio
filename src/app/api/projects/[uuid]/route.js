// app/api/projects/[uuid]/route.js
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { getProjectById, updateProject, deleteProject } from "@/lib/db";
import { notFound } from "next/navigation";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(), // maps to `img`
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

export async function GET(_request, { params }) {
  const { uuid } = await params;
  const project = await getProjectById(uuid);

  if (!project) {
    return NextResponse.json(
      { message: "Not found", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Project found",
    project: project,
    status: 200,
  });
}

export async function PUT(request, { params }) {
  const { uuid } = await params;
  await auth0.requireSession();

  const body = await request.json();
  const parsed = updateSchema.parse(body);

  const updated = await updateProject(uuid, {
    title: parsed.title,
    description: parsed.description,
    img: parsed.image,
    link: parsed.link,
    keywords: parsed.keywords,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "Not found", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Project updated",
    data: updated,
  });
}

export async function DELETE(_request, { params }) {
  const { uuid } = await params;
  await auth0.requireSession();

  const deleted = await deleteProject(uuid);

  if (!deleted) {
    return NextResponse.json(
      { message: "Not found", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Project deleted",
    data: deleted,
  });
}
