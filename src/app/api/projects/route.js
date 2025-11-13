// GET /api/projects
export async function GET() {
  const projects = [
    {
      title: "Project One",
      description:
        "Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
    {
      title: "Project Two",
      description: "Short blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
    {
      title: "Project Three",
      description: "Short blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
    {
      title: "Project Three",
      description: "Short blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
    {
      title: "Project Three",
      description: "Short blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
    {
      title: "Project Three",
      description: "Short blurb.",
      img: null,
      link: "#",
      keywords: [],
    },
  ];

  return Response.json({ projects });
}
