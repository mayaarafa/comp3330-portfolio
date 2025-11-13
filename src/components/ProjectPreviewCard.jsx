import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Image from "next/image";
import { TypographyH2, TypographyP } from "./ui/typography";
import { createSlug } from "@/lib/utils";

export default async function ProjectPreviewCard({ count = 6 }) {
  const projects = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
  )
    .then((res) => res.json())
    .then((data) => data.projects)
    .catch((error) => {
      console.error("Error fetching projects:", error);
      return [];
    });

  return (
    <div className="flex flex-row flex-wrap gap-4 my-4 w-full justify-center items-stretch">
      {projects.slice(0, count).map((project, index) => (
        <Card
          key={index}
          className={"hover:scale-105 transition-transform self-stretch w-min"}
        >
          <CardContent className={"flex flex-col gap-3 h-full justify-between"}>
            <div>
              {project.img ? (
                <Image
                  width={125}
                  height={250}
                  alt={"project image"}
                  className="rounded-xl"
                />
              ) : (
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              )}
              <TypographyH2>{project.title}</TypographyH2>
              <TypographyP>{project.description}</TypographyP>
            </div>
            <Button className={"w-full mt-4"}>
              <a href={`/projects/${createSlug(project.title)}`}>See More</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
