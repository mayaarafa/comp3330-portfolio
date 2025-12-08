"use client";

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
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import DeleteProjectButton from "./DeleteProjectButton";
import EditProjectButton from "./EditProjectButton";

export default function ProjectPreviewCard({ count = 6, redirectLink }) {
  const { user, isLoading } = useUser();
  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-4 my-4 w-[70%] justify-center items-stretch">
      {projects.slice(0, count).map((project, index) => (
        <Card
          key={index}
          className={"hover:scale-105 transition-transform self-stretch w-min"}
        >
          <CardContent className={"flex flex-col gap-3 h-full justify-between"}>
            <div>
              {project.img ? (
                <div className="relative w-[250px] h-[125px]">
                  <Image
                    src={project.img}
                    alt="project image"
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
              ) : (
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              )}
              <TypographyH2>{project.title}</TypographyH2>
              <TypographyP className={"mt-2"}>
                {project.description}
              </TypographyP>
            </div>
            <CardFooter className={"flex-col"}>
              <Button className={"w-full mt-4"}>
                <a href={`/projects/${project.id}`}>See More</a>
              </Button>
              {user && (
                <div className="w-full">
                  <EditProjectButton
                    uuid={project.id}
                    className="w-full mt-4"
                  />
                  <DeleteProjectButton
                    id={project.id}
                    className="w-full mt-4"
                    onDeleteSuccess={loadProjects}
                    redirectLink={redirectLink}
                  />
                </div>
              )}
            </CardFooter>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
