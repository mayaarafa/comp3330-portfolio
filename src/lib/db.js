import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const databaseUrl = process.env.NEON_DB_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Set it in your environment to use the database."
  );
}

const sql = neon(databaseUrl);

const seedProjects = [
  {
    id: randomUUID(),
    title: "Project One",
    description:
      "Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb.",
    img: null,
    link: "#",
    keywords: [],
  },
  {
    id: randomUUID(),
    title: "Project Two",
    description: "Short blurb.",
    img: null,
    link: "#",
    keywords: [],
  },
  {
    id: randomUUID(),
    title: "Project Three",
    description: "Short blurb.",
    img: null,
    link: "#",
    keywords: [],
  },
  {
    id: randomUUID(),
    title: "Project Four",
    description: "Short blurb.",
    img: null,
    link: "#",
    keywords: [],
  },
  {
    id: randomUUID(),
    title: "Project Five",
    description: "Short blurb.",
    img: null,
    link: "#",
    keywords: [],
  },
  {
    id: randomUUID(),
    title: "Project Six",
    description: "Short blurb.",
    img: "",
    link: "#",
    keywords: [],
  },
];

async function ensureProjectsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      img text,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM projects`;
  if (Number(count) === 0) {
    await seedProjectsTable();
  }
}

async function seedProjectsTable() {
  for (const project of seedProjects) {
    await sql`
      INSERT INTO projects (id, title, description, img, link, keywords)
      VALUES (
        ${project.id}::uuid,
        ${project.title},
        ${project.description},
        ${project.img},
        ${project.link},
        ${JSON.stringify(normalizeKeywordsInput(project.keywords))}::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

function normalizeKeywordsInput(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : String(value).split(",");
  return list
    .map((keyword) => keyword?.toString().trim())
    .filter((keyword) => Boolean(keyword));
}

const PROJECT_STRING_FIELDS = ["title", "description", "img", "link"];

function pickProjectFields(input = {}) {
  return PROJECT_STRING_FIELDS.reduce((acc, field) => {
    if (input[field] !== undefined) {
      const value = input[field];
      acc[field] = typeof value === "string" ? value.trim() : value;
    }
    return acc;
  }, {});
}

function mapRow(row) {
  return {
    ...row,
    keywords: Array.isArray(row.keywords)
      ? row.keywords
      : normalizeKeywordsInput(row.keywords),
  };
}

export async function fetchProjects() {
  await ensureProjectsTable();
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    ORDER BY created_at DESC
  `;

  return rows.map(mapRow);
}

export async function getProjectById(id) {
  await ensureProjectsTable();
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
}

export async function insertProject(project) {
  await ensureProjectsTable();
  const id = project.id ?? randomUUID();
  const keywords = normalizeKeywordsInput(project.keywords);

  const [row] = await sql`
    INSERT INTO projects (id, title, description, img, link, keywords)
    VALUES (
      ${id}::uuid,
      ${project.title},
      ${project.description},
      ${project.img},
      ${project.link},
      ${JSON.stringify(keywords)}::jsonb
    )
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapRow(row);
}

export async function updateProject(id, updates = {}) {
  await ensureProjectsTable();
  const currentRows = await sql`
    SELECT
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM projects
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  if (currentRows.length === 0) {
    return null;
  }

  const current = mapRow(currentRows[0]);
  const sanitized = pickProjectFields(updates);
  const nextKeywords =
    updates.keywords !== undefined
      ? normalizeKeywordsInput(updates.keywords)
      : current.keywords;

  const payload = {
    title: sanitized.title ?? current.title,
    description: sanitized.description ?? current.description,
    img: sanitized.img ?? current.img,
    link: sanitized.link ?? current.link,
    keywords: nextKeywords,
  };

  const [row] = await sql`
    UPDATE projects
    SET
      title = ${payload.title},
      description = ${payload.description},
      img = ${payload.img},
      link = ${payload.link},
      keywords = ${JSON.stringify(payload.keywords)}::jsonb,
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapRow(row);
}

export async function deleteProject(id) {
  await ensureProjectsTable();
  const rows = await sql`
    DELETE FROM projects
    WHERE id = ${id}::uuid
    RETURNING
      id,
      title,
      description,
      img,
      link,
      keywords,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
}

export { fetchProjects as getProjects };
