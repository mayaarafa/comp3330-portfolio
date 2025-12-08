import { auth0 } from "@/lib/auth0";
import { redirect, notFound } from "next/navigation";
import EditProjectForm from "@/components/EditProjectForm";
import { getProjectById } from "@/lib/db";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { TypographyH1 } from "@/components/ui/typography";

export default async function EditProjectPage({ params }) {
  const session = await auth0.requireSession();
  const user = session?.user;
  if (!user) redirect("/auth/login");
  const { uuid } = await params;
  //   console.log("uuid:", uuid);
  const project = await getProjectById(uuid);

  if (!project) return notFound();

  const redirectHome = async () => router.replace("/");

  return (
    <div className="w-[50%]">
      <TypographyH1 className="mb-5 text-center">{project.title}</TypographyH1>
      <EditProjectForm project={project} uuid={uuid} />
      <div className="w-full flex justify-center">
        <DeleteProjectButton
          id={project.id}
          className="w-3xs mt-4"
          redirectLink={"/"}
        />
      </div>
    </div>
  );
}
