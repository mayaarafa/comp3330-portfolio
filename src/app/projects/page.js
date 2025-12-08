import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import { TypographyH1 } from "@/components/ui/typography";

export default async function ProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center mb-4 w-full">
      <TypographyH1 className="my-4">Maya's Projects</TypographyH1>
      <ProjectPreviewCard />
    </div>
  );
}
