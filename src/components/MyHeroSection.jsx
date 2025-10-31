import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TypographyH1, TypographyP } from "./ui/typography";

export function MyHero() {
  return (
    <Card className="w-full h-full">
      <CardContent className={"flex gap-8 items-center"}>
        <Image
          src="/profile.jpg"
          width={200}
          height={200}
          alt="profile picture of my cat"
          className="rounded-2xl"
        />
        <div>
          <TypographyH1>Maya Arafa's Portfolio</TypographyH1>
          <TypographyP>Hello! Welcome to my portfolio website!</TypographyP>
        </div>
      </CardContent>
    </Card>
  );
}
