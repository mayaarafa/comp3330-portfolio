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
import { TypographyH2, TypographyP } from "./ui/typography";

const projects = [
  {
    title: "Project One",
    desc: "Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb. Long blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
  {
    title: "Project Two",
    desc: "Short blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
  {
    title: "Project Three",
    desc: "Short blurb.",
    img: "https://placehold.co/300.png",
    link: "#",
  },
];

export default function ProjectPreviewCard({ count = 3 }) {
  return (
    <div className="flex flex-row flex-wrap gap-4 my-4 w-full justify-center items-stretch">
      {projects.slice(0, count).map((project, index) => (
        <Card
          key={index}
          className={"hover:scale-105 transition-transform self-stretch w-min"}
        >
          <CardContent className={"flex flex-col gap-3 h-full justify-between"}>
            <div>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <TypographyH2>{project.title}</TypographyH2>
              <TypographyP>{project.desc}</TypographyP>
            </div>
            <Button className={"w-full mt-4"}>
              <a href={project.link}>See More</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
