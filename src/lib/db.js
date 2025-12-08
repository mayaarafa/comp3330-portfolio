import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const databaseUrl = process.env.DATABASE_URL;
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

const HERO_PLACEHOLDER_AVATAR = "/profile.jpg";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  full_name: "Maya Arafa",
  short_description: "I am a full-stack web developer",
  long_description: "I am a full-stack web developer. Etc. Etc.",
};

const seedHeroes = [
  {
    id: randomUUID(),
    avatar: HERO_PLACEHOLDER_AVATAR,
    full_name: "Maya Arafa",
    short_description: "I am a full-stack web developer",
    long_description: "I am a full-stack web developer. Etc. Etc.",
  },
];

function mapHeroRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    avatar: row.avatar || defaultHeroContent.avatar,
    full_name: row.full_name || defaultHeroContent.full_name,
    short_description:
      row.short_description || defaultHeroContent.short_description,
    long_description:
      row.long_description || defaultHeroContent.long_description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function seedHeroTable() {
  for (const hero of seedHeroes) {
    await sql`
      INSERT INTO hero (id, avatar, full_name, short_description, long_description)
      VALUES (
        ${hero.id}::uuid,
        ${hero.avatar},
        ${hero.full_name},
        ${hero.short_description},
        ${hero.long_description}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function ensureHeroTable() {
  await sql`
    create table if not exists hero (
      id uuid primary key,
      avatar text not null default '',
      full_name text not null,
      short_description text not null check (char_length(short_description) <= 120),
      long_description text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `;
  const [{ count }] = await sql`select count(*)::int as count from hero`;
  if (Number(count) === 0) await seedHeroTable();
}

export async function getHero() {
  await ensureHeroTable();
  const [row] = await sql`
    select id, avatar, full_name, short_description, long_description,
           created_at as "createdAt", updated_at as "updatedAt"
    from hero
    order by created_at asc
    limit 1;
  `;
  return row ? mapHeroRow(row) : null;
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();
  const current = await getHero();
  // merge defaults → current → updates, normalize avatar/lengths, then UPDATE/INSERT
  // return mapped row with fallbacks for empty fields
  const merged = {
    ...defaultHeroContent,
    ...(current || {}),
    ...(updates || {}),
  };

  const avatarRaw = merged.avatar;
  const avatar =
    typeof avatarRaw === "string" && avatarRaw.trim().length > 0
      ? avatarRaw.trim()
      : defaultHeroContent.avatar;

  const full_name = (merged.full_name ?? defaultHeroContent.full_name)
    .toString()
    .trim();

  let short_description = (
    merged.short_description ?? defaultHeroContent.short_description
  )
    .toString()
    .trim();

  let long_description = (
    merged.long_description ?? defaultHeroContent.long_description
  )
    .toString()
    .trim();

  if (short_description.length > 120) {
    short_description = short_description.slice(0, 120);
  }
  if (long_description.length > 5000) {
    long_description = long_description.slice(0, 5000);
  }

  let row;

  if (current && current.id) {
    [row] = await sql`
      update hero
      set
        avatar = ${avatar},
        full_name = ${full_name},
        short_description = ${short_description},
        long_description = ${long_description},
        updated_at = now()
      where id = ${current.id}::uuid
      returning
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at as "createdAt",
        updated_at as "updatedAt";
    `;
  } else {
    const id = randomUUID();
    [row] = await sql`
      insert into hero (id, avatar, full_name, short_description, long_description)
      values (
        ${id}::uuid,
        ${avatar},
        ${full_name},
        ${short_description},
        ${long_description}
      )
      returning
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at as "createdAt",
        updated_at as "updatedAt";
    `;
  }

  return mapHeroRow(row);
}

export { fetchProjects as getProjects };
