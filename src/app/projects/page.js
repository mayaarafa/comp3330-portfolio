import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import { TypographyH1 } from "@/components/ui/typography";

export default async function ProjectsPage() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center">
      <TypographyH1>Maya's Projects</TypographyH1>
      <ProjectPreviewCard />
    </div>
  );
}
