import { TypographyH1, TypographyP } from "@/components/ui/typography";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { param } from "drizzle-orm";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import EditProjectButton from "@/components/EditProjectButton";
import { auth0 } from "@/lib/auth0";

export default async function ProjectDetailPage({ params }) {
  const session = await auth0.getSession();
  const user = session?.user;
  const { uuid } = await params;

  const project = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${uuid}`,
    { cache: "no-store" }
  )
    .then((res) => {
      if (!res.ok) {
        console.error("Error fetching project:", res.status, res.statusText);
        notFound();
      }
      return res.json();
    })
    .then((data) => data?.project)
    .catch((error) => {
      console.error("Error parsing or fetching project JSON:", error);
      notFound();
    });

  if (!project) {
    notFound();
  }

  return (
    <>
      <TypographyH1>{project.title}</TypographyH1>
      {project.img ? (
        <Image
          width={125}
          height={250}
          src={project.img}
          alt={"project image"}
          className="rounded-xl my-2"
        />
      ) : (
        <Skeleton className="h-[125px] w-[250px] rounded-xl mt-5" />
      )}
      <TypographyP>{project.description}</TypographyP>
      {user && (
        <div className="w-3xs">
          <EditProjectButton uuid={project.id} className="w-full mt-4" />
          <DeleteProjectButton
            id={project.id}
            className="w-full mt-4"
            redirectLink={"/projects"}
          />
        </div>
      )}
    </>
  );
}
