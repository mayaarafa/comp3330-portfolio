import { Progress } from "@/components/ui/progress";
import { TypographyP, TypographyMuted } from "@/components/ui/typography";
import { Card, CardContent } from "./ui/card";

export default function SkillsCard({ title, skills }) {
  return (
    <Card className={"hover:scale-105 transition-transform"}>
      <CardContent className="flex flex-col w-[350px] gap-4">
        <TypographyP className="font-semibold text-center">{title}</TypographyP>
        {skills.map((skill, index) => {
          return (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <TypographyMuted>{skill.name}</TypographyMuted>
                <TypographyMuted>{skill.percentage}%</TypographyMuted>
              </div>
              <Progress value={skill.percentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
