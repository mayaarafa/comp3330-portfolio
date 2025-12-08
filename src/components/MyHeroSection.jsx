import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TypographyH1, TypographyP } from "./ui/typography";
import { getHero } from "@/lib/db";

const HERO_PLACEHOLDER_AVATAR = "/profile.jpg";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  full_name: "Maya Arafa",
  short_description: "I am a full-stack web developer",
  long_description: "I am a full-stack web developer. Etc. Etc.",
};

export async function MyHero() {
  let hero = null;
  try {
    hero = await getHero();
  } catch {
    hero = null;
  }

  // Merge defaults → DB row (if present)
  const content = {
    ...defaultHeroContent,
    ...(hero || {}),
  };

  // If avatar is missing/empty/transparent, show placeholder
  const isAvatarEmpty =
    !content.avatar ||
    content.avatar === "" ||
    content.avatar === HERO_PLACEHOLDER_AVATAR;

  const avatarSrc = isAvatarEmpty ? HERO_PLACEHOLDER_AVATAR : content.avatar;

  return (
    <Card className="w-[80%] h-full mb-4">
      <CardContent className={"flex gap-8 items-center"}>
        <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-zinc-100 dark:bg-zinc-900 md:h-40 md:w-40">
          {/* using <img> because avatar is a data URL */}
          <img
            src={avatarSrc}
            alt={`${content.full_name} avatar`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3">
          <TypographyH1 className="text-3xl font-bold md:text-4xl">
            {content.full_name}
          </TypographyH1>
          <TypographyP className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {content.short_description}
          </TypographyP>
          <TypographyP className="max-w-xl text-zinc-600 dark:text-zinc-400">
            {content.long_description}
          </TypographyP>
        </div>
      </CardContent>
    </Card>
  );
}
